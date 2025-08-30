/**
 * serializer.ts
 * - REST Countries のオブジェクト型（通貨・言語）を表示用の文字列へ整形。
 */
import type { Country } from "./types";

/** 通貨オブジェクト → "Japanese yen (¥), Euro (€)" 形式の文字列に変換 */
export const serializeCurrencies = (c: Country["currencies"] | null): string => {
  if (!c) return "";
  return Object.values(c)
    .map((v) => (v.symbol ? `${v.name} (${v.symbol})` : v.name))
    .join(", ");
};

/** 言語オブジェクト → "Japanese, English" 形式の文字列に変換 */
export const serializeLanguages = (l: Country["languages"] | null): string => {
  if (!l) return "";
  return Object.values(l).join(", ");
};
