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
                if let POI = POIs.getPOIbyIdStore(idstore: POIregion.identifier) as POI? {
                    // Event with custom attributes
                    BatchProfile.trackEvent(name: batchEventName, attributes: BatchEventAttributes { data in
                        data.put(POI.idstore ?? "", forKey: "identifier")
                        data.put(POI.name ?? "", forKey: "name")
//                        more info
//                        if let more_info = POI.jsonData{
//                            let prettyPrintedString = String(data: more_info, encoding: .utf8)!
//                            data.put(prettyPrintedString, forKey: "more_info")
//                        }
                    })
                }
                else {
                    // error: Related POI doesn't exist
                }
            }
            
        }
    }
    // Stop receiving notification
    @objc public func stopReceivingEvent() {
        NotificationCenter.default.removeObserver(self, name: .didEventPOIRegion, object: nil)
    }
    
}
