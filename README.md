# Macau Nutrition App - Version 1.3.1

## 📱 Overview
A comprehensive React Native mobile application for Macau Nutrition, supporting both Android and iOS platforms with bilingual support (English/Chinese).

## 🚀 Recent Updates - Version 1.3.1

### 🔧 Major Fixes & Improvements

#### 1. **Translation System Overhaul**
- **Fixed "Continue Shopping" button translation issue** - Resolved bundle cache problem that prevented translation updates
- **Updated translation keys**:
  - English: "CONTINUE SHOPPING" 
  - Chinese: "繼續購物"
- **Fixed "TOTAL" text translation**:
  - English: "Sub Total"
  - Chinese: "合共"
- **Updated "Items" translation**:
  - English: "Items"
  - Chinese: "件數"
- **Fixed "Total:" in product cart**:
  - English: "Sub Total:"
  - Chinese: "合共:"

#### 2. **UI/UX Improvements**
- **Button Styling Enhancements**:
  - "Continue Shopping" button: Black text, 2px letter spacing
  - "CHECKOUT" button: Capital letters, 2px letter spacing
  - Conditional font sizing: English scale(12), Chinese scale(16) for "Continue Shopping"
- **Product Cart Improvements**:
  - Product name font size reduced from scale(16) to scale(15)
  - Improved text readability and layout consistency

#### 3. **Build System Fixes**
- **Resolved APK build issues**:
  - Removed deprecated `jcenter()` repository
  - Updated Gradle version to 8.8 for Java 22 compatibility
  - Fixed network security configuration for emulator localhost
- **iOS Build Improvements**:
  - Fixed CocoaPods installation issues
  - Resolved BoringSSL-GRPC compilation errors
  - Updated Xcode project configuration

#### 4. **Translation System Initialization**
- **Fixed language persistence** - App now properly loads saved language from AsyncStorage on startup
- **Improved translation loading** - Prevents defaulting to English when Chinese is selected

#### 5. **Google Play 16 KB Page Size Support**
- **Added 16 KB page size support** - Required for Google Play apps targeting Android 15+
- **Updated AndroidManifest.xml** - Added `android:extractNativeLibs="false"`
- **Modified build configuration** - Added NDK configuration and modern packaging options
- **Compliance ready** - Meets Google Play deadline requirements (Nov 1, 2025)

## 🛠 Technical Details

### Build Configuration
- **Android**: Gradle 8.8, Java 17 compatibility
- **iOS**: Xcode 14+ support, CocoaPods integration
- **React Native**: Latest stable version with Metro bundler

### Key Components Modified
1. `app/screens/Cart/index.js` - Shopping cart translation and styling
2. `app/components/CheckOutItem.js` - Product cart item translations
3. `app/components/CustomButton/index.js` - Button component improvements
4. `app/translation/index.js` - Translation system initialization
5. `app/translation/resources/en.js` - English translations
6. `app/translation/resources/cn.js` - Chinese translations
7. `app/screens/Login/index.js` - Version number update

### Build Files Updated
- `android/build.gradle` - Repository configuration
- `android/gradle/wrapper/gradle-wrapper.properties` - Gradle version
- `android/app/src/main/res/xml/network_security_config.xml` - Network security
- `ios/Podfile` - CocoaPods configuration
- `react-native.config.js` - React Native configuration

## 🌐 Internationalization (i18n)

### Supported Languages
- **English (en)** - Default language
- **Chinese (cn)** - Traditional Chinese support

### Translation Features
- Dynamic language switching
- Persistent language selection
- Context-aware translations
- Proper Chinese character rendering

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Java 17 (for Android builds)

### Installation Steps
1. Clone the repository
2. Install dependencies: `npm install`
3. iOS setup: `cd ios && pod install`
4. Android setup: Configure Android SDK
5. Run the app:
   - Android: `npx react-native run-android`
   - iOS: `npx react-native run-ios`

## 🔧 Development Commands

### Building the App
```bash
# Create fresh bundle
npx @react-native-community/cli bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

# Build Android APK
cd android && ./gradlew assembleDebug

# Install and launch
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.macauntrition.app/com.macauntrition.app.MainActivity
```

### Translation Management
- English translations: `app/translation/resources/en.js`
- Chinese translations: `app/translation/resources/cn.js`
- Translation system: `app/translation/index.js`

## 🐛 Bug Fixes in Version 1.3.1

1. **Bundle Cache Issue** - Resolved pre-compiled bundle preventing code changes
2. **Translation Loading** - Fixed language not persisting on app restart
3. **Build Failures** - Resolved JCenter and Gradle compatibility issues
4. **Network Security** - Fixed emulator localhost connectivity
5. **iOS Compilation** - Resolved BoringSSL-GRPC build errors
6. **Button Styling** - Fixed translation interference with button text

## 📱 App Features

### Core Functionality
- User authentication and registration
- Product catalog with search and filtering
- Shopping cart management
- Checkout process with multiple steps
- Order tracking and history
- Push notifications
- Multi-language support

### UI Components
- Custom button components with translation support
- Responsive design with scaling
- Material Design principles
- Consistent styling across platforms

## 🔄 Version History

### Version 1.3.1 (Current)
- Translation system fixes
- UI/UX improvements
- Build system updates
- Bug fixes and stability improvements

### Version 1.3.0 (Previous)
- Initial release with core functionality
- Basic translation support
- Android and iOS compatibility

## 📞 Support

For technical support or questions:
- Website: https://macaunutrition.com/macaunutritiona.html
- Email: Support contact available through app

## 📄 License

This project is proprietary software developed for Macau Nutrition.

---

**Last Updated**: December 2024  
**Version**: 1.3.1  
**Platforms**: Android, iOS  
**Languages**: English, Chinese (Traditional)
