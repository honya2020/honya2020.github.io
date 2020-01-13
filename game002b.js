let can = document.getElementById("can"); //HTML内のキャンバス要素を取得して扱えるようにする
let con = can.getContext("2d"); //キャンバス内のコンテキスト(画像処理情報)を取得して扱えるようにする

let vcan = document.createElement("canvas"); //画面拡大のため仮想のキャンバスを作成 (裏画面というイメージ)
let vcon = vcan.getContext("2d");

const SCREEN_SIZE_W = 256; //画面の横サイズとして定数を定義
const SCREEN_SIZE_H = 224; //画面の縦サイズとして定数を定義
                           //256x224はファミコンの画面サイズ
const GAME_FPS = 1000/60; //フレームレートを定数として定義

const MAP_SIZE_W = SCREEN_SIZE_W / 32; //一画面あたりのブロック数を定義
const MAP_SIZE_H = SCREEN_SIZE_H / 32;

const FIELD_SIZE_W = 24; //マップ全体のブロック数を指定
const FIELD_SIZE_H = 7;

vcan.width = SCREEN_SIZE_W; //裏キャンバスの横サイズを指定
vcan.height = SCREEN_SIZE_H; //裏キャンバスの縦サイズを指定

can.width = SCREEN_SIZE_W * 2; //実際のキャンバス領域は拡大する
can.height = SCREEN_SIZE_H * 2;

vcon.imageSmoothingEnabled = false;
vcon.msimageSmoothingEnabled = false;
vcon.mozimageSmoothingEnabled = false;
vcon.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;
con.msimageSmoothingEnabled = false;
con.mozimageSmoothingEnabled = false;
con.webkitimageSmoothingEnabled = false;
//描画を拡大すると自動でなめらかにされるがドット絵だとぼやけてしまうので
//このイメージスムージング機能をOFFにした方がドット絵らしさが出る

let frameCount = 0; //フレームカウントを定義
let startTime; //フレームレート維持用に定義

let honya_x = 100*10; //キャラの座標を定義
let honya_y = 160*10; //加速度が少数にならないように10倍した
let honya_vx = 0; //加速度を持たせるための値を定義
let honya_vy = 0; //重力を持たせるための値を定義
let honya_jump = 0; //ジャンプフラグを定義

let key={}; //キーボードの連想配列を定義

let img = new Image(); //オブジェクトを新しく定義
img.src = "file002/honyaL.png"; //指定した画像ファイルを読み込み始める

//歩行時の全パターンのキャラ画像を読み込み
let imgL = new Image();
imgL.src = "file002/honyaL.png";
let imgL2 = new Image();
imgL2.src = "file002/honyaL2.png";
let imgL3 = new Image();
imgL3.src = "file002/honyaL3.png";
let imgL4 = new Image();
imgL4.src = "file002/honyaL4.png";
let imgR = new Image();
imgR.src = "file002/honyaR.png";
let imgR2 = new Image();
imgR2.src = "file002/honyaR2.png";
let imgR3 = new Image();
imgR3.src = "file002/honyaR3.png";
let imgR4 = new Image();
imgR4.src = "file002/honyaR4.png";

let imgM1 = new Image();
imgM1.src = "file002/mapOrange.png";

let fieldData = [ //24x7マス分の一次元配列を定義
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,
  0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
];



//更新処理の関数を定義
function update(){
  //ダッシュ
  if(key.Left) {if(honya_vx > -20) honya_vx -= 1; //キーが押された時にキャラのX座標をマイナス 下限2
    img = imgL;} //キャラを左向きに画像変更
  else if(key.Right) {if(honya_vx < 20) honya_vx += 1; //キーが押された時にキャラのX座標をプラス 上限2
    img = imgR;} //キャラを右向きに画像変更
  else if(!honya_jump){ //条件式の変数が数値の場合は0がfalseで!not演算子を当てると0になる
                        //つまり歩行時のみ減速してジャンプ中は減速しないようにする
  if(honya_vx < 0) {honya_vx += 1;} //加速度が少数にならないようにここまで全て10倍した
  else if(honya_vx > 0) {honya_vx -= 1;} //キーが離された時にキャラを減速させる
  }

  honya_x += honya_vx; //座標の増減に加速度を持たせる

  //ジャンプ
  if(key.X){
    if(honya_jump == 0){
      honya_jump = 1; //ジャンプフラグを1にする
      honya_vy = -32; //座標を上方向にずらす
    }
  }

  //重力
  if(honya_vy < 32) honya_vy++; //Y座標を下方向にずらす 下限32
  if(honya_y > 160*10){ //着地するY座標を指定する
    honya_jump = 0; //ジャンプフラグを0に戻す
    honya_vy = 0; //Y座標を戻す
    honya_y = 160*10; //行き過ぎた場合の位置指定
  }

  honya_y += honya_vy; //座標の増減に重力を持たせる
}



//描画処理の関数を定義
function draw(){
  vcon.fillStyle = "#66AAFF"; //fillプロパティで水色を指定
  vcon.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H); //fillメソッドで四角を表示
  //vcon.drawImage(img, 0,0,16,16, 32,32,64,64); //画像の範囲を指定してキャンバス内に表示
    //drawImage(画像ファイル, 取り出す基点X,Y, 取り出す範囲X,Y, 表示する基点X,Y, 表示する範囲X,Y)

  vcon.font = "20px sans-serif"; //フォントのサイズと種類を指定
  vcon.fillStyle = "#FFFFFF"; //fillプロパティで白色を指定
  vcon.fillText("frame:"+frameCount, 10, 25) //fillメソッドでテキストを表示

  for(let y=0; y<FIELD_SIZE_H; y++){ //マップ配列の各要素を取得
    for(let x=0; x<FIELD_SIZE_W; x++){
      if(fieldData[y*FIELD_SIZE_W + x] == 1){ //配列の要素が1の場合
        let px = x * 32; //配列の場所にブロックサイズをかけて実際の座標に当てはめる
        let py = y * 32;
        vcon.drawImage(imgM1, px, py); //オレンジ画像を座標に描画
      }
    }
  }

  vcon.drawImage(img, 0,0,32,32, honya_x/10,honya_y/10,32,32); //動かすキャラを描画
                                 //小数を回避するため10倍したので描画時点で10で割って桁を戻す

  con.drawImage(vcan, 0,0,SCREEN_SIZE_W,SCREEN_SIZE_H, 0,0,SCREEN_SIZE_W*2,SCREEN_SIZE_H*2);
  //描画内容を実画面へ拡大転送
}



//setInterval(mainLoop, 1000/60);
  //1s/60fps = 0.0167s/f = 1秒で60回の間隔でメインループを読み込む
  //デメリット：画面の描画速度に関係なく読み込まれる 1000/60が割り切れないので正確ではない
  //requestAnimationFrameに代替

//ループ開始
window.onload = function(){ //HTMLの画面が読み込まれてから実行する関数を定義
  startTime = performance.now(); //経過時間をミリ秒で取得
  mainLoop(); //メインループを実行
}

//メインループの関数を定義
function mainLoop(){
  let nowTime = performance.now(); //経過時間をミリ秒で取得
  let nowFrame = (nowTime - startTime) / GAME_FPS; //0.0167秒経過で1フレームになる

  if(nowFrame > frameCount){ //経過したフレーム数がフレームカウントより大きい場合に実行
                             //つまり60fpsより早くは実行されない
    frameCount++; //フレームカウントを+1
    update(); //更新処理を実行
    draw(); //描画処理を実行
  }
  requestAnimationFrame(mainLoop); //約60fpsで次の再描画を実行
    //デメリット：ディスプレイのリフレッシュレートに影響を受ける ブラウザがバックグラウンドになると影響を受ける
}

//キーボードが押された時の処理
document.onkeydown = function(e){
  if(e.keyCode == 37)key.Left = true; //キーコードの37は左キー
  if(e.keyCode == 39)key.Right = true; //キーコードの39は右キー
  if(e.keyCode == 88)key.X = true; //キーコードの88はXキー
  if(e.keyCode == 90)key.Z = true; //キーコードの90はZキー
}

//キーボードが離された時の処理
document.onkeyup = function(e){
  if(e.keyCode == 37)key.Left = false;
  if(e.keyCode == 39)key.Right = false;
  if(e.keyCode == 88)key.X = false;
  if(e.keyCode == 90)key.Z = false;
}
