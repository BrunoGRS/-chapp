import { requestApi } from "@/services/apiClient";
import type { HistoriaOverview } from "@/types/historia";

export async function getHistoriaOverview() {
  return requestApi<HistoriaOverview>("/historia/overview");
}
