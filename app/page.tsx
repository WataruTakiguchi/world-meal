"use client";

import { useState } from "react";
import Image from "next/image";

/** ====== API payload types ====== */
type Currency = { name: string; symbol: string };
type Ingredient = { ingredient: string; measure: string };

type Country = {
  name: string;
  flagPng: string | null;
  flagAlt: string;
  capital: string | null;
  region: string | null;
  subregion: string | null;
  population: number | null;
  currencies: Record<string, Currency> | null;
  languages: Record<string, string> | null;
  code2: string | null;
  code3: string | null;
  maps: { googleMaps?: string; openStreetMaps?: string } | null;
  /** ★ サーバーが返す日本語表示用フィールド */
  currenciesTextJa?: string | null;
  languagesTextJa?: string | null;
};

type Meal = {
  id: string;
  name: string;
  thumb: string;
  category: string;
  instructions: string;
  source: string | null;
  youtube: string | null;
  ingredients: Ingredient[];
};

export type MealPayload = {
  area: string;
  meal: Meal;
  country: Country | null;
};

export default function Page() {
  const [data, setData] = useState<MealPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const roll = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/world-meal", { cache: "no-store" });
      if (!res.ok) throw new Error("API error");
      const json: MealPayload = await res.json();
      setData(json);
    } catch (e) {
      setErr(
        e instanceof Error
          ? e.message
          : "サーバーが混み合っています。もう一回どうぞ！"
      );
    } finally {
      setLoading(false);
    }
  };

  // 既存の英語ベース組み立て（フォールバック用）
  const currencyList = data?.country?.currencies
    ? Object.values(data.country.currencies)
        .map((c) => (c.symbol ? `${c.name} (${c.symbol})` : c.name))
        .join(", ")
    : "-";

  const languageList = data?.country?.languages
    ? Object.values(data.country.languages).join(", ")
    : "-";

  // ★ 日本語を優先して表示
  const currencyDisplay =
    data?.country?.currenciesTextJa?.trim() || currencyList;

  const languageDisplay =
    data?.country?.languagesTextJa?.trim() || languageList;

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl flex flex-col gap-6 text-black">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">
            🌍 世界の豆知識＋ごはん
          </h1>
          <button
            onClick={roll}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-orange-500 shadow hover:bg-orange-600 text-white disabled:opacity-50 cursor-pointer"
          >
            {loading ? "考え中…" : "引く！"}
          </button>
        </header>

        {err && <p className="text-red-600">{err}</p>}

        {!data && !loading && (
          <p className="text-gray-700">
            ボタンを押すと、世界の料理と国の豆知識がランダムで表示されます。
          </p>
        )}

        {data && (
          <section className="grid lg:grid-cols-2 gap-6">
            {/* 料理カード */}
            <article className="bg-white rounded-2xl shadow p-4 grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">🍽 今日の一皿</h2>
              </div>
              <div className="w-full aspect-video relative">
                <Image
                  src={data.meal.thumb}
                  alt={data.meal.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-xl object-cover"
                  priority
                />
              </div>

              <h3 className="text-lg font-bold">{data.meal.name}</h3>

              <div>
                <h4 className="font-semibold mb-1">材料</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {data.meal.ingredients.map((it, i) => (
                    <li key={i}>
                      {it.ingredient}
                      {it.measure ? ` — ${it.measure}` : ""}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-1">作り方（要約）</h4>
                <p className="text-gray-700 whitespace-pre-line">
                  {data.meal.instructions.length > 400
                    ? `${data.meal.instructions.slice(0, 400)}...`
                    : data.meal.instructions}
                </p>
                <div className="flex gap-3 mt-2">
                  {data.meal.source && (
                    <a
                      className="text-blue-600 underline"
                      href={data.meal.source}
                      target="_blank"
                    >
                      ソース
                    </a>
                  )}
                  {data.meal.youtube && (
                    <a
                      className="text-blue-600 underline"
                      href={data.meal.youtube}
                      target="_blank"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            </article>

            {/* 国の豆知識カード */}
            <article className="bg-white rounded-2xl shadow px-4 pt-4 pb-4 gap-4">
              <div className="flex mb-4">
                <h2 className="text-xl font-semibold">🧠 国の豆知識</h2>
              </div>

              <div className="flex gap-2 mb-6">
                {data.country?.flagPng && (
                  <div className="relative w-10 h-7">
                    <Image
                      src={data.country.flagPng}
                      alt={data.country.flagAlt}
                      fill
                      sizes="40px"
                      className="rounded border object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold leading-tight">
                    {data.country?.name ?? data.area}
                  </h3>
                  <p className="text-gray-600 leading-snug">
                    {data.country?.region}
                    {data.country?.subregion
                      ? ` / ${data.country.subregion}`
                      : ""}
                  </p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-y-1 text-sm mb-6">
                <dt className="text-gray-500">首都</dt>
                <dd>{data.country?.capital ?? "-"}</dd>

                <dt className="text-gray-500">人口</dt>
                <dd>{data.country?.population?.toLocaleString() ?? "-"}</dd>

                <dt className="text-gray-500">通貨</dt>
                <dd className="truncate">{currencyDisplay}</dd>

                <dt className="text-gray-500">言語</dt>
                <dd className="truncate">{languageDisplay}</dd>
              </dl>

              {data.country?.maps?.googleMaps && (
                <a
                  className="text-blue-600 underline"
                  href={data.country.maps.googleMaps}
                  target="_blank"
                >
                  Google マップで見る
                </a>
              )}
            </article>
          </section>
        )}

        <footer className="pt-4 text-sm text-gray-500">
          家族の会話ネタ例：「今日は{data?.country?.name ?? "???"}の『
          {data?.meal.name ?? "？？？"}』だって！ 首都は
          {data?.country?.capital ?? "？"}、人口は
          {data?.country?.population?.toLocaleString() ?? "？"}人！」
        </footer>
      </div>
    </main>
  );
}
