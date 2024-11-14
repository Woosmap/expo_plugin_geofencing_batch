// Reexport the native module. On web, it will be resolved to WoosmapExpoPluginGeofencingBatchModule.web.ts
// and on native platforms to WoosmapExpoPluginGeofencingBatchModule.ts
import WoosmapExpoPluginGeofencingBatchModule from "./WoosmapExpoPluginGeofencingBatchModule";
export function getApiKey(): string {
  return WoosmapExpoPluginGeofencingBatchModule.getApiKey();
}
