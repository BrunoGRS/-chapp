import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ChapeTheme } from "@/constants/theme";

type StateCardProps = {
  actionLabel?: string;
  description: string;
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  loading?: boolean;
  onAction?: () => void;
  title: string;
};

export function StateCard({ actionLabel, description, icon = "info-outline", loading, onAction, title }: StateCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        {loading ? (
          <ActivityIndicator size="small" color={ChapeTheme.colors.accentSoft} />
        ) : (
          <MaterialIcons name={icon} size={22} color={ChapeTheme.colors.accent} />
        )}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    borderRadius: ChapeTheme.radii.md,
    backgroundColor: ChapeTheme.colors.surfaceMuted,
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(247, 245, 235, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: ChapeTheme.colors.text,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    color: ChapeTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  button: {
    marginTop: 2,
    backgroundColor: ChapeTheme.colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: ChapeTheme.radii.pill,
  },
  buttonText: {
    color: "#102015",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
});
