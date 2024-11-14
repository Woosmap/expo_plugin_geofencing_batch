import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";

import WoosmapExpoPluginGeofencingBatchModule from "./WoosmapExpoPluginGeofencingBatchModule";
import { withAndroidSdk } from "./configWoosmapGeofencingAndroid";
import { withIOSSdk } from "./configWoosmapGeofencingIOS";
import { ConfigProps } from "./types";

const withWoosmapGeofencingPlugin: ConfigPlugin<ConfigProps> = (
  config,
  _props,
) => {
  const props = _props || { apiKey: "" };

  config = withAndroidSdk(config, props);
  config = withIOSSdk(config, props);

  return config;
};
const pkg = require("../package.json");
export default createRunOncePlugin(
  withWoosmapGeofencingPlugin,
  pkg.name,
  pkg.version,
);

// Reexport the native module. On web, it will be resolved to WoosmapExpoPluginGeofencingBatchModule.web.ts
// and on native platforms to WoosmapExpoPluginGeofencingBatchModule.ts

export function getApiKey(): string {
  return WoosmapExpoPluginGeofencingBatchModule.getApiKey();
}
