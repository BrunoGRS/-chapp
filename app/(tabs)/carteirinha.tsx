import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const listRef = useRef<FlatList<CardPage>>(null);

  const onMomentumEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setCurrentIndex(next);
  };

  const goTo = (index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  const renderCardPage = ({ item }: ListRenderItemInfo<CardPage>) => {
    if (item.side === "front") {
      return (
        <View style={styles.page}>
          <View style={styles.card}>
            <View style={styles.cardGradient} />

            <View style={styles.frontContent}>
              <View style={styles.frontRow}>
                <View style={styles.frontColumn}>
                  <Text style={styles.frontLabel}>Nome do Socio</Text>
                  <Text style={styles.frontValue}>Palloma</Text>

                  <Text style={[styles.frontLabel, styles.fieldSpacing]}>Matricula</Text>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeText}>000100</Text>
                  </View>
                </View>

                <View style={styles.clubColumn}>
                  <Image source={require("../../assets/images/chape_simbolo.jpg")} style={styles.clubLogo} />
                  <Text style={styles.clubVerticalText}>Associacao Chapecoense de Futebol</Text>
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
          </View>
        </View>
      </View>
    );
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
            <View style={styles.headerIcon}>
              <MaterialIcons name="chevron-left" size={22} color="#f6f7f5" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Carteirinha de Socio</Text>
              <Text style={styles.headerSubtitle}>Atualizado em: 22/02/2026</Text>
            </View>
          </View>

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
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="description" size={18} color="#355c20" />
              <Text style={styles.actionText}>Exportar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="content-copy" size={18} color="#355c20" />
              <Text style={styles.actionText}>Copiar QR Code</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="delete" size={18} color="#355c20" />
              <Text style={styles.actionText}>Remover Carteirinha</Text>
            </TouchableOpacity>
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
  },
  bigQrBox: {
    width: 220,
    height: 220,
    borderRadius: 6,
    backgroundColor: "#f5f5f0",
    alignItems: "center",
    justifyContent: "center",
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
