package expo.modules.geofencingbatchplugin;

import android.content.Context;

import java.util.Collections;
import java.util.List;

import expo.modules.core.interfaces.ApplicationLifecycleListener;
import expo.modules.core.interfaces.Package;

public class WoosmapExpoPackage implements Package {
    @Override
    public List<? extends ApplicationLifecycleListener> createApplicationLifecycleListeners(Context context) {
        return Collections.singletonList(new WoosmapExpoLifecycleListener());
    }
}
