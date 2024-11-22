package expo.modules.geofencingbatchplugin;

import android.app.Application;

import expo.modules.core.interfaces.ApplicationLifecycleListener;

public class WoosmapExpoLifecycleListener implements ApplicationLifecycleListener {
    @Override
    public void onCreate(Application application) {
        ApplicationLifecycleListener.super.onCreate(application);

    }
}
