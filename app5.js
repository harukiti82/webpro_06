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
  { id:1, code:37, name:"ロコン",  bunrui:"きつねポケモン", type:"炎", takasa:0.6, omosa:9.9, setumei:"自分より強い相手に襲われると傷ついたふりをして惑わせその隙に逃げてしまう。" },
  { id:2, code:56, name:"マンキー",  bunrui:"ぶたざるポケモン", type:"格闘", takasa:0.5, omosa:28.0, setumei:"木の上で群れを作って暮らす。群れからはぐれたマンキーは寂しくてすぐに怒り出す。" },
  { id:3, code:79, name:"ヤドン",  bunrui:"まぬけポケモン", type:"エスパー，水", takasa:1.2, omosa:36.0, setumei:"動きが鈍く間抜け。叩かれても5秒経ってから痛さを感じるほどだ。" },
  { id:4, code:83, name:"カモネギ",  bunrui:"かもがるポケモン", type:"ノーマル，飛行", takasa:0.8, omosa:15.0, setumei:"クキがなくなると生きていけない。だからクキを狙う相手とは命懸けで戦うのだ。" },
  { id:5, code:100, name:"ビリリダマ",  bunrui:"ボールポケモン", type:"電気", takasa:0.5, omosa:10.4, setumei:"転がって移動するので地面がデコボコだとショックで爆発してしまう。" },
  { id:6, code:101, name:"マルマイン",  bunrui:"ボールポケモン", type:"ノーマル，飛行", takasa:1.2, omosa:66.6, setumei:"電気エネルギーを溜め込むほど高速で動けるようになるがその分爆発しやすい。" },
  { id:7, code:111, name:"サイホーン",  bunrui:"とげとげポケモン", type:"地面，岩", takasa:1.0, omosa:115.0, setumei:"半径10キロメートルの範囲を縄張りにしているが忘れてしまうらしい。" },
  { id:8, code:129, name:"コイキング",  bunrui:"さかなポケモン", type:"水", takasa:0.9, omosa:10.0, setumei:"力のない情けないポケモン。たまに高く飛び跳ねても2メートルを越すのがやっとだ。" },
  { id:9, code:132, name:"メタモン",  bunrui:"へんしんポケモン", type:"ノーマル", takasa:0.3, omosa:4.0, setumei:"変身は完璧なのだが笑わされて力が抜けると変身は解けてしまう" },
  { id:10, code:129, name:"コイキング",  bunrui:"さかなポケモン", type:"水", takasa:0.9, omosa:10.0, setumei:"力のない情けないポケモン。たまに高く飛び跳ねても2メートルを越すのがやっとだ。" },
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
  res.redirect('/public/pokemonzukan_new.html');
});

// Read
app.get("/pokemonzukan/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = pokemon[ number ];
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
  pokemon[req.params.number].type = req.body.type;
  pokemon[req.params.number].takasa = req.body.takasa;
  pokemon[req.params.number].omosa = req.body.omosa;
  pokemon[req.params.number].setumei = req.body.setumei;
  console.log( pokemon );
  res.redirect('/pokemonzukan' );
});

app.post("/pokemonzukan/add", (req, res) => {
  let code = req.body.code;
  let name = req.body.name;
  let bunrui = req.body.bunrui;
  let type = req.body.type;
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

app.listen(8080, () => console.log("Example app listening on port 8080!"));
