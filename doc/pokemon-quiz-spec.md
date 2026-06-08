# 残念なポケモン図鑑クイズ — 実装仕様書（Sonnet 向け）

> この仕様書は **Claude Sonnet が実装する前提**で書いてある。
> 「いい感じに」「適切に」のような曖昧表現は使わない。具体的な値・関数名・ファイルパス・
> JSON の形を全部書いてあるので、**リテラルにこの通り実装すること**。
> 想定と実コードが食い違ったら勝手に進めず、その場で止めて報告すること。

## 0. このタスクで作るもの

既存の Express アプリ（`app5.js`）に「残念なポケモン図鑑クイズ」を追加する。
サーバーがランダムに 1 匹のポケモンを正解として選び、その**残念な図鑑説明文だけ**を
クライアントに見せ、4 択から当てさせるゲーム。

### なぜこの設計なのか（崩してはいけない核心）

**正解のポケモンIDをクライアントに絶対に渡さない。** サーバーがトークンに紐づけて保持し、
判定もサーバーで行う。これにより「サーバーが無いと遊べない・チートできない」状態になり、
「Node を用いたサーバー＆クライアントのプログラム」という課題要件を本質的に満たす。
→ クライアントのソースを見ても答えが分からない実装にすること。`/pokemonquiz/new` の
レスポンスに `answerId` 等の正解情報を含めてはいけない。

## 1. 技術前提（既存に合わせる。新規ライブラリ追加禁止）

- サーバー: 既存の `express`（`app5.js` に追記）。`ejs` テンプレート。
- クライアント: 素の JavaScript（`fetch` で JSON API を叩き、DOM を書き換える）。フレームワーク不可。
- 状態保持: **express-session は使わない。** サーバー内のメモリ上のオブジェクト
  `quizSessions`（後述）にトークン→正解IDを保持する。
- データ: `app5.js` 内に既にある `pokemon` 配列をそのまま使う（追加・改変しない）。

## 2. 触るファイル一覧

| 種別 | パス | 内容 |
|---|---|---|
| 変更 | `app5.js` | クイズ用ルート3本と `quizSessions` 変数、ヘルパ関数を追記 |
| 新規 | `views/pokemonquiz.ejs` | クイズ画面の器（HTML骨組み）。中身は client JS が描画 |
| 新規 | `public/pokemonquiz.js` | クライアントロジック（fetch・DOM更新・スコア管理） |
| 変更 | `public/style.css` | クイズ画面用のスタイルを末尾に追記 |
| 変更 | `views/home.ejs` | ホームにクイズへのカードリンクを追加 |

**Read すべきファイル（着手前に必ず読む）**:
`app5.js`（pokemon 配列の構造と既存ルートの書き方）、
`views/pokemonzukan.ejs` と `views/pokemonzukan_detail.ejs`（EJS と画像参照 `/public/<image>` の書き方）、
`public/style.css`（`.home-card` 等の既存クラス）、
`views/home.ejs`（カードの追加位置）。

## 3. データ構造

`pokemon` 配列の各要素（既存・変更しない）:

```js
{ id: 1, dot: "ロコンdot.png", code: 37, name: "ロコン",
  bunrui: "きつねポケモン", type: "炎", takasa: 0.6, omosa: 9.9,
  setumei: "自分より強い相手に襲われると…", image: "ロコン.png" }
```

- クイズの問題文には `setumei`（残念な説明）を使う。
- 選択肢の表示には `name` を使う。
- 正解発表時のすがた画像は `/public/<image>` で参照（例 `/public/ロコン.png`）。

サーバーに新設する状態（`app5.js` の上部、配列定義の近くに置く）:

```js
// クイズの正解をトークンに紐づけて保持する（クライアントには正解を渡さないため）。
// key: token(string), value: { answerId: number, createdAt: number }
let quizSessions = {};
```

## 4. API 仕様（この3本だけ。URL・メソッド・JSON 形を厳守）

### 4-1. `GET /pokemonquiz` — クイズ画面を返す

- 処理: `res.render('pokemonquiz')` のみ。
- レスポンス: `views/pokemonquiz.ejs` をレンダリングした HTML。

### 4-2. `GET /pokemonquiz/new` — 新しい問題を生成して返す（JSON）

- 処理:
  1. `pokemon` 配列からランダムに 1 匹を選び「正解」とする。
  2. 残りのポケモンからランダムに 3 匹を選ぶ（正解と重複させない）。
  3. 正解＋ダミー3匹の計4匹を**シャッフル**して選択肢にする。
  4. ランダムなトークン文字列を発行し、`quizSessions[token] = { answerId: 正解のid, createdAt: Date.now() }` を保存。
  5. 下記 JSON を返す。**正解が分かる情報（answerId・正解名など）は絶対に含めない。**
- レスポンス JSON（例）:

```json
{
  "token": "k3f9a1c7b2",
  "setumei": "自分より強い相手に襲われると傷ついたふりをして惑わせその隙に逃げてしまう。",
  "choices": [
    { "id": 5, "name": "ビリリダマ" },
    { "id": 1, "name": "ロコン" },
    { "id": 9, "name": "メタモン" },
    { "id": 3, "name": "ヤドン" }
  ]
}
```

- トークン生成: `Math.random().toString(36).slice(2)` を 2 回つないだ文字列など、衝突しにくい英数字列にする。

### 4-3. `POST /pokemonquiz/answer` — 解答を判定して返す（JSON）

- リクエスト: `Content-Type: application/json`、body `{ "token": "k3f9a1c7b2", "choiceId": 1 }`
  - 注意: 既存の `app.use(express.urlencoded(...))` だけでは JSON body を受け取れない。
    `app5.js` の上部に **`app.use(express.json());`** を 1 行追加すること（新規ライブラリではなく express 標準機能）。
- 処理:
  1. `quizSessions[token]` を取得。無ければ `{ error: "セッションが見つかりません" }` を
     HTTP 400 で返す。
  2. `choiceId === quizSessions[token].answerId` で正誤判定。
  3. 判定後、`delete quizSessions[token]`（使い捨て。1問1トークン）。
  4. 下記 JSON を返す。**ここで初めて正解情報をクライアントに渡してよい**（採点後だから）。
- レスポンス JSON（例）:

```json
{
  "correct": true,
  "correctId": 1,
  "correctName": "ロコン",
  "correctImage": "ロコン.png",
  "correctSetumei": "自分より強い相手に襲われると…"
}
```

- `correctImage` はファイル名のみを返す（クライアント側で `/public/` を前置して `<img>` に使う）。

### ルートを書く位置（重要）

`app5.js` の **404 ハンドラ（`app.use((req, res) => { ... 404 ... })`）より前**に3本を置く。
404 ハンドラの後ろに書くと到達しないため必ず手前に追記すること。

## 5. クライアント仕様（`public/pokemonquiz.js`）

### 画面要素（`views/pokemonquiz.ejs` 側に用意する id）

- `#score` … スコア表示（`正解 X / 出題 Y　連続 Z`）
- `#setumei` … 問題文（残念な説明）を表示する領域
- `#choices` … 選択肢ボタン4個を入れるコンテナ
- `#result` … 正誤と正解のすがた画像を表示する領域
- `#next-btn` … 「次の問題へ」ボタン（最初は非表示）

### 状態（client JS のモジュール内変数）

```js
let total = 0;    // 出題数
let correct = 0;  // 正解数
let streak = 0;   // 連続正解数
let currentToken = null;
```

### 振る舞い

1. ページ読み込み時に `loadQuestion()` を呼ぶ。
2. `loadQuestion()`:
   - `#result` を空に、`#next-btn` を非表示に戻す。
   - `GET /pokemonquiz/new` を `fetch`。
   - `currentToken` に `token` を保存。
   - `#setumei` に `setumei` を表示。
   - `choices` を各ボタン化して `#choices` に並べる。ボタン押下で `submitAnswer(choiceId)`。
3. `submitAnswer(choiceId)`:
   - 選択肢ボタンを全て無効化（連打防止）。
   - `POST /pokemonquiz/answer` に `{ token: currentToken, choiceId }` を JSON で送る。
   - レスポンスで採点:
     - `total++`。`correct` が true なら `correct++`、`streak++`。false なら `streak = 0`。
     - `#result` に「正解！」/「残念！正解は <correctName>」を表示し、
       `<img src="/public/<correctImage>" width="200">` を出す。
     - 不正解時は、押したボタンを赤、正解ボタン（`correctId`）を緑にする。
     - `#score` を更新。`#next-btn` を表示。
4. `#next-btn` 押下で `loadQuestion()`。

### 通信エラー時

`fetch` が失敗、またはレスポンスが `error` を含む場合は `#result` に
「通信エラーが発生しました。ページを再読み込みしてください」と表示する。

## 6. EJS（`views/pokemonquiz.ejs`）

- `pokemonzukan_detail.ejs` と同じ骨組み（`<link rel="stylesheet" href="/public/style.css">`）。
- `<body>` に第5節の id を持つ要素を配置。
- 末尾で `<script src="/public/pokemonquiz.js"></script>` を読み込む。
- 「図鑑に戻る」リンク `<a href="/pokemonzukan">` と「ホーム」リンク `<a href="/">` を置く。

## 7. CSS（`public/style.css` の末尾に追記）

- `.quiz-choice`（選択肢ボタン）: 既存トーンに合わせた角丸ボタン。`width: 100%` 程度で押しやすく。
- `.quiz-choice.correct` → 背景を緑系、`.quiz-choice.wrong` → 背景を赤系。
- `#result img` → `border-radius` 付き。
- 既存の配色・命名規則（`.home-card` 等）と大きく外れないこと。

## 8. ホーム（`views/home.ejs`）

特殊羽カードの後ろに、以下のカードを1つ追加する:

```html
<a class="home-card" href="/pokemonquiz">
  <span class="home-card-title">残念なポケモン図鑑クイズ</span>
  <span class="home-card-desc">残念な図鑑説明だけでポケモンを当てる4択クイズ</span>
</a>
```

## 9. タスク分割と受け入れ条件（Definition of Done）

- [ ] **T1. サーバー: 状態と JSON 受信準備**
  - `app5.js` に `app.use(express.json());` と `let quizSessions = {};` を追加。
  - 受け入れ: `node -c app5.js` が通る。

- [ ] **T2. サーバー: `GET /pokemonquiz/new`**
  - 第4-2節の通り。4択生成＋トークン保存。
  - 受け入れ: `curl http://localhost:8080/pokemonquiz/new` で `token`・`setumei`・`choices`(4件) が返り、
    レスポンスに `answerId` 等の正解情報が**含まれない**。choices に正解が必ず1つ含まれる。

- [ ] **T3. サーバー: `POST /pokemonquiz/answer`**
  - 第4-3節の通り。判定後にトークンを削除。
  - 受け入れ: 正しい `choiceId` で `correct:true`、誤りで `correct:false` が返る。
    無効/使用済みトークンで HTTP 400。

- [ ] **T4. サーバー: `GET /pokemonquiz`**
  - `res.render('pokemonquiz')`。404 ハンドラより前に配置。
  - 受け入れ: ブラウザで `/pokemonquiz` が 200 で開く。

- [ ] **T5. クライアント: `public/pokemonquiz.js` と `views/pokemonquiz.ejs`**
  - 第5・6節の通り。
  - 受け入れ: `/pokemonquiz` で問題が表示され、4択を押すと採点され、正解画像が出て、
    「次の問題へ」で次が出る。スコア（正解/出題/連続）が正しく増減する。

- [ ] **T6. CSS とホームカード**
  - 第7・8節の通り。
  - 受け入れ: ホームにクイズカードが出て遷移できる。正誤でボタン色が変わる。

## 10. 動作確認手順（実装後に必ず実行）

```bash
node -c app5.js                      # 構文OK
PORT=8095 node app5.js &             # 起動
curl -s http://localhost:8095/pokemonquiz/new        # token/setumei/choices(4) 確認・answerId が無いこと
# 返ってきた token と、choices のどれかの id で:
curl -s -X POST http://localhost:8095/pokemonquiz/answer \
  -H 'Content-Type: application/json' \
  -d '{"token":"<上で得たtoken>","choiceId":<id>}'   # correct と correctName 確認
```

ブラウザで `http://localhost:8095/pokemonquiz` を開き、数問プレイしてスコアが動くことを確認する。

## 11. コミット規約

グローバル CLAUDE.md（`~/.claude/CLAUDE.md`）に従う。日本語・`[種別] 概要`。
機能単位で分割（サーバー / クライアント / スタイル など）。
**注意**: `webpro_06` は Azure に公開中の本番コードなので、`main` 直 push はせず
ブランチを切って PR 経由でマージすること。
