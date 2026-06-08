# Azure デプロイ手順（VM / Ubuntu 方式）

ポケモン図鑑・最強剣・特殊羽リストを Azure の仮想マシン（VM）上で公開する手順。
アプリ本体は `app5.js`（Express + EJS）。3システムすべてこの1本に入っている。

公開URL（作成後 / IP直アクセスの場合）:
- 図鑑一覧 … `http://<VMのパブリックIP>:8080/pokemonzukan`
- 最強剣一覧 … `http://<VMのパブリックIP>:8080/saikyouken`
- 特殊羽リスト … `http://<VMのパブリックIP>:8080/hane`
- マインスイーパー … `http://<VMのパブリックIP>:8080/minesweeper/`（末尾スラッシュ推奨）

---

## 1. VM を作る — Azureポータル

1. <https://portal.azure.com> にログイン（Azure for Students サブスクリプション）
2. 「リソースの作成」→「仮想マシン」
3. 設定:
   - **イメージ**: Ubuntu Server 22.04 LTS
   - **サイズ**: B1s など小さいもの（学生クレジットで十分）
   - **認証の種類**: SSH 公開キー（推奨。パスワードでも可）
   - **ユーザー名**: 例 `azureuser`
   - **受信ポート**: SSH(22) を許可
4. 「確認および作成」→「作成」。SSHキーを選んだ場合は秘密鍵(.pem)をダウンロードして保管。
5. 完成後、「概要」で **パブリックIPアドレス** をメモ。

## 2. アプリ用ポート(8080)を開ける — NSG

- 作成したVM →「ネットワーク」→「受信ポートの規則」→「ポート規則の追加」
- **宛先ポート範囲: 8080**、プロトコル TCP、アクション 許可 で保存。
  （80番で公開したい場合は手順6のnginxを使う。その場合は80も開ける）

## 3. SSH でログイン & Node をインストール

```bash
ssh azureuser@<VMのパブリックIP>          # パスワード認証ならこのまま
# SSHキー認証なら: ssh -i ダウンロードした鍵.pem azureuser@<IP>

# Node 20 を NodeSource から入れる（apt 標準版は古いので使わない）
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
node -v   # v20 系が出ればOK
```

## 4. アプリを配置（推奨: git clone）

```bash
git clone https://github.com/harukiti82/webpro_06.git
cd webpro_06
npm install         # express / ejs を取得
```

> **Cyberduck(SFTP)で上げたい場合**: プロトコル「SFTP」、サーバー `<VMのIP>`、
> ポート22、ユーザー名 `azureuser`（鍵認証なら鍵を指定）で接続し、
> ファイル一式を `/home/azureuser/webpro_06` に置く。
> その後 SSH で `cd webpro_06 && npm install` を実行する。
> `node_modules` は上げず、VM上で `npm install` する方が速くて確実。

## 5. pm2 で常駐起動（再起動後も自動で立ち上がる）

```bash
sudo npm install -g pm2
PORT=8080 pm2 start app5.js --name webpro   # ポート8080で起動
pm2 save                                    # 現在の構成を保存
pm2 startup                                 # 表示されたコマンドをコピペ実行 → OS再起動後も自動起動
```

動作確認:
- ブラウザで `http://<VMのIP>:8080/pokemonzukan` を開く。
- ログ確認は `pm2 logs webpro`、再起動は `pm2 restart webpro`。
- コード更新時は `git pull && npm install && pm2 restart webpro`。

これで完了。以下は「:8080 なしのキレイなURL(80番)で見せたい」場合のみ。

---

## 6.（任意）nginx で 80 番ポートに出す

`http://<IP>/pokemonzukan` のようにポート番号なしでアクセスしたい場合、
nginx をリバースプロキシにして 80 → 8080 へ流す。手順2で80番も開けておくこと。

```bash
sudo apt install -y nginx
sudo tee /etc/nginx/sites-available/webpro >/dev/null <<'EOF'
server {
    listen 80;
    server_name _;
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/webpro /etc/nginx/sites-enabled/webpro
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

これで `http://<VMのIP>/pokemonzukan` でアクセスできる。

---

## 補足

- VM を停止(割り当て解除)するとパブリックIPが変わることがある。固定したい場合は
  ポータルでパブリックIPを「静的」に変更する。
- アプリは `PORT` 環境変数を見る実装（未指定なら8080）。pm2 起動時に `PORT=8080` を渡している。

## マインスイーパーについて

`/minesweeper/` は `minesweeper/`（React + Vite 製）を**ビルドした静的ファイル**を
`public/minesweeper/` に置き、`app5.js` の `express.static` で配信している。
VM 側にビルド環境は不要で、`git pull` で同期されたファイルをそのまま配るだけ。

ゲーム本体を修正した場合の更新手順（ローカルで実行）:

```bash
cd minesweeper
npm install        # 初回のみ
npm run build      # dist/ を再生成（vite.config の base は /minesweeper/ 固定）
cd ..
rm -rf public/minesweeper && cp -a minesweeper/dist/. public/minesweeper/
git add public/minesweeper && git commit -m "[改善] マインスイーパー更新" && git push
```

VM 側は `git pull && pm2 restart webpro` で反映される（`npm install` は不要）。
