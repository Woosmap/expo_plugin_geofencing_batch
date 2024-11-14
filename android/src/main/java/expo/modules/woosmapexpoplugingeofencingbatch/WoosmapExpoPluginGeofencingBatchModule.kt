package expo.modules.nativeconfiguration

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WoosmapExpoPluginGeofencingBatchModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WoosmapExpoPluginGeofencingBatch")

    Function("getApiKey") {
      return@Function "api-key"
    }
  }
}
