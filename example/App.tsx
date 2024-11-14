import * as WoosmapExpoPluginGeofencingBatch from "@woosmap/expo-plugin-geofencing-batch";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>API key: {WoosmapExpoPluginGeofencingBatch.getApiKey()}</Text>
    </View>
  );
}
