## 使い方

まず、`.env.local`を作成し、以下のような記載をしてください。

```
DEEPL_API_KEY={あなたが保持しているDeepL APIキー}
```

※DeepL API キーを保持していない場合は、[こちら](https://support.deepl.com/hc/ja/articles/360020695820-DeepL-API-%E3%81%AE-API-%E3%82%AD%E3%83%BC)を参照して API キーを取得してください。
.env.local を作成しなくても動きますが、コンテンツが全て英語表記となります。

その上で、`npm run dev`を実行すると、ローカル環境で実際に動かすことができます。

## 参考資料

[こちら](https://zenn.dev/ohimusdev46301/articles/f352c403a65987)の Zenn の記事に開発の流れや処理の解説が書かれています。
