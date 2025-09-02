# Changelog

All notable changes to the Macau Nutrition App will be documented in this file.

## [1.3.1] - 2024-12-XX

### Added
- Comprehensive README documentation
- Version tracking system
- Detailed changelog

### Changed
- **Translation System**: Complete overhaul of translation loading and persistence
- **UI Components**: Enhanced button styling and text rendering
- **Build System**: Updated Gradle and dependency configurations
- **Version Display**: Updated from 1.3.0 to 1.3.1

### Fixed
- **Critical**: "Continue Shopping" button translation not working due to bundle cache
- **Critical**: App defaulting to English instead of saved language preference
- **Build**: APK build failures due to deprecated JCenter repository
- **Build**: Gradle compatibility issues with Java 22
- **Network**: Emulator localhost connectivity issues
- **iOS**: CocoaPods installation and BoringSSL-GRPC compilation errors
- **Translation**: Hardcoded text not using translation functions
- **Styling**: Button text styling interfering with translations

### Technical Improvements
- Removed deprecated `jcenter()` repository from build.gradle
- Updated Gradle wrapper to version 8.8
- Added emulator localhost IP (10.0.2.2) to network security config
- Fixed translation system initialization to load saved language
- Implemented conditional font sizing for different languages
- Updated product cart item styling and font sizes
- Resolved bundle caching issues preventing code changes
- **Added Google Play 16 KB page size support** - Required for Android 15+ compliance
- Updated AndroidManifest.xml with `android:extractNativeLibs="false"`
- Modified build.gradle with NDK configuration and modern packaging options

### Translation Updates
- **English**:
  - "CONTINUE SHOPPING" (capitalized)
  - "CHECKOUT" (capitalized)
  - "Sub Total" for cart totals
  - "Items" for item count

- **Chinese**:
  - "繼續購物" for continue shopping
  - "結帳" for checkout
  - "合共" for totals
  - "件數" for item count

### UI/UX Enhancements
- "Continue Shopping" button: Black text, 2px letter spacing, conditional font sizing
- "CHECKOUT" button: Capital letters, 2px letter spacing
- Product name font size: Reduced from scale(16) to scale(15)
- Improved text readability and layout consistency

## [1.3.0] - Previous Version

### Features
- Initial app release
- Basic translation support
- Core shopping functionality
- Android and iOS compatibility

---

## Development Notes

### Build Process
1. Create fresh bundle: `npx @react-native-community/cli bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/`
2. Build APK: `cd android && ./gradlew assembleDebug`
3. Install and launch: `adb install -r app/build/outputs/apk/debug/app-debug.apk && adb shell am start -n com.macauntrition.app/com.macauntrition.app.MainActivity`

### Key Files Modified in 1.3.1
- `app/screens/Cart/index.js`
- `app/components/CheckOutItem.js`
- `app/components/CustomButton/index.js`
- `app/translation/index.js`
- `app/translation/resources/en.js`
- `app/translation/resources/cn.js`
- `app/screens/Login/index.js`
- `android/build.gradle`
- `android/gradle/wrapper/gradle-wrapper.properties`
- `android/app/src/main/res/xml/network_security_config.xml`
- `ios/Podfile`
- `react-native.config.js`
