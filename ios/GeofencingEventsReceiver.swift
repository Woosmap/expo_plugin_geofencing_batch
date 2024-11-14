import Foundation
import WoosmapGeofencing
import Batch

extension Notification.Name {
    static let updateRegions = Notification.Name("updateRegions")
    static let didEventPOIRegion = Notification.Name("didEventPOIRegion")
}

@objc(GeofencingEventsReceiver)
class GeofencingEventsReceiver: NSObject {
    @objc public func startReceivingEvent() {
        NotificationCenter.default.addObserver(self, selector: #selector(POIRegionReceivedNotification),
                                               name: .didEventPOIRegion,
                                               object: nil)
    }
    @objc func POIRegionReceivedNotification(notification: Notification) {
        if let POIregion = notification.userInfo?["Region"] as? Region{
            var batchEventName: String = "woos_geofence_exited_event"
            if POIregion.didEnter {
                batchEventName = "woos_geofence_entered_event"
            }
            // if you want only push to batch geofence event related to POI,
            // check first if the POIregion.origin is equal to "POI"
            if POIregion.origin == "POI"
            {
                let eventAttributes:BatchEventAttributes = BatchEventAttributes()
                
                eventAttributes.put(POIregion.date, forKey: "date")
                eventAttributes.put(POIregion.identifier, forKey: "id")
                eventAttributes.put(POIregion.latitude, forKey: "latitude")
                eventAttributes.put(POIregion.longitude, forKey: "longitude")
                eventAttributes.put(POIregion.radius, forKey: "radius")
                
                
                if let POI = POIs.getPOIbyIdStore(idstore: POIregion.identifier) as POI? {
                    eventAttributes.put(POI.name ?? "-", forKey: "name")
                    eventAttributes.put(POI.idstore ?? "-", forKey: "idStore")
                    eventAttributes.put(POI.city ?? "-", forKey: "city")
                    eventAttributes.put(POI.zipCode ?? "-", forKey: "zipCode")
                    eventAttributes.put(POI.distance, forKey: "distance")
                    eventAttributes.put(POI.countryCode ?? "-", forKey: "country_code")
                    eventAttributes.put(POI.address ?? "-", forKey: "address")
                    eventAttributes.put(POI.tags ?? "-", forKey: "tags")
                    eventAttributes.put(POI.types ?? "-", forKey: "types")
                    POI.user_properties.forEach { eventAttributes.put($0.value as? String ?? "-", forKey: $0.key) }
                }
            
                BatchProfile.trackEvent(name: batchEventName,attributes:eventAttributes)
            }
            
        }
    }
    // Stop receiving notification
    @objc public func stopReceivingEvent() {
        NotificationCenter.default.removeObserver(self, name: .didEventPOIRegion, object: nil)
    }
    
}
