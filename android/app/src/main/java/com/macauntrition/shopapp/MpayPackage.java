package com.macauntrition.shopapp;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MpayPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new MpayModule(reactContext));
        return modules;
    }

    // @Override
    // public List<JavaScriptModule> createJSModules() {
    //     return Collections.emptyList();
    // }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
