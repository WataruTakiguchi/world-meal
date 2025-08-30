type DeepLResponse = {
  translations: { detected_source_language: string; text: string }[];
};

const DEEPL_ENDPOINT = "https://api-free.deepl.com/v2/translate";
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

/** DeepLで配列を一括日本語化（失敗/未設定時は元文を返す） */
export const translateBatchToJa = async (texts: string[]): Promise<string[]> => {
  const cleaned = texts.map((t) => (t ?? "").toString());
  if (!DEEPL_API_KEY) return cleaned;

  try {
    const params = new URLSearchParams();
    cleaned.forEach((t) => params.append("text", t));
    params.append("target_lang", "JA");
    params.append("source_lang", "EN"); // 英→日を明示

    const res = await fetch(DEEPL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
      cache: "no-store",
    });

    if (!res.ok) return cleaned;
    const json = (await res.json()) as DeepLResponse;
    if (!json.translations || json.translations.length !== cleaned.length) return cleaned;
    return json.translations.map((tr) => tr.text);
  } catch {
    return cleaned;
  }
};
