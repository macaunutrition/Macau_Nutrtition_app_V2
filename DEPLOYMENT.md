# Deployment Guide - Macau Nutrition App v1.3.1

## 🚀 Pre-Deployment Checklist

### ✅ Code Quality
- [x] All translation issues resolved
- [x] UI/UX improvements implemented
- [x] Build system fixes applied
- [x] Version number updated to 1.3.1
- [x] README and documentation updated

### ✅ Testing Completed
- [x] Translation system working correctly
- [x] Button styling and text rendering
- [x] Build process successful
- [x] App installation and launch
- [x] Language switching functionality

## 📦 Build Process

### Android Build
```bash
# 1. Create fresh bundle
cd /path/to/MacauAppAndroidNiOS
npx @react-native-community/cli bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

# 2. Build APK
cd android
export JAVA_HOME=/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home
./gradlew assembleDebug

# 3. Install and test
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.macauntrition.app/com.macauntrition.app.MainActivity
```

### iOS Build
```bash
# 1. Install pods
cd ios
pod install

# 2. Build in Xcode
open macaunutrition.xcworkspace
# Build and run in Xcode simulator or device
```

## 🔧 Environment Requirements

### Development Environment
- **Node.js**: 16+ 
- **React Native CLI**: Latest
- **Java**: 17 (for Android builds)
- **Android Studio**: Latest
- **Xcode**: 14+ (for iOS)
- **CocoaPods**: Latest

### Build Tools
- **Gradle**: 8.8
- **Android SDK**: API 34
- **iOS Deployment Target**: 13.4+

## 📱 Platform-Specific Notes

### Android
- **Target SDK**: 34
- **Min SDK**: 23
- **Build Tools**: 33.0.1
- **Network Security**: Configured for localhost and production domains

### iOS
- **Deployment Target**: 13.4
- **Xcode Version**: 14+
- **CocoaPods**: Latest version
- **BoringSSL-GRPC**: Fixed compilation issues

## 🌐 Translation System

### Language Support
- **English (en)**: Default language
- **Chinese (cn)**: Traditional Chinese

### Translation Files
- `app/translation/resources/en.js` - English translations
- `app/translation/resources/cn.js` - Chinese translations
- `app/translation/index.js` - Translation system configuration

### Key Translations Updated
- Continue Shopping: "CONTINUE SHOPPING" / "繼續購物"
- Checkout: "CHECKOUT" / "結帳"
- Total: "Sub Total" / "合共"
- Items: "Items" / "件數"

## 🔄 Version Management

### Current Version
- **Version**: 1.3.1
- **Display Location**: Login page bottom
- **Code Location**: `app/screens/Login/index.js` line 281

### Version History
- **1.3.1**: Current - Translation fixes, UI improvements, build fixes
- **1.3.0**: Previous - Initial release with core functionality

## 📋 Deployment Steps

### 1. Code Preparation
```bash
# Ensure all changes are committed
git add .
git commit -m "Release v1.3.1 - Translation fixes and UI improvements"
```

### 2. Build Verification
```bash
# Test Android build
./gradlew assembleDebug

# Test iOS build (in Xcode)
# Open macaunutrition.xcworkspace and build
```

### 3. Testing Checklist
- [ ] App launches successfully
- [ ] Translation system works
- [ ] Language switching functions
- [ ] All buttons display correct text
- [ ] Shopping cart functionality
- [ ] Checkout process
- [ ] Version number displays correctly

### 4. Release Preparation
```bash
# Create release tag
git tag -a v1.3.1 -m "Release version 1.3.1"
git push origin v1.3.1
```

## 🚨 Known Issues & Solutions

### Build Issues
1. **JCenter Repository**: Removed deprecated repository
2. **Gradle Version**: Updated to 8.8 for Java compatibility
3. **Network Security**: Added localhost configuration
4. **CocoaPods**: Fixed installation and compilation issues

### Translation Issues
1. **Bundle Cache**: Resolved by creating fresh bundles
2. **Language Persistence**: Fixed AsyncStorage loading
3. **Hardcoded Text**: Replaced with translation functions

## 📞 Support Information

### Technical Support
- **Website**: https://macaunutrition.com/macaunutritiona.html
- **App Support**: Available through in-app help section

### Development Team
- **Platform**: React Native
- **Backend**: Firebase Firestore
- **Payment**: Integrated payment system
- **Notifications**: Firebase Cloud Messaging

## 📊 Performance Metrics

### Build Performance
- **Android APK Size**: Optimized
- **iOS Bundle Size**: Optimized
- **Build Time**: Improved with Gradle 8.8
- **Memory Usage**: Optimized

### App Performance
- **Launch Time**: Improved
- **Translation Loading**: Faster
- **UI Responsiveness**: Enhanced
- **Memory Management**: Optimized

---

**Deployment Date**: December 2024  
**Version**: 1.3.1  
**Status**: Ready for Production
