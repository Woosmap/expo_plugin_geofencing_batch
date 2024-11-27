package expo.modules.geofencingbatchplugin

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.batch.android.Batch
import com.batch.android.BatchEventAttributes
import com.webgeoservices.woosmapgeofencingcore.database.POI
import com.webgeoservices.woosmapgeofencingcore.database.WoosmapDb
import org.json.JSONException
import org.json.JSONObject
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class GeofencingEventsReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "GeofencingReceiver"
    }

    private val executorService: ExecutorService = Executors.newSingleThreadExecutor()

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "Received broadcast")
        executorService.execute {
            try {
                Log.d(TAG, "executorService.execute")
                val regionData = JSONObject(intent.getStringExtra("regionLog") ?: "{}")
                val attributes = BatchEventAttributes().apply {
                    put("id", regionData.getString("identifier"))
                    put("longitude", regionData.getDouble("longitude"))
                    put("latitude", regionData.getDouble("latitude"))
                    put("date", regionData.getLong("date"))
                    put("radius", regionData.getDouble("radius"))
                }

                // Fetch the POI from the database
                val poi = WoosmapDb.getInstance(context).getPOIsDAO()
                    .getPOIbyStoreId(regionData.getString("identifier"))
                poi?.let {
                    it.idStore?.let { idStore -> attributes.put("id_store", idStore) }
                    it.name?.let { name -> attributes.put("name", name) }
                    it.address?.let { address -> attributes.put("address", address) }
                    it.city?.let { city -> attributes.put("city", city) }
                    it.countryCode?.let { countryCode -> attributes.put("country_code", countryCode) }
                    attributes.put("distance", it.distance)
                    it.types?.let { types -> attributes.put("types", types) }
                    it.tags?.let { tags -> attributes.put("tags", tags) }
                    it.zipCode?.let { zipCode -> attributes.put("zip_code", zipCode) }

                    it.userProperties?.let { userProperties ->
                        val userPropertiesJson = JSONObject(userProperties)
                        processJSONObject(userPropertiesJson, attributes, "")
                    }
                }

                // Track the event with Batch
                try {
                    Batch.Profile.trackEvent(regionData.getString("eventname"), attributes)
                } catch (e: Exception) {
                    Log.e(TAG, "Error tracking event in Batch", e)
                }
            } catch (exception: Exception) {
                Log.e(TAG, "Error processing geofencing event", exception)
            }
        }
    }

    // Helper function to process JSONObject recursively
    @Throws(JSONException::class)
    private fun processJSONObject(jsonObject: JSONObject, attributes: BatchEventAttributes, parentKey: String) {
        val keys = jsonObject.keys()
        while (keys.hasNext()) {
            if (attributes.attributes.size == 20) break
            val key = keys.next()
            val value = jsonObject[key]
            val fullKey = if (parentKey.isEmpty()) key else "${parentKey}_$key"
            var formattedKey = fullKey.replace(Regex("([A-Z])"), "_$1").lowercase()

            // Skip attributes with empty or whitespace-only values
            if (value is String && value.isBlank()) continue

            // Validate key: only allow a-zA-Z0-9_ and max length 30
            if (!formattedKey.matches(Regex("^[a-zA-Z0-9_]{1,30}$"))) {
                formattedKey = formattedKey.replace(Regex("[^a-zA-Z0-9_]"), "_")
                if (formattedKey.length > 30) {
                    formattedKey = formattedKey.take(30)
                }
            }

            // Process value and recurse for nested JSONObjects
            when (value) {
                is JSONObject -> processJSONObject(value, attributes, formattedKey)
                is String -> {
                    // Truncate strings longer than 200 characters
                    val truncatedValue = if (value.length > 200) {
                        Log.w(TAG, "Truncating attribute $formattedKey: string value exceeds 200 characters")
                        value.take(200)
                    } else {
                        value
                    }
                    attributes.put(formattedKey, truncatedValue)
                }
                is Int -> attributes.put(formattedKey, value)
                is Double -> attributes.put(formattedKey, value)
                is Long -> attributes.put(formattedKey, value)
                is Boolean -> attributes.put(formattedKey, value)
            }
        }
    }
}
