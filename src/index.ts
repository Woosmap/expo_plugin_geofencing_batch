import { ConfigPlugin, createRunOncePlugin } from "@expo/config-plugins";

import { withAndroidSdk } from "./configWoosmapGeofencingAndroid";
import { withIOSSdk } from "./configWoosmapGeofencingIOS";
import { ConfigProps } from "./types";

const withWoosmapGeofencingPlugin: ConfigPlugin<ConfigProps> = (
  config,
  _props,
) => {
  const props = _props || { apiKey: "", batchApiKey: "674050B5A172F19EC11EFDDE6A9A21" };
  //console.log("my custom plugin");
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
