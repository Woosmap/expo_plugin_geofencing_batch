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
                    let idstore = POI.idstore ?? "-"
                    if(idstore.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        eventAttributes.put(idstore, forKey: "idStore")
                    }
                    
                    let city = POI.city ?? "-"
                    if(city.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        eventAttributes.put(city, forKey: "city")
                    }
                    
                    let zipCode = POI.zipCode ?? "-"
                    if(zipCode.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        eventAttributes.put(zipCode, forKey: "zipCode")
                    }
                    
                    eventAttributes.put(POI.distance, forKey: "distance")
                    
                    let countryCode = POI.countryCode ?? "-"
                    if(countryCode.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        eventAttributes.put(countryCode, forKey: "country_code")
                    }
                    
                    let address = POI.address ?? "-"
                    if(address.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        eventAttributes.put(address, forKey: "address")
                    }
                    
                    let tag : String = POI.tags ?? "-"
                    if(tag.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        eventAttributes.put(tag, forKey: "tags")
                    }
                    
                    let types : String = POI.types ?? "-"
                    if(types.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        eventAttributes.put(types, forKey: "types")
                    }
                    
                    POI.user_properties.forEach {
                        let keyValue = $0.value as? String ?? "-"
                        if(keyValue.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                            eventAttributes.put(keyValue, forKey: "user_properties.\($0.key)")
                        }
                    }
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
