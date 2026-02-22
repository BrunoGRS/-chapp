import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Logo e Título */}
      <View style={styles.header}>
        {
          <Image
            source={require("../../assets/images/chape_simbolo.jpg")}
            style={styles.logo}
          />
        }
        <Text style={styles.title}>CHApp</Text>
      </View>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Usuário/Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity>
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>

      {/* Botões Principais */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.buttonText}>Criar uma Conta</Text>
        </TouchableOpacity>
      </View>

      {/* Divisor e Login Social */}
      <View style={styles.divider} />
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require("../../assets/images/logoGoole.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Entre com uma conta Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B552A",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  forgotText: {
    color: "#ccc",
    textAlign: "right",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "48%",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: "#fff",
    width: "100%",
    height: 50,
    borderRadius: 8,
    flexDirection: "row", // Coloca ícone e texto na mesma linha
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  googleButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10, // Espaço entre o G e o texto
    resizeMode: "contain",
  },
  logo: {
    width: 120, // Largura da imagem
    height: 120, // Altura da imagem
    marginBottom: 10,
    resizeMode: "contain", // Garante que a imagem não seja cortada
  },
});
