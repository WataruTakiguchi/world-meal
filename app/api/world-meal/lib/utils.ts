/**
 * utils.ts
 * - 小さなユーティリティ群（乱択・材料パース）。
 */
import type { Ingredient, MealDetail } from "./types";

/** 配列からランダムに1要素取り出す */
export const pick = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

/**
 * TheMealDB の動的キー（strIngredient1..20, strMeasure1..20）から
 * 材料配列を生成する。
 */
export const parseIngredients = (meal: MealDetail): Ingredient[] => {
  const items: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.trim();
    const mea = meal[`strMeasure${i}`]?.trim();
    if (ing && ing.length > 0) items.push({ ingredient: ing, measure: mea ?? "" });
  }
  return items;
};
