import React from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const timeline = [
  {
    year: "1973",
    title: "Fundação",
    description:
      "A Chapecoense nasce da união de clubes da cidade e inicia sua história no futebol catarinense.",
  },
  {
    year: "2009",
    title: "Acesso à Série A",
    description:
      "Após uma trajetória de crescimento, o clube chega à elite do futebol brasileiro.",
  },
  {
    year: "2016",
    title: "Final da Sul-Americana",
    description:
      "Campanha histórica que marcou o Brasil e o mundo do futebol.",
  },
  {
    year: "2017",
    title: "Reconstrução e Título",
    description:
      "Recomeço com força, homenagens e conquistas que simbolizam a superação.",
  },
];

const trophies = [
  { label: "Campeonato Catarinense", value: "8x" },
  { label: "Copa Sul-Americana", value: "1x" },
  { label: "Brasileiro 2013", value: "1x" },
  { label: "Brasileiro Série B", value: "1x" },
];

export default function HistoriaScreen() {
  return (
    <View style={styles.root}>
      <ImageBackground
        source={require("../../assets/images/chape_simbolo.jpg")}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.profile}> 
              <Image
                source={require("../../assets/images/chape_simbolo.jpg")}
                style={styles.avatar}
              />
              <Text style={styles.profileName}>Bruno</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <Image
              source={require("../../assets/images/chape_simbolo.jpg")}
              style={styles.crest}
            />
            <Text style={styles.clubName}>Associação Chapecoense de Futebol</Text>
            <Text style={styles.clubSubtitle}>Fundada em 10 de maio de 1973</Text>
            <Text style={styles.clubCity}>Chapecó - SC</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Linha do tempo</Text>
            <View style={styles.timelineList}>
              {timeline.map((item) => (
                <View key={item.year} style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <Text style={styles.timelineYear}>{item.year}</Text>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineDesc}>{item.description}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conquistas</Text>
            <View style={styles.trophies}>
              {trophies.map((trophy) => (
                <View key={trophy.label} style={styles.trophyCard}>
                  <Text style={styles.trophyValue}>{trophy.value}</Text>
                  <Text style={styles.trophyLabel}>{trophy.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.footerQuote}>
            \"Que a nossa história jamais seja esquecida.\"
          </Text>
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
    opacity: 0.18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(4, 42, 18, 0.86)",
  },
  content: {
    paddingBottom: 48,
  },
  header: {
    paddingTop: 46,
    paddingHorizontal: 20,
  },
  profile: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
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
  hero: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  crest: {
    width: 92,
    height: 92,
    marginBottom: 14,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f5f5f0",
    textAlign: "center",
  },
  clubSubtitle: {
    fontSize: 13,
    color: "#dbe7d8",
    marginTop: 6,
  },
  clubCity: {
    fontSize: 12,
    color: "#b9d1be",
    marginTop: 2,
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f5f5f0",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  timelineList: {
    borderLeftWidth: 2,
    borderLeftColor: "rgba(245, 245, 240, 0.3)",
    paddingLeft: 18,
  },
  timelineItem: {
    marginBottom: 18,
    paddingLeft: 6,
  },
  timelineDot: {
    position: "absolute",
    left: -26,
    top: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#f2c94c",
    borderWidth: 2,
    borderColor: "#0b3d1c",
  },
  timelineYear: {
    fontSize: 12,
    fontWeight: "700",
    color: "#f2c94c",
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f5f5f0",
    marginTop: 2,
  },
  timelineDesc: {
    fontSize: 12,
    color: "#cfe0d0",
    marginTop: 6,
    lineHeight: 18,
  },
  trophies: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  trophyCard: {
    width: "48%",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(8, 60, 30, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(242, 201, 76, 0.4)",
  },
  trophyValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#f2c94c",
  },
  trophyLabel: {
    fontSize: 12,
    color: "#dbe7d8",
    marginTop: 6,
  },
  footerQuote: {
    marginTop: 24,
    paddingHorizontal: 24,
    fontSize: 12,
    color: "#dbe7d8",
    textAlign: "center",
  },
});
