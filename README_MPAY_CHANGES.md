# MPay Integration Changes and Setup

This document summarizes the Android changes made to ensure the MPay native app is invoked (avoiding H5 fallback) and how to configure environments.

## Code Changes

- `android/app/src/main/java/com/macauntrition/app/MpayModule.java`
  - Default environment set to PRODUCTION via `OpenSdk.setEnvironmentType(0)`.
  - Do NOT call `OpenSdk.setMPayAppId(2)` in PROD (only for UAT).
  - Added app availability checks, better logging, and network guard.
  - In `allPay`, environment is adjusted dynamically if UAT/PROD MPay is detected on device.

- `android/app/src/main/AndroidManifest.xml`
  - Added package visibility for Android 11+ under `<queries>`:
    - `com.macaupass.rechargeEasy`, `com.macaupass.rechargeEasy.uat`, `com.macaupass.rechargeEasy.sit`, `com.tencent.mm`, and Alipay variants.
  - Added callback intent-filters with `BROWSABLE` category for schemes: `mpay`, `macaupass`.

- `app/services/paymentHelper.js`
  - Ensures environment set to "PROD" via `MpayModule.setEnvironmentType("PROD")` before initiating payment.

## Expected Behavior
- If MPay PROD app is installed (`com.macaupass.rechargeEasy`), OpenSDK launches it.
- If UAT variant is installed, OpenSDK switches to UAT.
- If no MPay app present, SDK may fallback to H5.

## Build Environment
- JDK 17 (Temurin).
- Android SDK installed and licenses accepted.
- NDK path configured via `local.properties` (legacy) — consider migrating to `android.ndkVersion` in `build.gradle`.

## Testing Steps
1. Install the APK on a device with MPay app installed (PROD preferred).
2. Place an order and tap Pay — device should open the MPay app.
3. After completion, app returns and completes order flow.

## Notes
- WeChat/Alipay packages are whitelisted for visibility. Ensure WeChat AppID/signature are valid if used.
- If your server signs MPay parameters, ensure signature fields (`sign`, `sign_type`) are provided correctly; otherwise the SDK may fallback to web.
