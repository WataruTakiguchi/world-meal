/**
 * types.ts
 * - TheMealDB / REST Countries のレスポンス型と、共通で使う型定義を集約。
 * - 動的キー（strIngredient1..20 等）はインデックスシグネチャで安全に扱う。
 */

/** TheMealDB: エリア一覧のレスポンス */
export type AreaResponse = { meals: { strArea: string }[] };

/** TheMealDB: エリアで絞った簡易リストのレスポンス */
export type FilterResponse = {
  meals: { strMeal: string; strMealThumb: string; idMeal: string }[];
};

/** TheMealDB: 料理詳細（動的キー含む） */
export type MealDetail = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strSource?: string;
  strYoutube?: string;
  /** strIngredient1..20 / strMeasure1..20 などを安全に扱うための動的プロパティ */
  [k: string]: string | undefined;
};

/** TheMealDB: 料理詳細のラッパーレスポンス */
export type MealDetailResponse = { meals: MealDetail[] };

/** REST Countries: 国情報の最小セット */
export type Country = {
  name: { common: string; official?: string };
  flags?: { png?: string; svg?: string; alt?: string };
  capital?: string[];
  region?: string;
  subregion?: string;
  population?: number;
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  cca2?: string;
  cca3?: string;
  maps?: { googleMaps?: string; openStreetMaps?: string };
};

/** 共通: パース済みの材料1項目 */
export type Ingredient = { ingredient: string; measure: string };
