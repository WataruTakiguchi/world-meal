/**
 * restcountries.ts
 * - REST Countries から国名で1件取得するクライアント（表示に必要なフィールドのみ）。
 */
import type { Country } from "./types";

const FIELDS =
  "name,flags,capital,region,subregion,population,currencies,languages,cca2,cca3,maps";

/**
 * 国名（例: "Japan"）で検索して最初の1件を返す。
 * 見つからない/HTTPエラー時は null。
 */
export const fetchCountryByName = async (
  countryName: string
): Promise<Country | null> => {
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(
      countryName
    )}?fields=${FIELDS}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const list = (await res.json()) as Country[];
  return Array.isArray(list) ? list[0] ?? null : null;
};
