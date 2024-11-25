package expo.modules.geofencingbatchplugin

import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package

class WoosmapExpoPackage : Package {
    override fun createApplicationLifecycleListeners(context: Context): List<ApplicationLifecycleListener> {
        return listOf(WoosmapExpoLifecycleListener())
    }
}