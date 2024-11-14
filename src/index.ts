import WoosmapExpoPluginGeofencingBatchModule from "./WoosmapExpoPluginGeofencingBatchModule";

// Reexport the native module. On web, it will be resolved to WoosmapExpoPluginGeofencingBatchModule.web.ts
// and on native platforms to WoosmapExpoPluginGeofencingBatchModule.ts

export function getApiKey(): string {
  return WoosmapExpoPluginGeofencingBatchModule.getApiKey();
}
