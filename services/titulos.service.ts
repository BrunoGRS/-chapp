import { requestApi } from "@/services/apiClient";
import type { TitulosOverview } from "@/types/titulos";

export async function getTitulosOverview() {
  return requestApi<TitulosOverview>("/titulos/overview");
}
