/**
 * route.ts
 * - オーケストレーション層：外部API呼び出し → 整形 → 翻訳 → JSON応答。
 * - ビジネスロジックは lib/ 以下に分離。ここでは「処理の流れ」だけ読む設計。
 */
import { NextResponse } from "next/server";
import { areaToCountry } from "./lib/areaMap";
import { pick, parseIngredients } from "./lib/utils";
import { serializeCurrencies, serializeLanguages } from "./lib/serializer";
import { fetchAreas, fetchMealsByArea, fetchMealDetail } from "./lib/mealdb";
import { fetchCountryByName } from "./lib/restcountries";
import type { Ingredient } from "./lib/types";
import { translateBatchToJa } from "./lib/translate";

/** GET /api/world-meal: ランダムな料理＋対応国の豆知識を返す */
export const GET = async () => {
  try {
    // 1) エリア → ランダム
    const areas = await fetchAreas();
    if (areas.length === 0) throw new Error("No areas available");
    const area = pick(areas);

    // 2) そのエリアの候補から1件
    const pool = await fetchMealsByArea(area);
    if (pool.length === 0) throw new Error("No meals found for area");
    const picked = pick(pool);

    // 3) 詳細取得
    const meal = await fetchMealDetail(picked.idMeal);
    if (!meal) throw new Error("Meal detail not found");

    // 4) 国情報
    const countryName = areaToCountry[meal.strArea] || meal.strArea || "Japan";
    const country = await fetchCountryByName(countryName);

    // 5) 材料パース
    const ingredients = parseIngredients(meal);

    // 6) 翻訳（まとめて）
    const capitalRaw = country?.capital?.[0] ?? "";
    const currenciesRaw = serializeCurrencies(country?.currencies ?? null);
    const languagesRaw = serializeLanguages(country?.languages ?? null);

    const toTranslate: string[] = [
      meal.strMeal,               // 0: 料理名
      meal.strCategory,           // 1: カテゴリー
      meal.strInstructions,       // 2: 手順
      country?.name.common ?? "", // 3: 国名
      country?.region ?? "",      // 4: 地域
      country?.subregion ?? "",   // 5: サブ地域
      // 6: 材料まとめ（改行連結）
      ingredients.map((it) => (it.measure ? `${it.ingredient} — ${it.measure}` : it.ingredient)).join("\n"),
      capitalRaw,                 // 7: 首都
      currenciesRaw,              // 8: 通貨（表示用）
      languagesRaw,               // 9: 言語（表示用）
    ];

    const [
      nameJa, categoryJa, instructionsJa,
      countryNameJa, regionJa, subregionJa,
      ingredientsJaJoined, capitalJa, currenciesJa, languagesJa,
    ] = await translateBatchToJa(toTranslate);

    const ingredientsJa: Ingredient[] =
      ingredientsJaJoined && ingredientsJaJoined.length > 0
        ? ingredientsJaJoined.split("\n").map((line) => {
            const [ing, meas] = line.split(" — ");
            return { ingredient: ing ?? "", measure: meas ?? "" };
          })
        : ingredients;

    // 7) レスポンス
    return NextResponse.json({
      area,
      meal: {
        id: meal.idMeal,
        name: nameJa || meal.strMeal,
        thumb: meal.strMealThumb,
        category: categoryJa || meal.strCategory,
        instructions: instructionsJa || meal.strInstructions,
        source: meal.strSource ?? null,
        youtube: meal.strYoutube ?? null,
        ingredients: ingredientsJa.length > 0 ? ingredientsJa : ingredients,
      },
      country: country
        ? {
            name: countryNameJa || country.name.common,
            flagPng: country.flags?.png ?? null,
            flagAlt: country.flags?.alt ?? `Flag of ${country.name.common}`,
            capital: (capitalJa || capitalRaw || null) as string | null,
            region:  regionJa  || country.region  || null,
            subregion: subregionJa || country.subregion || null,
            population: country.population ?? null,
            currencies: country.currencies ?? null, // 生データ保持
            languages: country.languages ?? null,   // 生データ保持
            currenciesTextJa: currenciesJa || currenciesRaw || null, // 表示用
            languagesTextJa:  languagesJa  || languagesRaw  || null, // 表示用
            code2: country.cca2 ?? null,
            code3: country.cca3 ?? null,
            maps: country.maps ?? null,
          }
        : null,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
