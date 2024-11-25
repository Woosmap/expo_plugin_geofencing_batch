package expo.modules.geofencingbatchplugin;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.batch.android.Batch;
import com.batch.android.BatchEventAttributes;
import com.webgeoservices.woosmapgeofencingcore.database.POI;
import com.webgeoservices.woosmapgeofencingcore.database.WoosmapDb;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class GeofencingEventsReceiver extends BroadcastReceiver {
    private static final String TAG = "GeofencingReceiver";
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "Received broadcast");
        executorService.execute(() -> {
            try {
                Log.d(TAG, "executorService.execute");
                JSONObject regionData = new JSONObject(intent.getStringExtra("regionLog"));
                BatchEventAttributes attributes = new BatchEventAttributes();
                attributes.put("identifier", regionData.getString("identifier"));
                attributes.put("event_name", regionData.getString("eventname"));
                attributes.put("longitude", regionData.getDouble("longitude"));
                attributes.put("latitude", regionData.getDouble("latitude"));
                attributes.put("date", regionData.getLong("date"));
                attributes.put("did_enter", regionData.getBoolean("didenter"));
                attributes.put("radius", regionData.getDouble("radius"));
                attributes.put("spent_time", regionData.getInt("spenttime"));
                attributes.put("from_position_detection", regionData.getBoolean("frompositiondetection"));

                // Fetch the POI from the db based on the identifier
                POI poi = WoosmapDb.getInstance(context).getPOIsDAO().getPOIbyStoreId(regionData.getString("identifier"));
                if (poi != null) { //poi could be null if the entered/exited region is a custom region.

                    // Check each field for null before adding to attributes
                    if (poi.idStore != null) attributes.put("id_store", poi.idStore);
                    if (poi.name != null) attributes.put("name", poi.name);
                    if (poi.address != null) attributes.put("address", poi.address);
                    if (poi.city != null) attributes.put("city", poi.city);
                    if (poi.contact != null) attributes.put("contact", poi.contact);
                    if (poi.countryCode != null) attributes.put("country_code", poi.countryCode);
                    attributes.put("distance", poi.distance);
                    if (poi.types != null) attributes.put("types", poi.types);
                    if (poi.tags != null) attributes.put("tags", poi.tags);
                    if (poi.zipCode != null) attributes.put("zip_code", poi.zipCode);

                    if (poi.userProperties != null){
                        JSONObject userProperties = new JSONObject(poi.userProperties);
                        processJSONObject(userProperties, attributes, "");
                    }

                    // Track the event with Batch
                    try {
                        Batch.Profile.trackEvent(regionData.getString("eventname"), attributes);
                    } catch (Exception e) {
                        Log.e(TAG, "Error tracking event in Batch", e);
                    }
                }
            } catch (Exception exception) {
                Log.e(TAG, "Error processing geofencing event", exception);
            }
        });
    }

    // Helper function to process JSONObject recursively
    private void processJSONObject(JSONObject jsonObject, BatchEventAttributes attributes, String parentKey) throws JSONException {
        Iterator<String> keys = jsonObject.keys();
        while (keys.hasNext()) {
            if (attributes.getAttributes().size() == 20) {
                break;
            }
            String key = keys.next();
            Object value = jsonObject.get(key);
            String fullKey = parentKey.isEmpty() ? key : parentKey + "_" + key;
            String formattedKey = fullKey.replaceAll("([A-Z])", "_$1").toLowerCase(); // Convert to snake_case

            if (value instanceof JSONObject) {
                // Recursively process nested JSONObject
                processJSONObject((JSONObject) value, attributes, formattedKey);
            } else if (value instanceof String) {
                attributes.put(formattedKey, (String) value);
            } else if (value instanceof Integer) {
                attributes.put(formattedKey, (Integer) value);
            } else if (value instanceof Double) {
                attributes.put(formattedKey, (Double) value);
            } else if (value instanceof Long) {
                attributes.put(formattedKey, (Long) value);
            } else if (value instanceof Boolean) {
                attributes.put(formattedKey, (Boolean) value);
            }
        }
    }
}
