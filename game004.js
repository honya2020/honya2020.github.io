//定数定義
const	FONT = "48px monospace";	//使用フォント

//変数定義
let gFrame = 0; //内部カウンタ
let gImgMap; //マップ画像

//ブラウザ起動イベント
window.onload = function()
{
	gImgMap = new Image();
  gImgMap.src = "file004/map.png"; //マップ画像読み込み
	setInterval( function() { WmTimer() }, 33 ); //33ms間隔でWmTimer()を呼び出すよう指示
}

//タイマーイベント処理
function WmTimer()
{
	gFrame++; //内部カウンタを加算
	const	ca = document.getElementById("main"); //mainキャンバス要素を取得
	const	g = ca.getContext("2d"); //2D描画コンテキストを取得
	for( let y = 0; y < 16; y++ ){
		for( let x = 0; x < 16; x++ ){ //変数yとxをそれぞれ0〜15まで16回ずつ繰り返す
			g.drawImage( gImgMap, x * 32 , y * 32 ); //指定座標に画像を描画
		}         //画像が32*32pxなのでxとyを32倍すると等間隔で並列描画される
	}
	g.font = FONT; //文字フォントを設定
	g.fillText( "Hello World" + gFrame, gFrame, 64 ); //指定座標にテキスト表示
}             //X座標にフレームカウントを当てているのでフレーム経過で右へずれていく
