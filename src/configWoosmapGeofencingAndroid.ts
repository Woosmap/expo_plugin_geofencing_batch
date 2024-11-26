import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from "@expo/config-plugins";

import { ConfigProps } from "./types";

const withSDKAndroidManifest: ConfigPlugin<ConfigProps> = (config, props) => {
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );
    return config;
  });

  return config;
};

export const withAndroidSdk: ConfigPlugin<ConfigProps> = (config, props) => {
  config = withSDKAndroidManifest(config, props);
  //   config = withSDKEntitlements(config, props);
  //   config = withSDKXcodeProject(config, props);
  //   config = withSDKDangerousMod(config, props);
  return config;
};
