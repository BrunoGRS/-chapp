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

type Trophy = {
  id: string;
  title: string;
  year: string;
  quote: string;
};

const trophies: Trophy[] = [
  {
    id: "sul-americana",
    title: "Copa Sul-Americana",
    year: "2016",
    quote: '"Meu Furacao, tu es sempre um vencedor.."',
  },
  {
    id: "catarinense",
    title: "Campeonato Catarinense",
    year: "2020",
    quote: '"A nossa forca vem da arquibancada."',
  },
  {
    id: "serie-b",
    title: "Brasileiro Serie B",
    year: "2013",
    quote: '"Do Oeste para o Brasil, com garra e coracao."',
  },
];

const { width } = Dimensions.get("window");
const cardWidth = width - 92;

export default function TitulosScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList<Trophy>>(null);

  const goTo = (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(nextIndex, trophies.length - 1));
    listRef.current?.scrollToIndex({ index: boundedIndex, animated: true });
    setCurrentIndex(boundedIndex);
  };

  const onMomentumEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    setCurrentIndex(next);
  };

  const renderTrophy = ({ item, index }: ListRenderItemInfo<Trophy>) => (
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
    </View>
  );

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

          <View style={styles.clubBlock}>
            <Image source={require("../../assets/images/chape_simbolo.jpg")} style={styles.crest} />
            <Text style={styles.clubName}>Associacao Chapecoense de Futebol</Text>
            <Text style={styles.clubSubtitle}>o Furacao do Oeste</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Titulos</Text>
            <View style={styles.sectionLine} />
          </View>

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
});
