import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ListRenderItemInfo,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/contexts/auth-context";
import { getTitulosOverview } from "@/services/titulos.service";
import type { TitulosOverview, Trophy } from "@/types/titulos";

const { width } = Dimensions.get("window");
const cardWidth = width - 92;

export default function TitulosScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<TitulosOverview | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const listRef = useRef<FlatList<Trophy>>(null);

  useEffect(() => {
    void loadTitulos();
  }, []);

  async function loadTitulos(showRefreshing = false) {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage(null);
      const response = await getTitulosOverview();
      setData(response);
      setCurrentIndex(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao carregar titulos";
      setErrorMessage(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const trophies = data?.trophies ?? [];

  function goTo(nextIndex: number) {
    const boundedIndex = Math.max(0, Math.min(nextIndex, trophies.length - 1));
    listRef.current?.scrollToIndex({ index: boundedIndex, animated: true });
    setCurrentIndex(boundedIndex);
  }

  function onMomentumEnd(event: { nativeEvent: { contentOffset: { x: number } } }) {
    const next = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    setCurrentIndex(next);
  }

  function renderTrophy({ item, index }: ListRenderItemInfo<Trophy>) {
    return (
      <View style={styles.cardWrapper}>
        <View style={styles.trophyCard}>
          <ImageBackground
            source={require("../../assets/images/chape_simbolo.jpg")}
            style={styles.trophyCardBackground}
            imageStyle={styles.trophyCardImage}
          >
            <View style={styles.trophyCardOverlay} />
            <View style={styles.trophyIconContainer}>
              <MaterialIcons name="emoji-events" size={98} color="#d9e1d9" />
            </View>
          </ImageBackground>
        </View>
        <View style={styles.titleRow}>
          <TouchableOpacity
            style={[
              styles.textArrowButton,
              (currentIndex === 0 || index !== currentIndex) && styles.arrowButtonDisabled,
            ]}
            disabled={currentIndex === 0 || index !== currentIndex}
            onPress={() => goTo(currentIndex - 1)}
          >
            <MaterialIcons name="chevron-left" size={20} color="#f0f4eb" />
          </TouchableOpacity>

          <Text style={styles.trophyName}>{item.title}</Text>

          <TouchableOpacity
            style={[
              styles.textArrowButton,
              (currentIndex === trophies.length - 1 || index !== currentIndex) && styles.arrowButtonDisabled,
            ]}
            disabled={currentIndex === trophies.length - 1 || index !== currentIndex}
            onPress={() => goTo(currentIndex + 1)}
          >
            <MaterialIcons name="chevron-right" size={20} color="#f0f4eb" />
          </TouchableOpacity>
        </View>
        <Text style={styles.trophyYear}>{item.year}</Text>
        <Text style={styles.trophyQuote}>{item.quote}</Text>
        <Text style={styles.trophyDescription}>{item.description}</Text>
      </View>
    );
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
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => void loadTitulos(true)} tintColor="#f5f5f0" />
          }
        >
          <View style={styles.headerBar}>
            <Image source={require("../../assets/images/chape_simbolo.jpg")} style={styles.avatar} />
            <Text style={styles.profileName}>{user?.name ?? "Torcedor"}</Text>
          </View>

          <View style={styles.clubBlock}>
            <Image source={require("../../assets/images/chape_simbolo.jpg")} style={styles.crest} />
            <Text style={styles.clubName}>{data?.clubName ?? "Associacao Chapecoense de Futebol"}</Text>
            <Text style={styles.clubSubtitle}>{data?.clubSubtitle ?? "O Furacao do Oeste"}</Text>
            {data?.updatedAt ? (
              <Text style={styles.updatedAt}>
                Atualizado em {new Date(data.updatedAt).toLocaleString("pt-BR")}
              </Text>
            ) : null}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Titulos</Text>
            <View style={styles.sectionLine} />
          </View>

          {loading ? (
            <View style={styles.feedbackCard}>
              <ActivityIndicator size="large" color="#f5f5f0" />
              <Text style={styles.feedbackText}>Carregando titulos...</Text>
            </View>
          ) : null}

          {!loading && errorMessage ? (
            <View style={styles.feedbackCard}>
              <MaterialIcons name="wifi-off" size={30} color="#f5f5f0" />
              <Text style={styles.feedbackText}>{errorMessage}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => void loadTitulos()}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!loading && !errorMessage ? (
            <View style={styles.carouselRow}>
              <FlatList
                ref={listRef}
                data={trophies}
                keyExtractor={(item) => item.id}
                renderItem={renderTrophy}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                getItemLayout={(_, index) => ({ length: cardWidth, offset: cardWidth * index, index })}
                onMomentumScrollEnd={onMomentumEnd}
              />
            </View>
          ) : null}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#063217",
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.22,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(3, 30, 14, 0.84)",
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
    borderColor: "#155e2f",
  },
  profileName: {
    color: "#14381f",
    fontSize: 14,
    fontWeight: "600",
  },
  clubBlock: {
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  crest: {
    width: 92,
    height: 92,
  },
  clubName: {
    marginTop: 14,
    color: "#f5f5f0",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  clubSubtitle: {
    marginTop: 6,
    color: "#dbe7d8",
    fontSize: 13,
    fontWeight: "500",
  },
  updatedAt: {
    marginTop: 8,
    color: "#cfe0d0",
    fontSize: 11,
  },
  sectionHeader: {
    alignItems: "center",
    marginTop: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#f5f5f0",
    fontSize: 34,
    fontWeight: "700",
  },
  sectionLine: {
    marginTop: 8,
    width: 150,
    height: 3,
    backgroundColor: "rgba(245, 245, 240, 0.8)",
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
  carouselRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButtonDisabled: {
    opacity: 0.25,
  },
  cardWrapper: {
    width: cardWidth,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  trophyCard: {
    width: "100%",
    aspectRatio: 0.73,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#0c7bff",
    backgroundColor: "#111",
  },
  trophyCardBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  trophyCardImage: {
    opacity: 0.22,
  },
  trophyCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 8, 8, 0.75)",
  },
  trophyIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(207, 219, 209, 0.3)",
  },
  titleRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 8,
    gap: 4,
  },
  textArrowButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  trophyName: {
    color: "#f5f5f0",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    flexShrink: 1,
  },
  trophyYear: {
    marginTop: 8,
    color: "#dbe7d8",
    fontSize: 20,
    fontWeight: "700",
  },
  trophyQuote: {
    marginTop: 10,
    color: "#dbe7d8",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 14,
  },
  trophyDescription: {
    marginTop: 10,
    color: "#dbe7d8",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 18,
    lineHeight: 18,
  },
});
