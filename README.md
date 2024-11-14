# @woosmap/expo-plugin_geofencing-batch

Woosmap geofencing batch integration

@woosmap/expo-geofencing-batch-plugin is a [config plugin](https://docs.expo.dev/config-plugins/introduction/) to customize native build properties when using [npx expo prebuild](https://docs.expo.dev/workflow/prebuild/).

# API documentation

- [Documentation for the main branch](https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/geofencing-batch-plugin.md)
- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/geofencing-batch-plugin/)

### Add the package to your npm dependencies

```
npm install @woosmap/expo-plugin_geofencing-batch
```

Add plugin to `app.json`. For example:

``` javascript
"plugins": [
      ...,
      [
        "@woosmap/expo-plugin_geofencing-batch",
        {
          "apiKey": "woosmap private key",
          "locationAlwaysAndWhenInUsePermission": "app Location permission",
          "locationAlwaysPermission": "app Location always",
          "locationWhenInUsePermission": "app Location when in use",
        }
      ]
    ]
```

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide]( https://github.com/expo/expo#contributing).
