import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/contexts/auth-context";
import { getHistoriaOverview } from "@/services/historia.service";
import type { HistoriaOverview } from "@/types/historia";

export default function HistoriaScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<HistoriaOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadHistoria();
  }, []);

  async function loadHistoria(showRefreshing = false) {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage(null);
      const response = await getHistoriaOverview();
      setData(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao carregar historia";
      setErrorMessage(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  return (
    <View style={styles.root}>
      <ImageBackground
        source={require("../../assets/images/chape_simbolo.jpg")}
        resizeMode="cover"
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay} />
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => void loadHistoria(true)} tintColor="#f5f5f0" />
          }
        >
          <View style={styles.header}>
            <View style={styles.profile}>
              <Image
                source={require("../../assets/images/chape_simbolo.jpg")}
                style={styles.avatar}
              />
              <Text style={styles.profileName}>{user?.name ?? "Torcedor"}</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <Image
              source={require("../../assets/images/chape_simbolo.jpg")}
              style={styles.crest}
            />
            <Text style={styles.clubName}>{data?.clubName ?? "Associacao Chapecoense de Futebol"}</Text>
            <Text style={styles.clubSubtitle}>Fundada em {data?.foundedAt ?? "-"}</Text>
            <Text style={styles.clubCity}>{data?.city ?? "-"}</Text>
            {data?.updatedAt ? (
              <Text style={styles.updatedAt}>
                Atualizado em {new Date(data.updatedAt).toLocaleString("pt-BR")}
              </Text>
            ) : null}
          </View>

          {loading ? (
            <View style={styles.feedbackCard}>
              <ActivityIndicator size="large" color="#f5f5f0" />
              <Text style={styles.feedbackText}>Carregando historia...</Text>
            </View>
          ) : null}

          {!loading && errorMessage ? (
            <View style={styles.feedbackCard}>
              <MaterialIcons name="wifi-off" size={30} color="#f5f5f0" />
              <Text style={styles.feedbackText}>{errorMessage}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => void loadHistoria()}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!loading && !errorMessage ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Linha do tempo</Text>
                <View style={styles.timelineList}>
                  {data?.timeline.map((item) => (
                    <View key={`${item.year}-${item.title}`} style={styles.timelineItem}>
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
                  {data?.achievements.map((achievement) => (
                    <View key={achievement.label} style={styles.trophyCard}>
                      <Text style={styles.trophyValue}>{achievement.value}</Text>
                      <Text style={styles.trophyLabel}>{achievement.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <Text style={styles.footerQuote}>
                &quot;{data?.footerQuote ?? "Que a nossa historia jamais seja esquecida."}&quot;
              </Text>
            </>
          ) : null}
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
  updatedAt: {
    marginTop: 8,
    color: "#cfe0d0",
    fontSize: 11,
  },
  feedbackCard: {
    marginTop: 22,
    marginHorizontal: 24,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    gap: 12,
  },
  feedbackText: {
    color: "#f5f5f0",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: "#f5f5f0",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryText: {
    color: "#14381f",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
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
