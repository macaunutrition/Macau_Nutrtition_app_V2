package com.macauntrition.app;
import expo.modules.ReactActivityDelegateWrapper;
import com.facebook.react.ReactActivityDelegate;

import com.facebook.react.ReactActivity;

import android.os.Bundle;
import com.zoontek.rnbootsplash.RNBootSplash;

public class MainActivity extends ReactActivity {

  private static final boolean IS_NEW_ARCHITECTURE_ENABLED = false;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "macaunutrition";
  }
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      RNBootSplash.init(this, R.style.BootTheme);
      super.onCreate(savedInstanceState);
  }
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegateWrapper(this, IS_NEW_ARCHITECTURE_ENABLED,
      new ReactActivityDelegate(this, getMainComponentName())
    );
  }
}
