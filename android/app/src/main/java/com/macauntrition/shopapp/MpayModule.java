package com.macauntrition.shopapp;

import android.app.Activity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import java.util.concurrent.TimeUnit;
import android.os.Handler;
import android.os.Looper;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import java.util.HashMap;
import java.util.Map;
import android.util.Log;


import com.macau.pay.sdk.OpenSdk;
import com.macau.pay.sdk.interfaces.OpenSdkInterfaces;
import com.macau.pay.sdk.base.PayResult;


import org.json.JSONObject;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import okhttp3.*;



public class MpayModule extends ReactContextBaseJavaModule {
     private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
     private String orderUrl = "https://uatopenapi.macaupay.com.mo/masl/umpg/gateway";
    private static ReactApplicationContext reactContext;

    MpayModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "MpayModule";
    }
    @ReactMethod
    public void setEnvironmentType(int env, Promise promise) {
        OpenSdk.setEnvironmentType(env);
        promise.resolve("Mpay environment Set "+ env);
    }
    @ReactMethod
    public void setMPayAppId(int appId, Promise promise) {
        OpenSdk.setMPayAppId(appId);
        promise.resolve("Mpay appID set");
    }

    @ReactMethod
    public void allPay(String params, Promise promise) {
      Activity currentActivity = getCurrentActivity();
      if (currentActivity != null) {
          currentActivity.runOnUiThread(() -> {
              try {
                  OpenSdk.newPayAll(currentActivity, params, new OpenSdkInterfaces() {
                      @Override
                      public void OpenSDKInterfaces(PayResult payResult) {
                          handlePayResult(payResult, promise);
                      }

                      @Override
                      public void MPayInterfaces(PayResult payResult) {
                          handlePayResult(payResult, promise);
                      }

                      @Override
                      public void AliPayInterfaces(PayResult payResult) {
                          handlePayResult(payResult, promise);
                      }

                      @Override
                      public void WeChatPayInterfaces(PayResult payResult) {
                          handlePayResult(payResult, promise);
                      }

                      private void handlePayResult(PayResult payResult, Promise promise) {
                          if (payResult != null) {
                              String status = payResult.getResultStatus();
                              if ("9000".equals(status)) {
                                  promise.resolve(payResult.getResult()); // Payment successful
                              } else {
                                  promise.reject("PAYMENT_FAILED", payResult.getResult());
                              }
                          } else {
                              promise.reject("PAYMENT_ERROR", "PayResult is null");
                          }
                      }
                  });
              } catch (Exception e) {
                  promise.reject("CRITICAL", e.getMessage());
                  e.printStackTrace();
              }
          });
      } else {
          Log.e("allPay", "Current activity is null");
          promise.reject("CRITICAL", "Activity is null");
      }
  }



    @ReactMethod
    public void trasactionQuery(String params, Promise promise) {
      Activity currentActivity = getCurrentActivity();
       if (currentActivity != null) {
             currentActivity.runOnUiThread(new Runnable() {
                 @Override
                 public void run() {
                   try {
                     OpenSdk.newPayAll(getCurrentActivity(), params, new OpenSdkInterfaces() {
                         @Override
                         public void OpenSDKInterfaces(PayResult payResult) {
                             handlePayResult(payResult, promise);
                         }
                         @Override
                         public void MPayInterfaces(PayResult payResult) { handlePayResult(payResult, promise); }
                         @Override
                         public void AliPayInterfaces(PayResult payResult) { handlePayResult(payResult, promise); }
                         @Override
                         public void WeChatPayInterfaces(PayResult payResult) { handlePayResult(payResult, promise); }

                         private void handlePayResult(PayResult payResult, Promise promise) {
                             if (payResult != null) {
                                 if ("0000".equals(payResult.getResultStatus())) {
                                     promise.resolve(payResult.getResult());
                                 } else {
                                     promise.reject(payResult.getResult());
                                 }
                             } else {
                                 promise.reject("TRYAGAIN");
                             }
                         }
                     });
                   } catch (Exception e) {
                       promise.reject("CRITICAL");
                   }
                 }
             });
       } else {
           promise.reject("CRITICAL");
       }
    }
    @ReactMethod
    public void transacQapi(String params, Promise promise) {
      RequestBody body = RequestBody.create(JSON, params);
      Request request = new Request.Builder()
              .url(orderUrl)
              .post(body)
              .removeHeader("User-Agent")
              .addHeader("Content-Type", "application/json;charset=utf-8")
              .addHeader("accept", "*/*")
              .addHeader("connection", "Keep-Alive")
              .build();

      OkHttpClient client = new OkHttpClient.Builder()
              .connectTimeout(15, TimeUnit.SECONDS)
              .writeTimeout(15, TimeUnit.SECONDS)
              .readTimeout(30, TimeUnit.SECONDS)
              .build();

      Handler mainHandler = new Handler(Looper.getMainLooper());

      client.newCall(request).enqueue(new Callback() {
          @Override
          public void onFailure(Call call, IOException e) {
              mainHandler.post(() -> promise.reject("NETWORK_ERROR", e.getMessage()));
          }

          @Override
          public void onResponse(Call call, Response response) throws IOException {
              mainHandler.post(() -> {
                  try {
                      if (response.code() == 200) {
                          String result = response.body() != null ? response.body().string() : null;
                          if (result == null) {
                              promise.reject("EMPTY_RESPONSE", "Response body is null");
                              return;
                          }

                          JSONObject resultObj = new JSONObject(result);
                          String isSuccess = resultObj.optString("is_success", "F");
                          if ("T".equals(isSuccess)) {
                              promise.resolve(result);
                          } else {
                              promise.reject("API_ERROR", "Response indicated failure: " + result);
                          }
                      } else {
                          promise.reject("HTTP_ERROR", "HTTP error: " + response.code() + " - " + response.message());
                      }
                  } catch (Exception e) {
                      promise.reject("JSON_PARSE_ERROR", "Error parsing response: " + e.getMessage());
                  } finally {
                      response.close();
                  }
              });
          }
      });
  }

}
