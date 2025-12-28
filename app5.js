"use strict";
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

let pokemon = [
  { id:1, dot:"ロコンdot.png", code:37, name:"ロコン",  bunrui:"きつねポケモン", type:"炎", takasa:0.6, omosa:9.9, setumei:"自分より強い相手に襲われると傷ついたふりをして惑わせその隙に逃げてしまう。" , image:"ロコン.png" },
  { id:2, dot:"マンキーdot.png", code:56, name:"マンキー",  bunrui:"ぶたざるポケモン", type:"格闘", takasa:0.5, omosa:28.0, setumei:"木の上で群れを作って暮らす。群れからはぐれたマンキーは寂しくてすぐに怒り出す。", image:"マンキー.png" },
  { id:3, dot:"ヤドンdot.png", code:79, name:"ヤドン",  bunrui:"まぬけポケモン", type:"エスパー,水", takasa:1.2, omosa:36.0, setumei:"動きが鈍く間抜け。叩かれても5秒経ってから痛さを感じるほどだ。", image:"ヤドン.png" },
  { id:4, dot:"カモネギdot.png", code:83, name:"カモネギ",  bunrui:"かもがるポケモン", type:"ノーマル,飛行", takasa:0.8, omosa:15.0, setumei:"クキがなくなると生きていけない。だからクキを狙う相手とは命懸けで戦うのだ。", image:"カモネギ.png" },
  { id:5, dot:"ビリリダマdot.png", code:100, name:"ビリリダマ",  bunrui:"ボールポケモン", type:"電気", takasa:0.5, omosa:10.4, setumei:"転がって移動するので地面がデコボコだとショックで爆発してしまう。", image:"ビリリダマ.png" },
  { id:6, dot:"マルマインdot.png", code:101, name:"マルマイン",  bunrui:"ボールポケモン", type:"電気", takasa:1.2, omosa:66.6, setumei:"電気エネルギーを溜め込むほど高速で動けるようになるがその分爆発しやすい。", image:"マルマイン.png" },
  { id:7, dot:"サイホーンdot.png", code:111, name:"サイホーン",  bunrui:"とげとげポケモン", type:"地面,岩", takasa:1.0, omosa:115.0, setumei:"半径10キロメートルの範囲を縄張りにしているが忘れてしまうらしい。", image:"サイホーン.png" },
  { id:8, dot:"コイキングdot.png", code:129, name:"コイキング",  bunrui:"さかなポケモン", type:"水", takasa:0.9, omosa:10.0, setumei:"力のない情けないポケモン。たまに高く飛び跳ねても2メートルを越すのがやっとだ。", image:"コイキング.png" },
  { id:9, dot:"メタモンdot.png", code:132, name:"メタモン",  bunrui:"へんしんポケモン", type:"ノーマル", takasa:0.3, omosa:4.0, setumei:"変身は完璧なのだが笑わされて力が抜けると変身は解けてしまう", image:"メタモン.png" },
  { id:10, dot:"ポリゴンZdot.png", code:474, name:"ポリゴンZ",  bunrui:"バーチャルポケモン", type:"ノーマル", takasa:0.9, omosa:34.0, setumei:"さらに優れたポケモンを目指し追加したプログラムに不具合があったらしく動きがおかしい。", image:"ポリゴンZ.png" },
];
let saikyou = [
  { id:1, name:"霊刀・レイゲンノタチ",  level:"76", Atk:380, Mat:0, Pow:17, Int:12, Spd:0, Vit:0, Luk:0, setumei:"強力な霊力を纏い，魂をも斬るとされる霊刀。持つ者に合わせた重さになる。", sozai:"アメノハバキリ×1,呪われた刃×40,墓守の宝珠×14" },
  { id:2, name:"神撃剣",  level:"80", Atk:440, Mat:0, Pow:20, Int:15, Spd:0, Vit:0, Luk:0, setumei:"神すらも焼き尽くす聖炎と融合した人智を超えし神剣。", sozai:"霊刀・レイゲンノタチ×1,アポフィカリックテキスト×15,生命のアンク×50,エーデルフレイム×100" },
  { id:3, name:"神魔剣ベルゼデウス",  level:"81", Atk:500, Mat:0, Pow:25, Int:25, Spd:0, Vit:25, Luk:0, setumei:"強大な力を持つ大悪魔すらも瞬時に討ち消すとされる魔王の魔力を融合した神魔剣。", sozai:"神撃剣×1" },
  { id:4, name:"炎帝剣トリアケラス",  level:"82", Atk:555, Mat:0, Pow:30, Int:30, Spd:0, Vit:30, Luk:0, setumei:"竜族の強力な力によって耐えることのない炎を纏った炎帝剣。", sozai:"神魔剣ベルゼデウス×1" },
  { id:5, name:"聖氷剣クインタニア(青)",  level:"83", Atk:666, Mat:0, Pow:40, Int:30, Spd:0, Vit:35, Luk:0, setumei:"古の時代、聖氷神により賜り、聖宝として崇められる剣からその闘志を受け継ぐことで、創造された聖氷剣。", sozai:"炎帝剣トリアケラス×1,青いかぶりんご×15,フローズンハート×50" },
  { id:6, name:"聖氷剣クインタニア(緑)",  level:"83", Atk:0, Mat:666, Pow:30, Int:40, Spd:0, Vit:35, Luk:0, setumei:"古の時代、聖氷神により賜り、聖宝として崇められる剣からその闘志を受け継ぐことで、創造された聖氷剣。", sozai:"炎帝剣トリアケラス×1,赤いかじりんご×15,フローズンハート×50" },
  { id:7, name:"救世剣イデアフリード(青)",  level:"84", Atk:700, Mat:0, Pow:50, Int:30, Spd:0, Vit:40, Luk:0, setumei:"古の時代、聖氷神により賜り、聖宝として崇められる剣からその闘志を受け継ぐことで、創造された聖氷剣。", sozai:"炎帝剣トリアケラス×1,赤いかじりんご×15,フローズンハート×50" },
  { id:8, name:"救世剣イデアフリード(緑)",  level:"84", Atk:0, Mat:700, Pow:30, Int:50, Spd:0, Vit:40, Luk:0, setumei:"万物に変革をもたらす救世の剣。正しき理想を抱く者へ大いなる力を与える。", sozai:"聖氷剣クインタニア(青or緑)×1,ピュアドロップ×200,アルタサファイア×100,アルタジェード×200,絶輝水晶×110" },
  { id:9, name:"真・神律剣マグナステラ(青)",  level:"85", Atk:777, Mat:0, Pow:60, Int:30, Spd:0, Vit:50, Luk:0, setumei:"神を律する偉大な剣。真の力を手に入れた剣は世界に変革をもたらす強大な力を持つ。", sozai:"救世剣イデアフリード(青or緑)×1,ファントムメモリア×250,ミラージュメモリア×250,ファントムペリドット×250,メモリアペリドット×250,ファントムゼーレ×25.ミラージュゼーレ×25,夢幻のマリス×40,夢幻のレーヴ×40" },
  { id:10, name:"真・神律剣マグナステラ(緑)",  level:"85", Atk:0, Mat:777, Pow:30, Int:60, Spd:0, Vit:50, Luk:0, setumei:"神を律する偉大な剣。真の力を手に入れた剣は世界に変革をもたらす強大な力を持つ。", sozai:"救世剣イデアフリード(青or緑)×1,ファントムメモリア×250,ミラージュメモリア×250,ファントムペリドット×250,メモリアペリドット×250,ファントムゼーレ×25.ミラージュゼーレ×25,夢幻のマリス×40,夢幻のレーヴ×40" },
];

let tyoko = [
  { id:1, image1:"エル羽.png", image2:"エル.png", name:"チョコエルウイングEX", skill_name:"大天使の加護", skill:"MAXHP／MAXSP+400％,POW／INT／SPD／VIT／LUK+20％,ATK／DEF／MAT／MDF+20％,HP自動回復／SP自動回復+100％,ノックバック無効,状態異常解除／防止（呪い含む）", time_min:100, time_max:300, sp:1000, recast:15 },
  { id:2, image1:"ジュダ羽.png", image2:"ジュダ.png", name:"チョコジュダウイングEX", skill_name:"大悪魔の闇翼", skill:"敵の攻撃やスキルの対象にならず無敵状態で戦闘することができる", time_min:5, time_max:9, sp:1000, recast:15 },
  { id:3, image1:"レトロ羽.png", image2:"レトロ.png", name:"チョコレトロウィングEX", skill_name:"スチームパンカー", skill:"敵の防御力を一定割合減算してダメージ付与,カウンター／回避／吹き飛ばし／引き寄せ防止,状態異常解除／防止（呪い含む）,与ダメージ100％ドレイン（スキル攻撃含む)", time_min:60, time_max:300, sp:1000, recast:15 },
  { id:4, image1:"シラ羽.png", image2:"シラ.png", name:"チョコシラ妖尾EX", skill_name:"大妖怪の通力", skill:"スキル詠唱時間を75％短縮,スキル硬直時間を75％短縮,くいしばり,状態異常解除／防止（呪い含む）,消費SP変動,MOV+100", time_min:60, time_max:300, sp:1000, recast:15 },
  { id:5, image1:"フィス羽.png", image2:"フィス.png", name:"チョコフィスカースEX", skill_name:"邪神の呪詛", skill:"攻撃をヒットさせるほどATKとMATが増加,自動で攻撃を行う霊獣を召喚,敵の通常攻撃を回避した際に反撃,敵をスキルで攻撃した際に追撃,LUK30％上昇,状態異常解除／防止（呪い含む）", time_min:60, time_max:300, sp:1000, recast:15 },
  { id:6, image1:"ベネ羽.png", image2:"ベネ.png", name:"チョコベネイージスEX", skill_name:"祝福の蒼盾", skill:"攻撃したモンスターにATK/MAT30％ダウンの状態異常を一定時間付与,受けた攻撃回数に応じてマップ内プレイヤーのDEF/MDF上昇&マップ内モンスターのDEF/MDFダウン,一定範囲内にいる味方プレイヤーに自分の回復の50％を付与,『祝福の蒼盾』発動者が使用した回復アイテムの効果を3倍にする,VITを30％上昇,状態異常解除／防止（呪い含む）", time_min:60, time_max:300, sp:1000, recast:15 },
  { id:7, image1:"シナ羽.png", image2:"シナ.png", name:"チョコマシーナフェイトEX", skill_name:"CODE：焔摩", skill:"職業スキルの再使用時間を初期化,ENを持つエナジーゲージが付与される,スキルクリティカル確率+30%（ペット・霊獣等も含む）,通常攻撃クリティカル確率+30%（ペット・霊獣等も含む）,状態異常解除／防止（呪い含む）", time_min:90, time_max:90, sp:1000, recast:10 },
  { id:8, image1:"シネ羽.png", image2:"シネ.png", name:"チョコマシーネフェイトEX", skill_name:"CODE：羅刹", skill:"職業スキルの再使用時間を初期化,ENを持つエナジーゲージが付与される,スキル再使用時間、スキル詠唱時間およびスキル硬直時間を50%短縮,スキルチャージ時間を75%短縮,状態異常解除／防止（呪い含む）", time_min:90, time_max:90, sp:1000, recast:10 },
  { id:9, image1:"リア羽.png", image2:"リア.png", name:"チョコリアパヴォーネEX", skill_name:"明王の鼓舞・陽", skill:"敵にダメージを与えた際、ダメージが10%増加,スキル再使用時間を50％短縮,スキル詠唱時間及びスキル硬直時間を30%短縮,SPD30%上昇,MAXHP+200%,HP自動回復+50%,SP自動回復+50%,状態異常解除／防止（呪い含む）", time_min:60, time_max:300, sp:1000, recast:15 },
  { id:10, image1:"リエ羽.png", image2:"リエ.png", name:"チョコリエパヴォーネEX", skill_name:"明王の守護・陰", skill:"敵からダメージを受けた際、受けるダメージを30%軽減,スキル再使用時間を50％短縮,スキル詠唱時間及びスキル硬直時間を30%短縮,SPD30%上昇,MAXHP+200%,HP自動回復+50%,SP自動回復+50%,状態異常解除／防止（呪い含む）", time_min:60, time_max:300, sp:1000, recast:15 },
];

app.get("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('keiyo2', {data: station2} );
});

// Create
app.get("/keiyo2/create", (req, res) => {
  res.redirect('/public/keiyo2_new.html');
});

// Read
app.get("/keiyo2/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_detail', {id: number, data: detail} );
});

//edit
app.get("/keiyo2/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_edit', {id: number, data: detail} );
});

// Update
app.post("/keiyo2/update/:number", (req, res) => {
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  station2[req.params.number].code = req.body.code;
  station2[req.params.number].name = req.body.name;
  station2[req.params.number].change = req.body.change;
  station2[req.params.number].passengers = req.body.passengers;
  station2[req.params.number].distance = req.body.distance;
  console.log( station2 );
  res.redirect('/keiyo2' );
});

app.get("/keiyo", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('db1', { data: station });
});

app.get("/keiyo_add", (req, res) => {
  let id = req.query.id;
  let code = req.query.code;
  let name = req.query.name;
  let newdata = { id: id, code: code, name: name };
  station.push( newdata );
  res.render('db1', { data: station });
});

app.get("/pokemonzukan", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('pokemonzukan', {data: pokemon} );
});

// Create
app.get("/pokemonzukan/create", (req, res) => {
  res.render('pokemonzukan_new');
});

// Read
app.get("/pokemonzukan/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = pokemon[ number ];
  if (!detail) {
    return res.status(404).send("その番号のポケモンは図鑑に登録されていません。 <a href='/pokemonzukan'>図鑑一覧に戻る</a>");
  }
  res.render('pokemonzukan_detail', {id: number, data: detail} );
});

//edit
app.get("/pokemonzukan/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = pokemon[ number ];
  res.render('pokemonzukan_edit', {id: number, data: detail} );
});

// Update
app.post("/pokemonzukan/update/:number", (req, res) => {
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  pokemon[req.params.number].code = req.body.code;
  pokemon[req.params.number].name = req.body.name;
  pokemon[req.params.number].bunrui = req.body.bunrui;
  pokemon[req.params.number].type = req.body.type1;
  if (req.body.type2) {
    pokemon[req.params.number].type += "," + req.body.type2;
  }
  pokemon[req.params.number].takasa = req.body.takasa;
  pokemon[req.params.number].omosa = req.body.omosa;
  pokemon[req.params.number].setumei = req.body.setumei;
  console.log( pokemon );
  res.redirect('/pokemonzukan');
});

app.post("/pokemonzukan/add", (req, res) => {
  if (!req.body.name || !req.body.code) {
    return res.status(400).send("名前と図鑑番号は必ず入力してください");
  }
  let code = req.body.code;
  let name = req.body.name;
  let bunrui = req.body.bunrui;
  let type = req.body.type1;
  if (req.body.type2) {
    type += "," + req.body.type2;
  }
  let takasa = req.body.takasa;
  let omosa = req.body.omosa;
  let setumei = req.body.setumei;
  let id = pokemon.length + 1;
  let newdata = { 
    id: id, 
    code: code, 
    name: name, 
    bunrui: bunrui, 
    type: type, 
    takasa: takasa, 
    omosa: omosa, 
    setumei: setumei 
  };
  pokemon.push( newdata );
  res.render('pokemonzukan', { data: pokemon });
});

app.get("/pokemonzukan/delete/:number", (req, res) => {
  const number = req.params.number;
  const detail = pokemon[number]; 
  res.render('pokemonzukan_delete', { id: number, data: detail });
});

app.post("/pokemonzukan/delete-confirm/:number", (req, res) => {
  const number = req.params.number;
  pokemon.splice(number, 1);
  console.log("削除を実行しました");
  res.redirect('/pokemonzukan');
});
// 最強剣
app.get("/saikyouken", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('saikyouken', {data: saikyou} );
});

// Create
app.get("/saikyouken/create", (req, res) => {
  res.redirect('/public/saikyouken_new.html');
});

// Read
app.get("/saikyouken/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = saikyou[ number ];
  res.render('saikyouken_detail', {id: number, data: detail} );
});

//edit
app.get("/saikyouken/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = saikyou[ number ];
  res.render('saikyouken_edit', {id: number, data: detail} );
});

// Update
app.post("/saikyouken/update/:number", (req, res) => {
  const i = req.params.number;
  saikyou[i].name = req.body.name;
  saikyou[i].level = req.body.level;
  saikyou[i].Atk = req.body.Atk;
  saikyou[i].Mat = req.body.Mat;
  saikyou[i].Pow = req.body.Pow;
  saikyou[i].Int = req.body.Int;
  saikyou[i].Spd = req.body.Spd;
  saikyou[i].Vit = req.body.Vit;
  saikyou[i].Luk = req.body.Luk;
  saikyou[i].setumei = req.body.setumei;
  saikyou[i].sozai = req.body.sozai;
  res.redirect('/saikyouken');
});
app.post("/saikyouken/add", (req, res) => {
  let name = req.body.name;
  let level = req.body.level;
  let Atk = req.body.Atk;
  let Mat = req.body.Mat;
  let Pow = req.body.Pow;
  let Int = req.body.Int;
  let Spd = req.body.Spd;
  let Vit = req.body.Vit;
  let Luk = req.body.Luk;
  let sozai = req.body.sozai;
  let setumei = req.body.setumei;
  let id = saikyouken.length + 1;
  let newdata = { 
    id: id, 
    name: name, 
    level: level, 
    Atk: Atk, 
    Mat: Mat, 
    Pow: Pow, 
    Int: Int, 
    Spd: Spd, 
    Vit: Vit, 
    Luk: Luk, 
    sozai: sozai,
    setumei: setumei
  };
  saikyouken.push( newdata );
  res.render('saikyouken', { data: saikyouken });
});

app.get("/saikyouken/delete/:number", (req, res) => {
  const number = req.params.number;
  const detail = saikyouken[number]; 
  res.render('saikyouken_delete', { id: number, data: detail });
});

app.post("/saikyouken/delete-confirm/:number", (req, res) => {
  const number = req.params.number;
  saikyouken.splice(number, 1);
  console.log("削除を実行しました");
  res.redirect('/saikyouken');
});

// 羽根
app.get("/hane", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('hane', {data: tyoko} );
});

// Create
app.get("/hane/create", (req, res) => {
  res.redirect('/public/hane_new.html');
});

// Read
app.get("/hane/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = tyoko[ number ];
  res.render('hane_detail', {id: number, data: detail} );
});

//edit
app.get("/hane/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = tyoko[ number ];
  res.render('hane_edit', {id: number, data: detail} );
});

// Update
app.post("/hane/update/:number", (req, res) => {
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  tyoko[req.params.number].image1 = req.body.image1;
  tyoko[req.params.number].image2 = req.body.image2;
  tyoko[req.params.number].name = req.body.name;
  tyoko[req.params.number].skill_name = req.body.skill_name;
  tyoko[req.params.number].skill = req.body.skill;
  tyoko[req.params.number].time_min = req.body.time_min;
  tyoko[req.params.number].time_max = req.body.time_max;
  tyoko[req.params.number].sp = req.body.sp;
  tyoko[req.params.number].recast = req.body.recast;
  console.log( tyoko );
  res.redirect('/hane' );
});

app.post("/hane/add", (req, res) => {
  let name = req.body.name;
  let skill_name = req.body.skill_name;
  let skill = req.body.skill;
  let time_min = req.body.time_min;
  let time_max = req.body.time_max;
  let sp = req.body.sp;
  let recast = req.body.recast;
  let id = tyoko.length + 1;
  let newdata = { 
    id: id, 
    name: name,
    skill_name: skill_name,
    skill: skill,
    time_min: time_min,
    time_max: time_max,
    sp: sp,
    recast: recast
  };
  tyoko.push( newdata );
  res.render('hane', { data: tyoko });
});

app.get("/hane/delete/:number", (req, res) => {
  const number = req.params.number;
  const detail = tyoko[number]; 
  res.render('hane_delete', { id: number, data: detail });
});

app.post("/hane/delete-confirm/:number", (req, res) => {
  const number = req.params.number;
  tyoko.splice(number, 1);
  console.log("削除を実行しました");
  res.redirect('/hane');
});



app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let judgement = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  
  // ここに勝敗の判定を入れる
  // 以下の数行は人間の勝ちの場合の処理なので，
  // 判定に沿ってあいこと負けの処理を追加する
  if(hand ==  'グー')
    if(cpu == 'グー')
      judgement = 'あいこ';
    ;
    if(cpu == 'チョキ')
      judgement = '勝ち';
    ;
    if(cpu == 'パー')
      judgement = '負け';
    ;
  ;
  if(hand ==  'チョキ')
    if(cpu == 'チョキ')
      judgement = 'あいこ';
    ;
    if(cpu == 'グー')
      judgement = '負け';
    ;
    if(cpu == 'パー')
      judgement = '勝ち';
    ;
  ;
  if(hand ==  'パー')
    if(cpu == 'パー')
      judgement = 'あいこ';
    ;
    if(cpu == 'グー')
      judgement = '勝ち';
    ;
    if(cpu == 'チョキ')
      judgement = '負け';
    ;
  ;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});
app.use((req, res) => {
  res.status(404).sendFile(__dirname + '/public/error.html'); 
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
