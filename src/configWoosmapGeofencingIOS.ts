import {
  ConfigPlugin,
  withInfoPlist,
  withDangerousMod,
} from "@expo/config-plugins";

import { ConfigProps } from "./types";

const withSDKInfoPlist: ConfigPlugin<ConfigProps> = (config, props) => {
  return withInfoPlist(config, (config) => {
    delete config.modResults.woosmap;
    const {
      apiKey,
      locationAlwaysAndWhenInUsePermission,
      locationAlwaysPermission,
      locationWhenInUsePermission,
    } = props;

    if (apiKey) {
      config.modResults.woosmap = { apiKey };
    }

    //Permission
    if (!Array.isArray(config.modResults.UIBackgroundModes)) {
      config.modResults.UIBackgroundModes = [];
    }
    if (!config.modResults.UIBackgroundModes.includes("location")) {
      config.modResults.UIBackgroundModes.push("location");
    }
    if (
      !config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription &&
      locationAlwaysAndWhenInUsePermission
    ) {
      config.modResults.NSLocationAlwaysAndWhenInUseUsageDescription =
        locationAlwaysAndWhenInUsePermission;
    }

    if (
      !config.modResults.NSLocationAlwaysUsageDescription &&
      locationAlwaysPermission
    ) {
      config.modResults.NSLocationAlwaysUsageDescription =
        locationAlwaysPermission;
    }

    if (
      !config.modResults.NSLocationWhenInUseUsageDescription &&
      locationWhenInUsePermission
    ) {
      config.modResults.NSLocationWhenInUseUsageDescription =
        locationWhenInUsePermission;
    }
    return config;
  });
};

const {
  mergeContents,
} = require("@expo/config-plugins/build/utils/generateCode");
const fs = require("fs");
const path = require("path");

async function readFileAsync(path: string) {
  return fs.promises.readFile(path, "utf8");
}

async function saveFileAsync(path: string, content: string) {
  return fs.promises.writeFile(path, content, "utf8");
}

function disableAdIDSupport(src: any) {
  return mergeContents({
    tag: `M1 Mac patch`,
    src,
    newSrc: `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings["ONLY_ACTIVE_ARCH"] = "NO"
      end
    end`,
    anchor: /post_install/,
    offset: 1,
    comment: "# run application on ARM-based system-on-a-chip simulator",
  }).contents;
}

const withSDKDangerousMod: ConfigPlugin<ConfigProps> = (config, props) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const file: string = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile",
      );
      const contents = await readFileAsync(file);
      await saveFileAsync(file, disableAdIDSupport(contents));
      return config;
    },
  ]);
};
export const withIOSSdk: ConfigPlugin<ConfigProps> = (config, props) => {
  config = withSDKInfoPlist(config, props);
  //   config = withSDKEntitlements(config, props);
  //   config = withSDKXcodeProject(config, props);
  config = withSDKDangerousMod(config, props);
  return config;
};
