package com.awesomeproject;

import com.facebook.react.ReactActivity;
import android.content.res.Configuration;

import android.content.res.Resources;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "AwesomeProject";
  }

  @Override

  public Resources getResources() {

    Resources res = super.getResources();

    Configuration config=new Configuration();

    config.setToDefaults();

    res.updateConfiguration(config,res.getDisplayMetrics() );

    return res;

  }

}
