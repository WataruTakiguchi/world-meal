/**
 * mealdb.ts
 * - TheMealDB への HTTP クライアント。エリア、エリア別一覧、詳細の3関数。
 * - すべて no-store（都度フェッチ）でキャッシュは行わない。
 */
import type {
  AreaResponse,
  FilterResponse,
  MealDetail,
  MealDetailResponse,
} from "./types";

const BASE = "https://www.themealdb.com/api/json/v1/1";

/** 利用可能なエリア名の一覧を取得（"Unknown" は除外） */
export const fetchAreas = async (): Promise<string[]> => {
  const res = await fetch(`${BASE}/list.php?a=list`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch areas");
  const json = (await res.json()) as AreaResponse;
  return (json.meals ?? [])
    .map((m) => m.strArea)
    .filter((a) => a && a !== "Unknown");
};

/** 指定エリアの料理簡易リストを取得（id/名前/サムネ） */
export const fetchMealsByArea = async (
  area: string
): Promise<FilterResponse["meals"]> => {
  const res = await fetch(`${BASE}/filter.php?a=${encodeURIComponent(area)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch meals by area");
  const json = (await res.json()) as FilterResponse;
  return (json.meals ?? []).filter((m) => m.idMeal);
};

/** 料理IDから詳細を取得（見つからなければ null） */
export const fetchMealDetail = async (
  idMeal: string
): Promise<MealDetail | null> => {
  const res = await fetch(`${BASE}/lookup.php?i=${encodeURIComponent(idMeal)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch meal detail");
  const json = (await res.json()) as MealDetailResponse;
  return json.meals?.[0] ?? null;
};
