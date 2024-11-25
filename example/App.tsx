import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import WoosmapGeofencing, { Region } from '@woosmap/react-native-plugin-geofencing';

export default function App() {
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [watchID, setwatchID] = React.useState('');

  const checkPermissions = async () => {
    try {
      const status = await WoosmapGeofencing.getPermissionsStatus();
      setPermissionStatus(status);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setPermissionStatus(null);
    }
  };

  const requestForegroundPermission = async () => {
    try {
      await WoosmapGeofencing.requestPermissions(false);
      Alert.alert("Success", "Foreground location permission granted.");
    } catch (err: any) {
      Alert.alert("Error", `Failed to request foreground permission: ${err.message}`);
    }
  };

  const requestBackgroundPermission = async () => {
    try {
      await WoosmapGeofencing.requestPermissions(true);
      Alert.alert("Success", "Background location permission granted.");
    } catch (err: any) {
      Alert.alert("Error", `Failed to request background permission: ${err.message}`);
    }
  };

  const initializePlugin = async () => {
    try {
      await WoosmapGeofencing.initialize();
      Alert.alert("Success", "Plugin initialized.");
    } catch (err: any) {
      Alert.alert("Error", `Failed to initialize plugin: ${err.message}`);
    }
  };

  const setWoosmapKey = async () => {
    const privateKeyWoosmapAPI = ""; // Replace with your actual key
    try {
      const value = await WoosmapGeofencing.setWoosmapApiKey(privateKeyWoosmapAPI);
      Alert.alert("Success", `Woosmap API Key Set: ${value}`);
    } catch (err: any) {
      Alert.alert("Error", `Failed to set Woosmap API Key: ${err.message}`);
    }
  };

  const startTracking = async () => {
    try {
      const result = await WoosmapGeofencing.startTracking("passiveTracking");
      Alert.alert("Success", `Tracking started: ${result}`);
      watchRegions();
    } catch (err: any) {
      Alert.alert("Error", `Failed to start tracking: ${err.message}`);
    }
  };

  const watchRegions = async () => {
    WoosmapGeofencing.watchRegions(callback)
      .then((watchRef: string) => {
        setwatchID(watchRef);
        Alert.alert("Success", "Region watch added");
      })
      .catch((error: any) => {
        Alert.alert("Error", `Failed to watch regions: ${error.message}`);
      });
  };

  const clearRegionsWatch = async () => {
    WoosmapGeofencing.clearRegionsWatch(watchID)
      .then((watchRef: string) => {
        console.log(watchRef);
        setwatchID("");
        Alert.alert("Success", watchRef.toString());
      })
      .catch((error: any) => {
        Alert.alert("Error", `Failed to stop region watch: ${error.message}`);
      });
  };

  const stopTracking = async () => {
    try {
      const value = await WoosmapGeofencing.stopTracking();
      Alert.alert("Success", `Tracking stopped: ${value}`);
      clearRegionsWatch();
    } catch (err: any) {
      Alert.alert("Error", `Failed to stop tracking: ${err.message}`);
    }
  };

  const callback = (value: Region) => {
    Alert.alert(JSON.stringify(value));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geofence SDK</Text>
      <Text style={styles.subtitle}>
        Permission Status: {permissionStatus || "Unknown"}
      </Text>
      {error && <Text style={styles.error}>Error: {error}</Text>}

      <View style={styles.button}>
        <Button title="Check Permissions" onPress={checkPermissions} />
      </View>
      <View style={styles.button}>
        <Button title="Request Foreground Permission" onPress={requestForegroundPermission} />
      </View>
      <View style={styles.button}>
        <Button title="Request Background Permission" onPress={requestBackgroundPermission} />
      </View>
      <View style={styles.button}>
        <Button title="Initialize Plugin" onPress={initializePlugin} />
      </View>
      <View style={styles.button}>
        <Button title="Set Woosmap API Key" onPress={setWoosmapKey} />
      </View>
      <View style={styles.button}>
        <Button title="Start Tracking" onPress={startTracking} />
      </View>
      <View style={styles.button}>
        <Button title="Stop Tracking" onPress={stopTracking} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "green",
    marginBottom: 10,
  },
  error: {
    fontSize: 18,
    color: "red",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    marginVertical: 10,
  },
});
