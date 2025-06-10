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

    var {
      useAndroidBackgroundLocation,
      useAndroidBluetooth,
    } = props;
   useAndroidBackgroundLocation =  useAndroidBackgroundLocation == undefined? true: useAndroidBackgroundLocation; //Default true
   useAndroidBluetooth =  useAndroidBluetooth == undefined? true: useAndroidBluetooth; //Default true
    
    // Add location and BLE permissions to the <manifest> tag
    const permissions = [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION",
    ];
   
    if(useAndroidBackgroundLocation == true){
      permissions.push("android.permission.ACCESS_BACKGROUND_LOCATION")
    }
    
    if(useAndroidBluetooth == true){
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
  return config;
};
