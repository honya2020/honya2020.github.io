let can = document.getElementById("can"); //HTML内のキャンバス要素を取得して扱えるようにする
let con = can.getContext("2d"); //キャンバス要素内の画像処理情報を取得して扱えるようにする

const GAME_FPS = 1000/60; //フレームレートを定数として定義
const SCREEN_SIZE_W = 256; //画面の横サイズとして定数を定義
const SCREEN_SIZE_H = 224; //画面の縦サイズとして定数を定義
                           //256x224はファミコンの画面サイズ

can.width = SCREEN_SIZE_W; //キャンバスの横サイズを指定
can.height = SCREEN_SIZE_H; //キャンバスの縦サイズを指定

let frameCount = 0; //フレームカウントを定義
let startTime; //フレームレート維持用に定義

let img = new Image(); //オブジェクトを新しく定義
img.src = "file002/honyaL.png"; //指定した画像ファイルを読み込み始める
//img.onload = draw; //画像を読み込んでから次に定義する関数を読み込む
                     //Loop作成時に削除

//更新処理の関数を定義
function update(){
} //今は何もなし

//描画処理の関数を定義
function draw(){
  con.fillStyle = "#66AAFF"; //fillプロパティで水色を指定
  con.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H); //fillメソッドで四角を表示
  con.drawImage(img, 0,0,16,16, 32,32,64,64); //画像の範囲を指定してキャンバス内に表示
    //drawImage(画像ファイル, 取り出す基点X,Y, 取り出す範囲X,Y, 表示する基点X,Y, 表示する範囲X,Y)
  con.drawImage(img, 0,0,32,32, 128,128,32,32); //もうひとつ
  con.font = "20px sans-serif"; //フォントのサイズと種類を指定
  con.fillStyle = "#FFFFFF"; //fillプロパティで白色を指定
  con.fillText("frame:"+frameCount, 10,25) //fillメソッドでテキストを表示
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
