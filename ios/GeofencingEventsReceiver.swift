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
                var collectedEvent: [String: Any] = [:]
                
                collectedEvent["date"] = POIregion.date
                collectedEvent["id"] = POIregion.identifier
                collectedEvent["latitude"] = POIregion.latitude
                collectedEvent["longitude"] = POIregion.longitude
                collectedEvent["radius"] = POIregion.radius
                
                
                if let POI = POIs.getPOIbyIdStore(idstore: POIregion.identifier) as POI? {                    
                    collectedEvent["name"] = POI.name ?? "-"
                    
                    let idstore = POI.idstore ?? "-"
                    if(idstore.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        collectedEvent["id_store"] = idstore
                    }
                    
                    let city = POI.city ?? "-"
                    if(city.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        collectedEvent["city"] = city
                    }
                    
                    let zipCode = POI.zipCode ?? "-"
                    if(zipCode.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        collectedEvent["zip_code"] = zipCode
                    }
                    
                    collectedEvent["distance"] = POI.distance
                    
                    let countryCode = POI.countryCode ?? "-"
                    if(countryCode.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        collectedEvent["country_code"] = countryCode
                    }
                    
                    let address = POI.address ?? "-"
                    if(address.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        collectedEvent["address"] = address
                    }
                    
                    let tag : String = POI.tags ?? "-"
                    if(tag.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        collectedEvent["tags"] = tag
                    }
                    
                    let types : String = POI.types ?? "-"
                    if(types.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                        collectedEvent["types"] = types
                    }
                    
                    POI.user_properties.forEach {
                        if collectedEvent.keys.count <= 25 {
                            let keyValue = $0.value as? String ?? "-"
                            if(keyValue.trimmingCharacters(in: .whitespacesAndNewlines) != ""){
                                var attributeKey: String = $0.key.camelCaseToKey().lowercased()
                                attributeKey = String(attributeKey.prefix(30))
                                collectedEvent[attributeKey] = keyValue
                            }
                        }
                    }
                }
                // Adding New Event
                let eventAttributes:BatchEventAttributes = BatchEventAttributes()
                for (eventKey, eventValue) in collectedEvent {
                    if let val = eventValue as? Double {
                        eventAttributes.put(val, forKey: eventKey)
                    }
                    else if let val = eventValue as? Date {
                        eventAttributes.put(val, forKey: eventKey)
                    }
                    else if let val = eventValue as? Bool {
                        eventAttributes.put(val, forKey: eventKey)
                    }
                    else if let val = eventValue as? String {
                        eventAttributes.put(String(val.prefix(200)), forKey: eventKey)
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

private extension String {
    func camelCaseToKey() -> String {
        return unicodeScalars.dropFirst().reduce(String(prefix(1))) {
            return CharacterSet.uppercaseLetters.contains($1)
            ? $0 + "_" + String($1).lowercased()
                : $0 + String($1)
        }
    }
}
