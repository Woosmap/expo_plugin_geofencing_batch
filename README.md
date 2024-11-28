# @woosmap/expo-plugin-geofencing-batch

Woosmap geofencing batch integration

@woosmap/expo-plugin-geofencing-batch is a [config plugin](https://docs.expo.dev/config-plugins/introduction/) to customize native build properties when using [npx expo prebuild](https://docs.expo.dev/workflow/prebuild/).


### Add the package to your npm dependencies

```
npm install @woosmap/expo-plugin-geofencing-batch
```

Add plugin to `app.json`. For example:

``` javascript
"plugins": [
      ...,
      [
        "@woosmap/expo-plugin-geofencing-batch",
        {
          "locationAlwaysAndWhenInUsePermission": "app Location permission",
          "locationAlwaysPermission": "app Location always",
          "locationWhenInUsePermission": "app Location when in use",
        }
      ]
    ]
```
### Woosmap Geofencing SDK - React-Native
[SDK Ref](https://developers.woosmap.com/products/geofencing-sdk/react-native-plugin/guides/setup/)
