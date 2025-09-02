# 16 KB Page Size Support - Google Play Requirement

## 📋 Overview
This document outlines the implementation of 16 KB page size support for the Macau Nutrition App to comply with Google Play's requirements for apps targeting Android 15+.

## 🚨 Google Play Requirement
- **Deadline**: November 1, 2025 (extendable to May 31, 2026)
- **Requirement**: All apps targeting Android 15+ must support 16 KB memory page sizes
- **Impact**: Apps without 16 KB support cannot release updates after the deadline

## 🔧 Implementation Details

### 1. AndroidManifest.xml Changes
Added `android:extractNativeLibs="false"` to the application tag:

```xml
<application
  android:name=".MainApplication"
  android:label="@string/app_name"
  android:icon="@mipmap/ic_launcher"
  android:roundIcon="@mipmap/ic_launcher_round"
  android:allowBackup="false"
  android:usesCleartextTraffic="true"
  android:networkSecurityConfig="@xml/network_security_config"
  android:extractNativeLibs="false"
  android:theme="@style/BootTheme">
```

**Purpose**: Prevents native libraries from being extracted to the file system, which is required for 16 KB page size support.

### 2. Build.gradle Configuration
Updated `android/app/build.gradle` with 16 KB page size support:

```gradle
defaultConfig {
    applicationId "com.macauntrition.app"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 3
    versionName "1.3.1"
    
    // Support for 16 KB page sizes (Google Play requirement for Android 15+)
    ndk {
        abiFilters "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
    }
    
    // Ensure native libraries are not extracted (required for 16 KB page sizes)
    packagingOptions {
        jniLibs {
            useLegacyPackaging = false
        }
    }
}
```

**Key Changes**:
- Added NDK ABI filters for all supported architectures
- Configured packaging options to use modern native library packaging
- Disabled legacy packaging which is incompatible with 16 KB page sizes

### 3. Version Update
- **Version Name**: Updated from "1.3.0" to "1.3.1"
- **Version Code**: Maintained at 3
- **Build Configuration**: Updated to reflect 16 KB page size support

## 🏗 Architecture Support

### Supported ABIs
- **armeabi-v7a**: 32-bit ARM architecture
- **arm64-v8a**: 64-bit ARM architecture (primary)
- **x86**: 32-bit x86 architecture (emulators)
- **x86_64**: 64-bit x86 architecture (emulators)

### Native Library Handling
- **Extraction**: Disabled (`extractNativeLibs="false"`)
- **Packaging**: Modern packaging enabled
- **Loading**: Libraries loaded directly from APK

## 🧪 Testing Requirements

### Test Scenarios
1. **App Installation**: Verify app installs correctly on devices with 16 KB page sizes
2. **Native Libraries**: Ensure all native libraries load properly
3. **Performance**: Monitor app performance with new configuration
4. **Compatibility**: Test on various Android versions and devices

### Test Devices
- **Android 15+ devices** (when available)
- **Emulators** with 16 KB page size configuration
- **Various screen sizes** and architectures

## 📊 Impact Analysis

### Positive Impacts
- **Compliance**: Meets Google Play requirements
- **Future-proofing**: Ensures app can be updated after deadline
- **Performance**: Potential performance improvements on 16 KB page size devices
- **Security**: Enhanced security with non-extracted native libraries

### Considerations
- **APK Size**: May slightly increase APK size due to native library packaging
- **Loading Time**: Initial app load may be slightly slower
- **Compatibility**: Ensures compatibility with future Android versions

## 🔄 Migration Steps

### 1. Code Changes
- [x] Updated AndroidManifest.xml with `extractNativeLibs="false"`
- [x] Modified build.gradle with NDK configuration
- [x] Updated version to 1.3.1

### 2. Build Process
```bash
# Clean build
cd android
./gradlew clean

# Build with 16 KB page size support
./gradlew assembleDebug

# Test installation
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### 3. Verification
- [x] App builds successfully
- [x] Native libraries properly configured
- [x] Version updated correctly
- [ ] Test on 16 KB page size devices (when available)

## 📱 Google Play Console

### Upload Requirements
- **Target SDK**: 34 (current)
- **16 KB Support**: Enabled
- **Native Libraries**: Properly configured
- **Version**: 1.3.1

### Play Console Settings
1. Navigate to **Release** → **Production**
2. Upload new APK with 16 KB support
3. Verify **16 KB page size support** is detected
4. Complete release process

## 🚀 Deployment Timeline

### Immediate Actions
- [x] Implement 16 KB page size support
- [x] Update version to 1.3.1
- [x] Test build process
- [ ] Deploy to Google Play Console

### Future Considerations
- **Deadline**: November 1, 2025 (or May 31, 2026 with extension)
- **Monitoring**: Track app performance on 16 KB page size devices
- **Updates**: Ensure all future updates maintain 16 KB support

## 🔍 Troubleshooting

### Common Issues
1. **Build Failures**: Ensure NDK is properly configured
2. **Native Library Errors**: Verify `extractNativeLibs="false"`
3. **Performance Issues**: Monitor app performance metrics
4. **Compatibility**: Test on various device configurations

### Solutions
- **Clean Build**: Use `./gradlew clean` before building
- **NDK Version**: Ensure compatible NDK version
- **Gradle Version**: Use Gradle 8.8+ for best compatibility
- **Testing**: Comprehensive testing on target devices

## 📞 Support

### Resources
- **Google Play Documentation**: [16 KB Page Size Support](https://developer.android.com/about/versions/15/behavior-changes-15#16kb-page-sizes)
- **Android Developer Guide**: Native library optimization
- **React Native Documentation**: Native module configuration

### Contact
- **Technical Support**: Available through app
- **Website**: https://macaunutrition.com/macaunutritiona.html

---

**Implementation Date**: December 2024  
**Version**: 1.3.1  
**Status**: Ready for Google Play Upload  
**Compliance**: Google Play 16 KB Page Size Requirement
