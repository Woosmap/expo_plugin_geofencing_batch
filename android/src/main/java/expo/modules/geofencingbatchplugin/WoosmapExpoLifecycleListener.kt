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

    companion object {
        private const val TAG = "WoosmapExpoLifecycle"
        private const val BATCH_API_KEY = "BATCH_API_KEY"
    }

    override fun onCreate(application: Application) {
        super.onCreate(application)
        //startBatch(application)
        registerBroadcastReceiver(application)
    }

    private fun registerBroadcastReceiver(application: Application) {
        val filter = IntentFilter("com.woosmap.action.GEOFENCE_TRIGGERED")
        val receiver = GeofencingEventsReceiver()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            application.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        }
    }

    private fun startBatch(application: Application) {
        try {
            val appInfo = application.packageManager.getApplicationInfo(
                application.packageName,
                Context.MODE_PRIVATE
            )
            val batchApiKey = appInfo.metaData?.getString(BATCH_API_KEY)

            if (batchApiKey != null) {
                Log.d(TAG, "Initializing Batch SDK with API Key: $batchApiKey")
                Batch.start(batchApiKey)
                application.registerActivityLifecycleCallbacks(BatchActivityLifecycleHelper())
                Log.d(TAG, "Batch SDK initialized successfully.")
            } else {
                Log.d(TAG, "BATCH_API_KEY not found in application metadata. Skipping Batch SDK initialization.")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize Batch SDK", e)
        }
    }
}
