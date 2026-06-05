# Azure デプロイ手順（Cyberduck / FTP 方式）

ポケモン図鑑・最強剣・特殊羽リストを Azure App Service で公開する手順。
アプリ本体は `app5.js`（Express + EJS）。

公開URL（作成後）:
- 図鑑一覧 … `https://<アプリ名>.azurewebsites.net/pokemonzukan`
- 最強剣一覧 … `https://<アプリ名>.azurewebsites.net/saikyouken`
- 特殊羽リスト … `https://<アプリ名>.azurewebsites.net/hane`

---

## 1. App Service（Webアプリ）を作る — Azureポータル

1. <https://portal.azure.com> にログイン（Azure for Students サブスクリプション）
2. 「リソースの作成」→「Web アプリ」
3. 設定:
   - **公開**: コード
   - **ランタイムスタック**: Node 20 LTS
   - **OS**: Linux
   - **地域**: Japan East など
   - **価格プラン**: **F1（Free）** を選択（学生サブスクで無料）
   - アプリ名（= URLの一部）を決める
4. 「確認および作成」→「作成」。数十秒で完成。

## 2. スタートアップコマンドを設定（重要）

node_modules はFTPで上げると遅い（837ファイル）ので、**Azure側で `npm install` させる**。

- 作成したWebアプリ →「設定 > 構成」→「全般設定」タブ
- **スタートアップ コマンド** に次を入力して保存:
  ```
  npm install && npm start
  ```
- 保存すると再起動がかかる。

## 3. FTPS の接続情報を取得

- Webアプリ →「デプロイ > デプロイ センター」→「FTPS 資格情報」タブ
- 以下3つをメモ:
  - **FTPS エンドポイント**（`ftps://waws-prod-xxxx.ftp.azurewebsites.windows.net/site/wwwroot` の形）
  - **ユーザー名**（`<アプリ名>\$<アプリ名>` の形）
  - **パスワード**

## 4. Cyberduck でアップロード

1. Cyberduck →「新規接続」
2. プロトコル: **FTP-SSL (Explicit AUTH TLS)**
3. サーバー: 手順3のエンドポイントのホスト部分（`waws-prod-xxxx.ftp.azurewebsites.windows.net`）
4. ユーザー名・パスワード: 手順3の値
5. 接続後、**`/site/wwwroot`** フォルダへ移動
6. wwwroot 内の既定ファイル（`hostingstart.html` 等）があれば消してよい
7. 以下を wwwroot 直下にアップロード:
   - `app5.js`
   - `package.json`
   - `package-lock.json`
   - `views/`（フォルダごと）
   - `public/`（フォルダごと）

   ※ `node_modules/` は **上げない**（手順2でAzureが入れる）。
   ※ 他の `app2.js〜app8.js` や `*.md`・`*.pdf` は不要。

## 5. 起動確認

- アップロード後、Webアプリ →「概要」→「再起動」を一度押すと確実。
- 初回は `npm install` が走るため起動まで1〜2分かかることがある。
- `https://<アプリ名>.azurewebsites.net/pokemonzukan` を開いて表示されればOK。
- 真っ白／エラーのときは「ログ ストリーム」（監視 > ログ ストリーム）でエラーを確認。

---

## 代替案: node_modules も全部FTPで上げる場合

手順2のスタートアップコマンドは設定せず（または `npm start` だけにして）、
手順4で `node_modules/` も丸ごとアップロードする。
express/ejs は純JSなのでmacOSで入れたものがLinuxでもそのまま動く。
ただし837ファイルの転送に時間がかかり、途中で失敗しやすい点に注意。
