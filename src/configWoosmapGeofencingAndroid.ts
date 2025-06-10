import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from "@expo/config-plugins";

import { ConfigProps } from "./types";
import { addMetaDataItemToMainApplication } from "@expo/config-plugins/build/android/Manifest";

const withSDKAndroidManifest: ConfigPlugin<ConfigProps> = (config, props) => {
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );

    const {
      useAndroidBackgroundLocation,
      useAndroidBluetooth,
    } = props;

    // Add location and BLE permissions to the <manifest> tag
    const permissions = [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_BACKGROUND_LOCATION",
      "android.permission.BLUETOOTH",
      "android.permission.BLUETOOTH_ADMIN",
      "android.permission.BLUETOOTH_SCAN",
    ];
    if(useAndroidBackgroundLocation == null){
      if(useAndroidBackgroundLocation == true){
        permissions.push("android.permission.ACCESS_BACKGROUND_LOCATION")
      }
    } else{
        permissions.push("android.permission.ACCESS_BACKGROUND_LOCATION")
    }
    

    if(useAndroidBluetooth == null){
      if(useAndroidBluetooth == true){
        permissions.push("android.permission.BLUETOOTH")
        permissions.push("android.permission.BLUETOOTH_ADMIN")
        permissions.push("android.permission.BLUETOOTH_SCAN")
      }
    } else{
        permissions.push("android.permission.BLUETOOTH")
        permissions.push("android.permission.BLUETOOTH_ADMIN")
        permissions.push("android.permission.BLUETOOTH_SCAN")
    }

    
    // Ensure each permission is added only once
    permissions.forEach((permission) => {
      if (
        !config.modResults.manifest["uses-permission"]?.find(
          (p: any) => p["$"]["android:name"] === permission,
        )
      ) {
        config.modResults.manifest["uses-permission"] = [
          ...(config.modResults.manifest["uses-permission"] || []),
          { $: { "android:name": permission } },
        ];
      }
    });

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
