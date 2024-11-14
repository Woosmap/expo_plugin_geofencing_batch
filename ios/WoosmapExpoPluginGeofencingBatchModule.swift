import ExpoModulesCore

public class WoosmapExpoPluginGeofencingBatchModule: Module {
  public func definition() -> ModuleDefinition {
    Name("WoosmapExpoPluginGeofencingBatch")

    Function("getApiKey") { () -> String in
      "api-key"
    }
  }
}
