import {
  getAvgDailyUsage,
  getPreferredSupplier,
  getProducts,
} from "@/lib/db";
import type { StockPrediction } from "@/lib/types";

const REORDER_DAYS_BUFFER = 7;

export async function computePredictions(
  businessId: string,
): Promise<StockPrediction[]> {
  const products = await getProducts(businessId);
  const predictions: StockPrediction[] = [];

  for (const p of products) {
    const avgDailyUsage = p.avgDailyUsage ?? (await getAvgDailyUsage(businessId, p.name));
    const daysUntilOut =
      avgDailyUsage > 0 ? Math.floor(p.quantity / avgDailyUsage) : null;
    // Recommended order covers usage until restock + buffer, at least min stock.
    const recommendedOrder = Math.max(
      p.minimumStock,
      Math.ceil(avgDailyUsage * (REORDER_DAYS_BUFFER + (daysUntilOut ?? 0) + 14)),
    );
    const preferredSupplier = await getPreferredSupplier(businessId, p.name);
    predictions.push({
      product: p.name,
      currentStock: p.quantity,
      avgDailyUsage,
      daysUntilOut,
      recommendedOrder,
      preferredSupplier,
    });
  }

  return predictions;
}

export function needsReorder(pred: StockPrediction): boolean {
  if (pred.daysUntilOut === null) return pred.currentStock <= 0;
  return pred.daysUntilOut <= REORDER_DAYS_BUFFER || pred.currentStock <= 0;
}

export function predictionToAlert(pred: StockPrediction): string {
  if (pred.currentStock <= 0) {
    return `❌ ${pred.product} is OUT of stock. Recommended order: ${pred.recommendedOrder}${
      pred.preferredSupplier ? ` from ${pred.preferredSupplier}` : ""
    }.`;
  }
  if (pred.daysUntilOut !== null && pred.daysUntilOut <= REORDER_DAYS_BUFFER) {
    return `⚠ Low Stock Alert: ${pred.product} will finish in ${pred.daysUntilOut} day(s). Recommended order: ${pred.recommendedOrder}${
      pred.preferredSupplier ? ` from ${pred.preferredSupplier}` : ""
    }.`;
  }
  return "";
}
