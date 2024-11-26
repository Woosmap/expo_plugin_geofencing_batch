package expo.modules.geofencingbatchplugin

import android.app.Application
import android.content.Context
import android.content.IntentFilter
import android.os.Build
import android.util.Log
import com.batch.android.Batch
import com.batch.android.BatchActivityLifecycleHelper
import expo.modules.core.interfaces.ApplicationLifecycleListener

class WoosmapExpoLifecycleListener : ApplicationLifecycleListener {

    override fun onCreate(application: Application) {
        super.onCreate(application)
        registerBroadcastReceiver(application)
    }

    private fun registerBroadcastReceiver(application: Application) {
        val filter = IntentFilter("com.woosmap.action.GEOFENCE_TRIGGERED")
        val receiver = GeofencingEventsReceiver()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            application.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        }
    }
}
