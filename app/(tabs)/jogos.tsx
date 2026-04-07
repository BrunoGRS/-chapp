import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { AnimatedEnter } from "@/components/animated-enter";
import { StateCard } from "@/components/state-card";
import { ChapeTheme } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { getJogosOverview } from "@/services/jogos.service";
import type { FeaturedMatch, JogosOverview, Standing, StandingForm } from "@/types/jogos";

const CHAPE_BADGE = require("../../assets/images/chape_simbolo.jpg");
const USER_AVATAR = require("../../assets/images/personagem.png");

export default function JogosScreen() {
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const [data, setData] = useState<JogosOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadJogos();
  }, []);

  async function loadJogos(showRefreshing = false) {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage(null);
      const response = await getJogosOverview();
      setData(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao carregar jogos";
      setErrorMessage(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function renderFormIcon(form: StandingForm) {
    if (form === "up") {
      return <MaterialIcons name="arrow-drop-up" size={20} color="#63d482" />;
    }
    if (form === "down") {
      return <MaterialIcons name="arrow-drop-down" size={20} color="#ff8974" />;
    }
    return <MaterialIcons name="remove" size={16} color={ChapeTheme.colors.textSubtle} />;
  }

  function isChapeTeam(teamName: string) {
    const normalized = teamName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return normalized.includes("chapecoense") || normalized.includes("chape");
  }

  function getMatchVariant(match: FeaturedMatch) {
    const normalizedStatus = match.status.toLowerCase();

    if (normalizedStatus.includes("ao vivo")) {
      return "live";
    }

    if (normalizedStatus.includes("encerrado")) {
      return "finished";
    }

    return "upcoming";
  }

  function getMatchBadge(match: FeaturedMatch, index: number) {
    const variant = getMatchVariant(match);

    if (variant === "live") {
      return "Ao vivo";
    }

    if (variant === "finished") {
      return index === 0 ? "Último jogo" : "Encerrado";
    }

    return index === 0 ? "Próximo jogo" : "Na sequência";
  }

  function getTeamBadgeSource(teamName: string, crestUrl?: string | null): ImageSourcePropType | null {
    if (isChapeTeam(teamName)) {
      return CHAPE_BADGE;
    }

    if (crestUrl) {
      return { uri: crestUrl };
    }

    return null;
  }

  const featuredMatches = data?.featuredMatches ?? [];
  const standings = data?.standings ?? [];
  const isCompact = width < 460;

  const chapeStanding = standings.find((item) => isChapeTeam(item.team));
  const standingsSummary = [
    { label: "competição", value: data?.competition ?? "Calendário" },
    { label: "jogos em foco", value: String(featuredMatches.length).padStart(2, "0") },
    { label: "posição atual", value: chapeStanding ? `${chapeStanding.position}º` : "--" },
  ];

  return (
    <View style={styles.root}>
      <ImageBackground source={CHAPE_BADGE} resizeMode="cover" style={styles.background} imageStyle={styles.bgImage}>
        <View style={styles.overlay} />
        <View style={[styles.orb, styles.orbTop]} />
        <View style={[styles.orb, styles.orbBottom]} />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => void loadJogos(true)} tintColor="#f7f5eb" />
          }
        >
          <View style={styles.profilePill}>
            <Image source={USER_AVATAR} style={styles.avatar} />
            <View>
              <Text style={styles.profileEyebrow}>Central de jogos</Text>
              <Text style={styles.profileName}>{user?.name ?? "Torcedor"}</Text>
            </View>
          </View>

          <AnimatedEnter delay={40}>
            <View style={styles.heroCard}>
            <Text style={styles.heroEyebrow}>Agenda e classificação</Text>
            <Text style={styles.heroTitle}>{data?.competition ?? "Acompanhe a campanha da Chape"}</Text>
            <Text style={styles.heroSubtitle}>
              Cards de partidas com leitura mais direta e tabela com hierarquia melhor para acompanhar o momento do clube.
            </Text>

            <View style={[styles.summaryRow, isCompact && styles.stackColumn]}>
              {standingsSummary.map((item) => (
                <View key={item.label} style={[styles.summaryCard, isCompact && styles.fullWidthCard]}>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            {data?.updatedAt ? (
              <View style={styles.updatedPill}>
                <MaterialIcons name="schedule" size={14} color={ChapeTheme.colors.textMuted} />
                <Text style={styles.updatedText}>
                  Atualizado em {new Date(data.updatedAt).toLocaleDateString("pt-BR")}
                </Text>
              </View>
            ) : null}
            </View>
          </AnimatedEnter>

          {loading ? (
            <AnimatedEnter delay={90}>
              <StateCard
                loading
                title="Carregando jogos"
                description="Buscando agenda em destaque e classificação da competição."
              />
            </AnimatedEnter>
          ) : null}

          {!loading && errorMessage ? (
            <AnimatedEnter delay={90}>
              <StateCard
                icon="wifi-off"
                title="Falha ao carregar jogos"
                description={errorMessage}
                actionLabel="Tentar novamente"
                onAction={() => void loadJogos()}
              />
            </AnimatedEnter>
          ) : null}

          {!loading && !errorMessage ? (
            <>
              <AnimatedEnter delay={120} style={styles.sectionHeader}>
                <Text style={styles.sectionEyebrow}>Partidas</Text>
                <Text style={styles.sectionTitle}>Recorte mais importante do calendário</Text>
              </AnimatedEnter>

              <View style={styles.matchesColumn}>
                {featuredMatches.length ? (
                  featuredMatches.map((match, index) => {
                    const variant = getMatchVariant(match);

                    return (
                      <AnimatedEnter
                        key={match.id}
                        delay={150 + index * 50}
                        style={[
                          styles.matchCard,
                          variant === "live" && styles.matchCardLive,
                          variant === "upcoming" && styles.matchCardUpcoming,
                        ]}
                      >
                        <View style={styles.matchHeader}>
                          <View style={[styles.matchBadge, variant === "live" && styles.matchBadgeLive]}>
                            <Text style={[styles.matchBadgeText, variant === "live" && styles.matchBadgeTextLive]}>
                              {getMatchBadge(match, index)}
                            </Text>
                          </View>
                          <Text style={styles.matchTime}>{match.matchTime}</Text>
                        </View>

                        <Text style={styles.matchStatus}>{match.status}</Text>

                        <View style={styles.matchScoreRow}>
                          <TeamBlock
                            align="left"
                            logo={<TeamBadge source={getTeamBadgeSource(match.homeTeam, match.homeTeamCrest)} />}
                            name={match.homeTeam}
                          />
                          <View style={styles.scoreCenter}>
                            <Text style={styles.scoreValue}>{match.homeScore}</Text>
                            <Text style={styles.scoreDivider}>x</Text>
                            <Text style={styles.scoreValue}>{match.awayScore}</Text>
                          </View>
                          <TeamBlock
                            align="right"
                            logo={<TeamBadge source={getTeamBadgeSource(match.awayTeam, match.awayTeamCrest)} />}
                            name={match.awayTeam}
                          />
                        </View>

                        <View style={styles.venueRow}>
                          <MaterialIcons name="place" size={14} color={ChapeTheme.colors.textSubtle} />
                          <Text style={styles.venueText}>{match.venue}</Text>
                        </View>
                      </AnimatedEnter>
                    );
                  })
                ) : (
                  <AnimatedEnter delay={150}>
                    <StateCard
                      icon="event-busy"
                      title="Nenhum jogo encontrado"
                      description="Não apareceu nenhuma partida da Chape neste recorte de calendário."
                    />
                  </AnimatedEnter>
                )}
              </View>

              <AnimatedEnter delay={320} style={styles.sectionHeader}>
                <Text style={styles.sectionEyebrow}>Tabela</Text>
                <Text style={styles.sectionTitle}>Classificação resumida</Text>
              </AnimatedEnter>

              <AnimatedEnter delay={360} style={styles.tableCard}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderText, styles.colPosition]}>Pos</Text>
                  <Text style={[styles.tableHeaderText, styles.colTeam]}>Equipe</Text>
                  <Text style={[styles.tableHeaderText, styles.colTrend]}>F</Text>
                  <Text style={[styles.tableHeaderText, styles.colPoints]}>P</Text>
                  <Text style={[styles.tableHeaderText, styles.colGames]}>J</Text>
                </View>

                {standings.map((item) => (
                  <StandingRow
                    key={`${item.position}-${item.team}`}
                    item={item}
                    highlight={isChapeTeam(item.team)}
                    trendIcon={renderFormIcon(item.form)}
                    />
                  ))}
              </AnimatedEnter>
            </>
          ) : null}
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

function TeamBlock({
  align,
  logo,
  name,
}: {
  align: "left" | "right";
  logo: React.ReactNode;
  name: string;
}) {
  return (
    <View style={[styles.teamBlock, align === "right" && styles.teamBlockRight]}>
      {align === "left" ? logo : null}
      <Text style={[styles.teamName, align === "right" && styles.teamNameRight]}>{name}</Text>
      {align === "right" ? logo : null}
    </View>
  );
}

function TeamBadge({ source }: { source: ImageSourcePropType | null }) {
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return (
      <View style={styles.opponentBadge}>
        <MaterialIcons name="sports-soccer" size={14} color={ChapeTheme.colors.textSubtle} />
      </View>
    );
  }

  return <Image source={source} style={styles.teamLogo} onError={() => setFailed(true)} />;
}

function StandingRow({
  item,
  highlight,
  trendIcon,
}: {
  item: Standing;
  highlight: boolean;
  trendIcon: React.ReactNode;
}) {
  return (
    <View style={[styles.tableRow, highlight && styles.tableRowHighlight]}>
      <Text style={[styles.tableCell, styles.colPosition]}>{item.position}</Text>
      <Text style={[styles.tableCell, styles.colTeam, highlight && styles.teamHighlight]}>{item.team}</Text>
      <View style={[styles.colTrend, styles.trendWrap]}>{trendIcon}</View>
      <Text style={[styles.tableCell, styles.colPoints]}>{item.points}</Text>
      <Text style={[styles.tableCell, styles.colGames]}>{item.games}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ChapeTheme.colors.page,
  },
  background: {
    flex: 1,
  },
  bgImage: {
    opacity: 0.1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ChapeTheme.colors.overlay,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orbTop: {
    width: 240,
    height: 240,
    top: -70,
    right: -46,
    backgroundColor: "rgba(123, 216, 255, 0.08)",
  },
  orbBottom: {
    width: 300,
    height: 300,
    bottom: 70,
    left: -150,
    backgroundColor: "rgba(215, 240, 106, 0.07)",
  },
  content: {
    paddingTop: 26,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  profilePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 8,
    borderRadius: ChapeTheme.radii.pill,
    backgroundColor: "rgba(247, 245, 235, 0.92)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: ChapeTheme.colors.primary,
  },
  profileEyebrow: {
    fontSize: 11,
    color: ChapeTheme.colors.textSubtle,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  profileName: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "700",
    color: "#102015",
  },
  heroCard: {
    marginTop: 20,
    padding: 24,
    borderRadius: ChapeTheme.radii.lg,
    backgroundColor: "rgba(13, 48, 28, 0.86)",
    borderWidth: 1,
    borderColor: ChapeTheme.colors.borderStrong,
    ...ChapeTheme.shadow,
  },
  heroEyebrow: {
    color: ChapeTheme.colors.gold,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  heroTitle: {
    marginTop: 10,
    color: ChapeTheme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  heroSubtitle: {
    marginTop: 10,
    color: ChapeTheme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  summaryRow: {
    marginTop: 22,
    flexDirection: "row",
    gap: 10,
  },
  stackColumn: {
    flexDirection: "column",
  },
  summaryCard: {
    flex: 1,
    minHeight: 96,
    padding: 14,
    borderRadius: ChapeTheme.radii.sm,
    backgroundColor: "rgba(247, 245, 235, 0.06)",
    justifyContent: "space-between",
  },
  fullWidthCard: {
    width: "100%",
    flex: 0,
  },
  summaryValue: {
    color: ChapeTheme.colors.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  summaryLabel: {
    color: ChapeTheme.colors.textSubtle,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  updatedPill: {
    alignSelf: "flex-start",
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: ChapeTheme.radii.pill,
    backgroundColor: "rgba(247, 245, 235, 0.06)",
  },
  updatedText: {
    color: ChapeTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  feedbackCard: {
    marginTop: 20,
    padding: 24,
    borderRadius: ChapeTheme.radii.md,
    backgroundColor: ChapeTheme.colors.surfaceMuted,
    alignItems: "center",
    gap: 12,
  },
  feedbackText: {
    color: ChapeTheme.colors.text,
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 4,
    backgroundColor: ChapeTheme.colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: ChapeTheme.radii.pill,
  },
  retryText: {
    color: "#102015",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 14,
  },
  sectionEyebrow: {
    color: ChapeTheme.colors.gold,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  sectionTitle: {
    marginTop: 6,
    color: ChapeTheme.colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  matchesColumn: {
    gap: 12,
  },
  matchCard: {
    padding: 18,
    borderRadius: ChapeTheme.radii.md,
    backgroundColor: "rgba(8, 28, 17, 0.88)",
    borderWidth: 1,
    borderColor: ChapeTheme.colors.border,
  },
  matchCardLive: {
    borderColor: "rgba(99, 212, 130, 0.5)",
    backgroundColor: "rgba(11, 41, 24, 0.96)",
  },
  matchCardUpcoming: {
    backgroundColor: "rgba(16, 52, 31, 0.92)",
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  matchBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: ChapeTheme.radii.pill,
    backgroundColor: "rgba(247, 245, 235, 0.08)",
  },
  matchBadgeLive: {
    backgroundColor: "rgba(99, 212, 130, 0.16)",
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: ChapeTheme.colors.accentSoft,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  matchBadgeTextLive: {
    color: "#d9ffe6",
  },
  matchTime: {
    color: ChapeTheme.colors.textSubtle,
    fontSize: 12,
    fontWeight: "600",
  },
  matchStatus: {
    marginTop: 12,
    color: ChapeTheme.colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  matchScoreRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  teamBlock: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  teamBlockRight: {
    alignItems: "center",
  },
  teamLogo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: ChapeTheme.colors.borderStrong,
  },
  opponentBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: ChapeTheme.colors.border,
    backgroundColor: "rgba(247, 245, 235, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  teamName: {
    color: ChapeTheme.colors.text,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  teamNameRight: {
    textAlign: "center",
  },
  scoreCenter: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  scoreValue: {
    color: ChapeTheme.colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
  },
  scoreDivider: {
    color: ChapeTheme.colors.textSubtle,
    fontSize: 18,
    fontWeight: "700",
  },
  venueRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  venueText: {
    color: ChapeTheme.colors.textSubtle,
    fontSize: 12,
  },
  emptyMatchesCard: {
    padding: 24,
    borderRadius: ChapeTheme.radii.md,
    backgroundColor: "rgba(247, 245, 235, 0.06)",
    alignItems: "center",
    gap: 10,
  },
  tableCard: {
    padding: 16,
    borderRadius: ChapeTheme.radii.lg,
    backgroundColor: "rgba(247, 245, 235, 0.94)",
    ...ChapeTheme.shadow,
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(16, 32, 21, 0.08)",
  },
  tableHeaderText: {
    color: "#738174",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 46,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(16, 32, 21, 0.06)",
  },
  tableRowHighlight: {
    backgroundColor: "rgba(20, 83, 45, 0.08)",
    borderRadius: 12,
    paddingHorizontal: 6,
  },
  tableCell: {
    color: "#102015",
    fontSize: 13,
    fontWeight: "600",
  },
  teamHighlight: {
    color: ChapeTheme.colors.primaryBright,
    fontWeight: "800",
  },
  trendWrap: {
    alignItems: "center",
  },
  colPosition: {
    width: 34,
    textAlign: "center",
  },
  colTeam: {
    flex: 1,
  },
  colTrend: {
    width: 32,
  },
  colPoints: {
    width: 34,
    textAlign: "center",
  },
  colGames: {
    width: 34,
    textAlign: "center",
  },
});
