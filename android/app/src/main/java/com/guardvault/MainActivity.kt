package com.guardvault

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

// for splash screen
// import android.os.Bundle;
// import org.devio.rn.splashscreen.SplashScreen;

class MainActivity : ReactActivity() {

   /** for splash screen
   * this STUPID CODE took my entire day to solve bug why gradle failed(after updating react native 0.73.6 to 0.83.1)
   * override fun onCreate(savedInstanceState: Bundle?) {
   * SplashScreen.show(this);  
   * super.onCreate(null)
  } */

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "GuardVault"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
