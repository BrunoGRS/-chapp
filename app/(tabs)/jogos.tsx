import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";

type Standing = {
  position: number;
  team: string;
  points: number;
  games: number;
  form: "up" | "down" | "stable";
};

const standings: Standing[] = [
  { position: 1, team: "Palmeiras", points: 7, games: 3, form: "up" },
  { position: 2, team: "Sao Paulo", points: 7, games: 3, form: "up" },
  { position: 3, team: "Fluminense", points: 7, games: 3, form: "up" },
  { position: 4, team: "Bahia", points: 7, games: 3, form: "up" },
  { position: 5, team: "Athletico-PR", points: 6, games: 3, form: "up" },
  { position: 6, team: "Bragantino", points: 6, games: 3, form: "down" },
  { position: 7, team: "Chapecoense", points: 5, games: 3, form: "up" },
  { position: 8, team: "Mirassol", points: 5, games: 3, form: "down" },
  { position: 9, team: "Coritiba", points: 4, games: 3, form: "stable" },
  { position: 10, team: "Flamengo", points: 4, games: 3, form: "down" },
];

export default function JogosScreen() {
  const renderFormIcon = (form: Standing["form"]) => {
    if (form === "up") {
      return <MaterialIcons name="arrow-drop-up" size={16} color="#5fae66" />;
    }
    if (form === "down") {
      return <MaterialIcons name="arrow-drop-down" size={16} color="#dc6d6d" />;
    }
    return <MaterialIcons name="remove" size={14} color="#9aa39a" />;
  };

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require("../../assets/images/chape_simbolo.jpg")}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerBar}>
            <Image source={require("../../assets/images/chape_simbolo.jpg")} style={styles.avatar} />
            <Text style={styles.profileName}>Bruno</Text>
          </View>

          <View style={styles.scoresRow}>
            <View style={styles.scoreCard}>
              <View style={styles.teamBlock}>
                <Image source={require("../../assets/images/chape_simbolo.jpg")} style={styles.teamLogo} />
                <Text style={styles.scoreNumber}>4</Text>
              </View>
              <Text style={styles.scoreDivider}>x</Text>
              <View style={styles.teamBlock}>
                <MaterialIcons name="sports-soccer" size={22} color="#121212" />
                <Text style={styles.scoreNumber}>2</Text>
              </View>
            </View>

            <View style={styles.scoreCard}>
              <View style={styles.teamBlock}>
                <Image source={require("../../assets/images/chape_simbolo.jpg")} style={styles.teamLogo} />
                <Text style={styles.scoreNumber}>3</Text>
              </View>
              <Text style={styles.scoreDivider}>x</Text>
              <View style={styles.teamBlock}>
                <Image source={require("../../assets/images/chape_simbolo.jpg")} style={styles.teamLogo} />
                <Text style={styles.scoreNumber}>3</Text>
              </View>
            </View>
          </View>

          <View style={styles.dotRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.tableTitle}>Serie A</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#f5f5f0" />
          </View>

          <View style={styles.tableCard}>
            <View style={styles.tableTopRow}>
              <Text style={[styles.tableTopText, styles.colTeam]}>Classificacao</Text>
              <Text style={[styles.tableTopText, styles.colPts]}>P</Text>
              <Text style={[styles.tableTopText, styles.colGames]}>J</Text>
            </View>

            {standings.map((item) => (
              <View
                key={`${item.position}-${item.team}`}
                style={[styles.row, item.team === "Chapecoense" && styles.rowHighlight]}
              >
                <Text style={styles.position}>{item.position}</Text>
                <Text style={styles.team}>{item.team}</Text>
                {renderFormIcon(item.form)}
                <Text style={styles.points}>{item.points}</Text>
                <Text style={styles.games}>{item.games}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#073b1a",
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(4, 42, 18, 0.86)",
  },
  content: {
    paddingBottom: 44,
  },
  headerBar: {
    marginTop: 46,
    marginHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#0c5a2a",
  },
  profileName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#14381f",
  },
  scoresRow: {
    marginTop: 78,
    paddingHorizontal: 24,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 6,
    minWidth: 98,
  },
  teamBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  teamLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d4ddd2",
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: "800",
    color: "#202420",
    lineHeight: 36,
  },
  scoreDivider: {
    fontSize: 18,
    fontWeight: "700",
    color: "#566056",
  },
  dotRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(215, 223, 213, 0.4)",
  },
  dotActive: {
    backgroundColor: "#a7b8a6",
  },
  tableHeader: {
    marginTop: 18,
    paddingHorizontal: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tableTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#f5f5f0",
  },
  tableCard: {
    marginTop: 10,
    marginHorizontal: 32,
    backgroundColor: "rgba(245, 245, 245, 0.96)",
    borderRadius: 16,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 9,
  },
  tableTopRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
    paddingBottom: 5,
    marginBottom: 4,
  },
  tableTopText: {
    fontSize: 8,
    color: "#909890",
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5.5,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  rowHighlight: {
    backgroundColor: "rgba(43, 159, 75, 0.18)",
    borderRadius: 6,
  },
  position: {
    width: 18,
    fontSize: 10,
    fontWeight: "700",
    color: "#7a7a7a",
    textAlign: "center",
  },
  team: {
    flex: 1,
    fontSize: 10,
    fontWeight: "600",
    color: "#253225",
  },
  points: {
    width: 22,
    fontSize: 10,
    color: "#374237",
    textAlign: "center",
  },
  games: {
    width: 22,
    fontSize: 10,
    color: "#374237",
    textAlign: "center",
  },
  colTeam: {
    flex: 1,
  },
  colPts: {
    width: 22,
    textAlign: "center",
  },
  colGames: {
    width: 22,
    textAlign: "center",
  },
});
