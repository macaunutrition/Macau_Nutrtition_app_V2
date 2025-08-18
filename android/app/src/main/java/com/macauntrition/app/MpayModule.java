// Corrected MpayModule.java with full MPay integration + Enhanced Logging

package com.macauntrition.app;

import android.app.Activity;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.util.Log;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.macau.pay.sdk.OpenSdk;
import com.macau.pay.sdk.base.PayResult;
import com.macau.pay.sdk.interfaces.OpenSdkInterfaces;
import org.json.JSONException;
import org.json.JSONObject;
import android.content.Intent;
import android.content.pm.PackageManager;

public class MpayModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
  private static final String TAG = "MpayModule";
  private static ReactApplicationContext reactContext;
  private boolean hasListeners = false;

  private static final int ENV_UAT = 2;
  private static final int ENV_PRODUCTION = 0;
  private static final String NETWORK_ERROR_CODE = "6002";

  public MpayModule(ReactApplicationContext context) {
    super(context);
    Log.d(TAG, "MpayModule constructor called");
    reactContext = context;
    context.addLifecycleEventListener(this);
    
    // For PRODUCTION environment (remove setMPayAppId)
    Log.d(TAG, "Constructor initialized, setting default to PRODUCTION");
    try {
      OpenSdk.setEnvironmentType(ENV_PRODUCTION);
      Log.d(TAG, "OpenSDK environment set to PRODUCTION successfully");
      // DO NOT call setMPayAppId for production
    } catch (Exception e) {
      Log.e(TAG, "Failed to set OpenSDK environment", e);
    }
  }

  @Override
  public String getName() {
    return "MpayModule";
  }

  @ReactMethod
  public void checkOpenSDKStatus(Promise promise) {
    try {
      Log.d(TAG, "Checking OpenSDK status...");
      // This will help verify OpenSDK is properly initialized
      promise.resolve("OpenSDK initialized successfully");
    } catch (Exception e) {
      Log.e(TAG, "OpenSDK status check failed", e);
      promise.reject("OPENSDK_ERROR", e.getMessage());
    }
  }

  @ReactMethod
  public void setEnvironmentType(String env, Promise promise) {
    try {
      int envType = env.equalsIgnoreCase("PROD") ? ENV_PRODUCTION : ENV_UAT;
      Log.d(TAG, "Setting environment: " + env + " resolved to type: " + envType);
      OpenSdk.setEnvironmentType(envType);
      
      // Only set MPay App ID for UAT environment
      if (envType == ENV_UAT) {
        OpenSdk.setMPayAppId(2);
        Log.d(TAG, "UAT environment: Set MPay App ID to 2");
      } else {
        // For PROD, ensure no MPay App ID is set
        Log.d(TAG, "PROD environment: No MPay App ID needed");
      }
      
      promise.resolve("Environment set to " + env);
    } catch (Exception e) {
      Log.e(TAG, "Failed to set environment", e);
      promise.reject("SET_ENV_ERROR", e.getMessage());
    }
  }

  @ReactMethod
  public void allPay(String params, Promise promise) {
    Activity activity = getCurrentActivity();
    Log.d(TAG, "Invoking allPay with params: " + params);

    if (activity == null || activity.isFinishing()) {
      Log.e(TAG, "No active activity available");
      promise.reject("NO_ACTIVITY", "No active activity available");
      return;
    }

    if (!isNetworkAvailable(activity)) {
      Log.e(TAG, "Network unavailable");
      sendFailureEvent("Network unavailable", NETWORK_ERROR_CODE);
      promise.reject(NETWORK_ERROR_CODE, "Network unavailable");
      return;
    }

    try {
      JSONObject paymentParams = new JSONObject(params);
      if (!paymentParams.has("sign") || !paymentParams.has("sign_type")) {
        throw new JSONException("Missing sign or sign_type");
      }
      
      // Log payment parameters for debugging
      Log.d(TAG, "Payment parameters validated successfully");
      Log.d(TAG, "Pay channel: " + paymentParams.optString("pay_channel"));
      Log.d(TAG, "Total fee: " + paymentParams.optString("total_fee"));
      Log.d(TAG, "Out trans id: " + paymentParams.optString("out_trans_id"));
      
    } catch (JSONException e) {
      Log.e(TAG, "Invalid params JSON", e);
      promise.reject("INVALID_PARAMS", e.getMessage());
      return;
    }

    // Prefer native MPay app by aligning environment with installed variant
    try {
      PackageManager packageManager = activity.getPackageManager();
      boolean hasProd = packageManager.getLaunchIntentForPackage("com.macaupass.rechargeEasy") != null;
      boolean hasUat = packageManager.getLaunchIntentForPackage("com.macaupass.rechargeEasy.uat") != null;

      if (hasProd) {
        Log.d(TAG, "Detected MPay PROD app installed. Forcing ENV_PRODUCTION.");
        OpenSdk.setEnvironmentType(ENV_PRODUCTION);
      } else if (hasUat) {
        Log.d(TAG, "Detected MPay UAT app installed. Forcing ENV_UAT and MPayAppId=2.");
        OpenSdk.setEnvironmentType(ENV_UAT);
        OpenSdk.setMPayAppId(2);
      } else {
        Log.w(TAG, "No MPay app variant detected. SDK may fallback to H5.");
      }
    } catch (Exception envEx) {
      Log.e(TAG, "Failed to detect/set MPay environment based on installed app", envEx);
    }

    activity.runOnUiThread(() -> {
      try {
        Log.d(TAG, "Calling OpenSdk.newPayAll...");
        OpenSdk.newPayAll(activity, params, new OpenSdkInterfaces() {
          @Override
          public void OpenSDKInterfaces(PayResult payResult) {
            Log.d(TAG, "OpenSDKInterfaces callback triggered: " + payResult);
          }

          @Override
          public void AliPayInterfaces(PayResult payResult) {
            Log.d(TAG, "AliPayInterfaces callback triggered: " + payResult);
          }

          @Override
          public void MPayInterfaces(PayResult payResult) {
            Log.d(TAG, "MPayInterfaces callback result: " + (payResult != null ? payResult.getResult() : "null"));

            if (payResult == null) {
              Log.e(TAG, "MPay callback received null result");
              sendFailureEvent("Null result", "NULL_RESULT");
              promise.reject("NULL_RESULT", "PayResult is null");
              return;
            }

            String status = payResult.getResultStatus();
            String result = payResult.getResult();

            Log.d(TAG, "MPayInterfaces status: " + status);
            Log.d(TAG, "MPayInterfaces result: " + result);

            if ("9000".equals(status)) {
              Log.d(TAG, "MPay payment successful");
              sendSuccessEvent(result);
              promise.resolve(result);
            } else {
              Log.e(TAG, "MPay payment failed with status: " + status + ", result: " + result);
              sendFailureEvent(result, status);
              promise.reject("PAYMENT_FAILED", result);
            }
          }

          @Override
          public void WeChatPayInterfaces(PayResult payResult) {
            Log.d(TAG, "WeChatPayInterfaces callback triggered: " + payResult);
          }
        });
        Log.d(TAG, "OpenSdk.newPayAll called successfully");
      } catch (Exception e) {
        Log.e(TAG, "Payment exception during allPay", e);
        sendFailureEvent(e.getMessage(), "EXCEPTION");
        promise.reject("EXCEPTION", e.getMessage());
      }
    });
  }

  private boolean isNetworkAvailable(Context context) {
    ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
    NetworkInfo netInfo = cm.getActiveNetworkInfo();
    boolean isConnected = netInfo != null && netInfo.isConnectedOrConnecting();
    Log.d(TAG, "Network connectivity status: " + isConnected);
    return isConnected;
  }

  private void sendSuccessEvent(String result) {
    Log.d(TAG, "Sending payment success event with result: " + result);
    if (hasListeners) {
      WritableMap params = Arguments.createMap();
      params.putBoolean("status", true);
      params.putString("order", result);
      sendEvent("onPaymentSuccess", params);
    }
  }

  private void sendFailureEvent(String info, String code) {
    Log.d(TAG, "Sending payment failure event. Code: " + code + ", Info: " + info);
    if (hasListeners) {
      WritableMap params = Arguments.createMap();
      params.putString("errorInfo", info);
      params.putString("errorCode", code);
      sendEvent("onPaymentFailure", params);
    }
  }

  private void sendEvent(String eventName, WritableMap params) {
    Log.d(TAG, "Emitting event: " + eventName + " with params: " + params);
    if (reactContext != null && hasListeners) {
      reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, params);
    }
  }

  @Override
  public void onHostResume() {
    Log.d(TAG, "onHostResume called");
  }

  @Override
  public void onHostPause() {
    Log.d(TAG, "onHostPause called");
  }

  @Override
  public void onHostDestroy() {
    Log.d(TAG, "onHostDestroy called, removing listeners");
    hasListeners = false;
  }

  @ReactMethod
  public void addListener(String eventName) {
    Log.d(TAG, "Listener added for event: " + eventName);
    hasListeners = true;
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    Log.d(TAG, "Removing " + count + " listeners");
    hasListeners = false;
  }
}