import { requestApi } from "@/services/apiClient";
import type { CarteirinhaOverview } from "@/types/carteirinha";

export async function getCarteirinhaOverview() {
  return requestApi<CarteirinhaOverview>("/carteirinha/overview");
}
