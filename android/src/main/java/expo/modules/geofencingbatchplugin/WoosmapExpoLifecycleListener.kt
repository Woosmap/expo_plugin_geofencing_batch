package expo.modules.geofencingbatchplugin

import android.app.Application
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import com.batch.android.Batch
import com.batch.android.BatchActivityLifecycleHelper
import com.webgeoservices.woosmapgeofencing.PositionsManager
import com.webgeoservices.woosmapgeofencing.WoosmapSettings
import com.webgeoservices.woosmapgeofencingcore.database.WoosmapDb
import expo.modules.core.interfaces.ApplicationLifecycleListener
import org.json.JSONObject
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class WoosmapExpoLifecycleListener : ApplicationLifecycleListener {
    private var positionsManager: PositionsManager? = null
    private var woosmapDb: WoosmapDb? = null
    private val executorService: ExecutorService = Executors.newSingleThreadExecutor()

    override fun onCreate(application: Application) {
        super.onCreate(application)
        WoosmapSettings.privateKeyWoosmapAPI = ""
        WoosmapSettings.searchAPIEnable = true

        executorService.execute {
            woosmapDb = WoosmapDb.getInstance(application.applicationContext)
            val dbInstance = woosmapDb
            positionsManager = dbInstance?.let {
                PositionsManager(application.applicationContext,
                    it
                )
            }
            positionsManager?.searchAPI(19.211771554276368, 72.8646941303407, -1)

            startBatch(application)
            registerBroadcastReceiver(application)

            try {
                Thread.sleep(2000)
                val intent = getIntent()
                application.sendBroadcast(intent)
            } catch (ignored: Exception) {
            }
        }
    }

    private fun getIntent(): Intent {
        val data = JSONObject().apply {
            put("identifier", "dhruv_apt")
            put("eventname", "entered")
            put("longitude", 72.8646941303407)
            put("latitude", 19.211771554276368)
            put("date", System.currentTimeMillis())
            put("didenter", true)
            put("radius", 100.0)
            put("frompositiondetection", true)
            put("spenttime", 23)
        }
        return Intent("com.woosmap.action.GEOFENCE_TRIGGERED").apply {
            putExtra("regionLog", data.toString())
        }
    }

    private fun registerBroadcastReceiver(application: Application) {
        val filter = IntentFilter("com.woosmap.action.GEOFENCE_TRIGGERED")
        val receiver = GeofencingEventsReceiver()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            application.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        }
    }

    private fun startBatch(application: Application) {
        Batch.start("")
        application.registerActivityLifecycleCallbacks(BatchActivityLifecycleHelper())
    }
}
