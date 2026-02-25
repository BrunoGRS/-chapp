import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vamo, Vamo, Chape!</Text>
      <Text style={styles.subtitle}>Bem-vindo ao app oficial do torcedor.</Text>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00421a",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#eee",
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 50,
    padding: 15,
  },
  logoutText: {
    color: "#ff4444",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
