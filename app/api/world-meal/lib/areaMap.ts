/**
 * areaMap.ts
 * - TheMealDB の strArea（例: "Italian"）→ REST Countries に投げる国名の素朴な対応表。
 * - 全網羅ではないため、未定義の場合は strArea 自体を国名として使用する。
 */
export const areaToCountry: Record<string, string> = {
  American: "United States",
  British: "United Kingdom",
  Canadian: "Canada",
  Chinese: "China",
  Croatian: "Croatia",
  Dutch: "Netherlands",
  Egyptian: "Egypt",
  French: "France",
  Greek: "Greece",
  Indian: "India",
  Irish: "Ireland",
  Italian: "Italy",
  Jamaican: "Jamaica",
  Japanese: "Japan",
  Kenyan: "Kenya",
  Malaysian: "Malaysia",
  Mexican: "Mexico",
  Moroccan: "Morocco",
  Polish: "Poland",
  Portuguese: "Portugal",
  Russian: "Russia",
  Spanish: "Spain",
  Thai: "Thailand",
  Tunisian: "Tunisia",
  Turkish: "Türkiye",
  Vietnamese: "Vietnam",
};
