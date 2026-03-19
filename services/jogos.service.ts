import { requestApi } from "@/services/apiClient";
import type { JogosOverview } from "@/types/jogos";

export async function getJogosOverview() {
  return requestApi<JogosOverview>("/jogos/overview");
}
