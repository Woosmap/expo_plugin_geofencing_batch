import ExpoModulesCore
public class WoosmapGeofencingAppDelegate: ExpoAppDelegateSubscriber {
    let objWoosmapReceiver: GeofencingEventsReceiver = GeofencingEventsReceiver()
    public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        objWoosmapReceiver.startReceivingEvent()
        return true
    }
    
}
