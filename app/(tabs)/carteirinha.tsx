import * as Clipboard from "expo-clipboard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ListRenderItemInfo,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getCarteirinhaOverview } from "@/services/carteirinha.service";
import type { CarteirinhaOverview } from "@/types/carteirinha";

type CardSide = "front" | "qr";

type CardPage = {
  id: string;
  side: CardSide;
};

const pages: CardPage[] = [
  { id: "frente", side: "front" },
  { id: "verso", side: "qr" },
];

const { width } = Dimensions.get("window");
const pageWidth = width - 52;

export default function CarteirinhaScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<CarteirinhaOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRemoved, setIsRemoved] = useState(false);
  const listRef = useRef<FlatList<CardPage>>(null);

  useEffect(() => {
    void loadCarteirinha();
  }, []);

  async function loadCarteirinha(showRefreshing = false) {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage(null);
      const response = await getCarteirinhaOverview();
      setData(response);
      setIsRemoved(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao carregar carteirinha";
      setErrorMessage(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function onMomentumEnd(event: { nativeEvent: { contentOffset: { x: number } } }) {
    const next = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setCurrentIndex(next);
  }

  function goTo(index: number) {
    listRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  }

  async function handleExport() {
    if (!data) {
      return;
    }

    await Share.share({
      message: [
        "Carteirinha CHApp",
        `Nome: ${data.memberName}`,
        `Matricula: ${data.memberNumber}`,
        `Plano: ${data.planName}`,
        `Validade: ${data.validUntil}`,
        `QR: ${data.qrCode}`,
      ].join("\n"),
    });
  }

  async function handleCopyQrCode() {
    if (!data) {
      return;
    }

    await Clipboard.setStringAsync(data.qrCode);
    Alert.alert("QR copiado", "O codigo da carteirinha foi copiado para a area de transferencia.");
  }

  function handleRemoveCard() {
    Alert.alert("Remover carteirinha", "Deseja remover a carteirinha desta sessao do app?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => setIsRemoved(true),
      },
    ]);
  }

  function renderCardPage({ item }: ListRenderItemInfo<CardPage>) {
    if (!data) {
      return null;
    }

    if (item.side === "front") {
      return (
        <View style={styles.page}>
          <View style={styles.card}>
            <View style={styles.cardGradient} />

            <View style={styles.frontContent}>
              <View style={styles.frontTop}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{data.status}</Text>
                </View>
                <Text style={styles.planText}>{data.planName}</Text>
              </View>

              <View style={styles.frontRow}>
                <View style={styles.frontColumn}>
                  <Text style={styles.frontLabel}>Nome do Socio</Text>
                  <Text style={styles.frontValue}>{data.memberName}</Text>

                  <Text style={[styles.frontLabel, styles.fieldSpacing]}>Matricula</Text>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeText}>{data.memberNumber}</Text>
                  </View>

                  <Text style={[styles.frontLabel, styles.fieldSpacing]}>Validade</Text>
                  <Text style={styles.frontSmallValue}>{data.validUntil}</Text>
                </View>

                <View style={styles.clubColumn}>
                  <Image source={require("../../assets/images/chape_simbolo.jpg")} style={styles.clubLogo} />
                  <Text style={styles.clubVerticalText}>{data.clubName}</Text>
                </View>
              </View>

              <View style={styles.frontFooter}>
                <View style={styles.smallQr}>
                  <MaterialIcons name="qr-code" size={58} color="#2b6f42" />
                </View>
                <View style={styles.memberPhotoWrap}>
                  <Image source={require("../../assets/images/chape_simbolo.jpg")} style={styles.memberPhoto} />
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.page}>
        <View style={styles.card}>
          <View style={styles.cardGradient} />
          <View style={styles.qrContent}>
            <View style={styles.bigQrBox}>
              <MaterialIcons name="qr-code" size={160} color="#247248" />
            </View>
            <Text style={styles.qrCodeText}>{data.qrCode}</Text>
          </View>
        </View>
      </View>
    );
  }

  const emptyStateVisible = !loading && !errorMessage && isRemoved;

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
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void loadCarteirinha(true)}
              tintColor="#f5f5f0"
            />
          }
        >
          <View style={styles.headerBar}>
            <View style={styles.headerIcon}>
              <MaterialIcons name="badge" size={18} color="#f6f7f5" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Carteirinha de Socio</Text>
              <Text style={styles.headerSubtitle}>
                {data?.updatedAt
                  ? `Atualizado em: ${new Date(data.updatedAt).toLocaleString("pt-BR")}`
                  : "Atualizando dados da carteirinha"}
              </Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.feedbackCard}>
              <ActivityIndicator size="large" color="#f5f5f0" />
              <Text style={styles.feedbackText}>Carregando carteirinha...</Text>
            </View>
          ) : null}

          {!loading && errorMessage ? (
            <View style={styles.feedbackCard}>
              <MaterialIcons name="wifi-off" size={30} color="#f5f5f0" />
              <Text style={styles.feedbackText}>{errorMessage}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => void loadCarteirinha()}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {emptyStateVisible ? (
            <View style={styles.feedbackCard}>
              <MaterialIcons name="credit-card-off" size={34} color="#f5f5f0" />
              <Text style={styles.feedbackText}>A carteirinha foi removida desta sessao do app.</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => void loadCarteirinha()}>
                <Text style={styles.retryText}>Baixar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {!loading && !errorMessage && !isRemoved ? (
            <>
              <View style={styles.cardArea}>
                <FlatList
                  ref={listRef}
                  data={pages}
                  horizontal
                  pagingEnabled
                  keyExtractor={(item) => item.id}
                  renderItem={renderCardPage}
                  showsHorizontalScrollIndicator={false}
                  decelerationRate="fast"
                  getItemLayout={(_, index) => ({ length: pageWidth, offset: pageWidth * index, index })}
                  onMomentumScrollEnd={onMomentumEnd}
                />
              </View>

              <View style={styles.dots}>
                {pages.map((page, index) => (
                  <TouchableOpacity key={page.id} onPress={() => goTo(index)}>
                    <View style={[styles.dot, currentIndex === index && styles.dotActive]} />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => void handleExport()}>
                  <MaterialIcons name="description" size={18} color="#355c20" />
                  <Text style={styles.actionText}>{data?.actions.exportLabel ?? "Exportar"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => void handleCopyQrCode()}>
                  <MaterialIcons name="content-copy" size={18} color="#355c20" />
                  <Text style={styles.actionText}>{data?.actions.copyLabel ?? "Copiar QR Code"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleRemoveCard}>
                  <MaterialIcons name="delete" size={18} color="#355c20" />
                  <Text style={styles.actionText}>{data?.actions.removeLabel ?? "Remover Carteirinha"}</Text>
                </TouchableOpacity>
              </View>
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
    marginTop: 22,
    marginHorizontal: 14,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#355c20",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#2e2e2e",
    marginTop: 2,
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
  cardArea: {
    marginTop: 12,
  },
  page: {
    width: pageWidth,
    alignItems: "center",
  },
  card: {
    width: "88%",
    height: 420,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#0c5a34",
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0f7a49",
    opacity: 0.86,
  },
  frontContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    justifyContent: "space-between",
  },
  frontTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: "rgba(245, 245, 240, 0.18)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: "#f5f5f0",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  planText: {
    color: "#f5f5f0",
    fontSize: 12,
    fontWeight: "600",
  },
  frontRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  frontColumn: {
    width: "52%",
  },
  frontLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    color: "#f5f5f0",
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  frontValue: {
    marginTop: 4,
    color: "#f5f5f0",
    fontSize: 18,
    fontWeight: "700",
  },
  frontSmallValue: {
    marginTop: 4,
    color: "#f5f5f0",
    fontSize: 14,
    fontWeight: "700",
  },
  fieldSpacing: {
    marginTop: 20,
  },
  codeBox: {
    marginTop: 6,
    backgroundColor: "#f5f5f0",
    borderRadius: 4,
    width: 88,
    paddingVertical: 6,
    alignItems: "center",
  },
  codeText: {
    color: "#1f2a1f",
    fontSize: 14,
    fontWeight: "700",
  },
  clubColumn: {
    width: "40%",
    alignItems: "center",
  },
  clubLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#cfe8d6",
  },
  clubVerticalText: {
    marginTop: 14,
    color: "#f1f6ef",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    textAlign: "center",
  },
  frontFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  smallQr: {
    width: 84,
    height: 84,
    borderRadius: 8,
    backgroundColor: "#f5f5f0",
    alignItems: "center",
    justifyContent: "center",
  },
  memberPhotoWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#f5f5f0",
    padding: 4,
  },
  memberPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  qrContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  bigQrBox: {
    width: 220,
    height: 220,
    borderRadius: 6,
    backgroundColor: "#f5f5f0",
    alignItems: "center",
    justifyContent: "center",
  },
  qrCodeText: {
    marginTop: 20,
    color: "#f5f5f0",
    fontSize: 12,
    textAlign: "center",
  },
  dots: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "rgba(215, 223, 213, 0.45)",
  },
  dotActive: {
    backgroundColor: "#a7b8a6",
  },
  actions: {
    marginTop: 14,
    paddingHorizontal: 18,
    gap: 8,
  },
  actionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 12,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#1c1f1b",
    fontWeight: "700",
  },
});
