
//Math.floorの簡略表記
function Int(n) {
	return Math.floor(n);
}

//引数を左から順に乗算した結果返す。乗算の度に端数切捨て。配列時は加算
function Mul(){
	var ret = 1;
	var args = $(arguments);
	for(var i = 0; i < args.length; i++) {
		var arg = args[i];
		if(Array.isArray(arg)){
			ret += arg[0];
		} else {
			ret *= arg;
			ret = Math.floor(ret + 0.000005); // x.999999997とかを切り上げる
		}
	}
	return ret;
}

//指定した小数点の桁で四捨五入した値を返却
//ketaが2なら小数点第3で四捨五入して、小数点以下が2桁の状態の値が返却される。
function Rnd(n, keta)
{
	keta = keta || 0;
	return Math.round(n*Math.pow(10, keta)) / Math.pow(10, keta);
}

//Rndの画面表示用。5→5.00
function RndF(n, keta) {
	var r = Rnd(n, keta) + "";

	keta = keta || 0;
	if(keta <= 0){ return r; }
	var pos = r.indexOf(".");
	if(pos < 0) {
		return r + "." + (new Array(keta+1)).join('0');
	} else {
		//RndF(3.51, 3)  //3.510
		var make0Num = (keta - (r.length - pos - 1));
		return r + (new Array(make0Num+1)).join('0');
	}
}

//%を比率に変換。n=40なら1.4。-20なら0.8
function Ptr(n){
	return (n+100)/100;
}

function Max(a, b){
	return Math.max(a, b);
}


function Num(a) {
	return Number(a) || 0;
}
function NumH(a) {
	return Num(toHalfWidth(a));
}
//全角数字→半角数字
function toHalfWidth(str) {
  return str.replace(/[０-９]/g, function( tmpStr ) {
      // 文字コードをシフト
      return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
    });
}

function isNullOrUndef(v) {
	return v == undefined || v == null;
}

//試験用
function RR(n)
{
  return Math.floor(Math.random() * n);
}











/**
 * 半全角カナ変換モジュール
 * @return {[type]} [description]
 */
var kanaConverter = (function() {

  // マップ作成用関数
  var createKanaMap = function(properties, values) {
    var kanaMap = {};
    // 念のため文字数が同じかどうかをチェックする(ちゃんとマッピングできるか)
    if(properties.length === values.length) {
      for(var i=0, len=properties.length; i<len; i++) {
        var property= properties.charCodeAt(i),
            value = values.charCodeAt(i);
        kanaMap[property] = value;
      }
    }
    return kanaMap;
  };

  // 全角から半角への変換用マップ
  var m = createKanaMap(
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ',
    'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ'
    );
  // 半角から全角への変換用マップ
  var mm = createKanaMap(
    'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ',
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ'
    );

  // 全角から半角への変換用マップ
  var g = createKanaMap(
    'ガギグゲゴザジズゼゾダヂヅデドバビブベボ',
    'ｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾊﾋﾌﾍﾎ'
    );
  // 半角から全角への変換用マップ
  var gg = createKanaMap(
    'ｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾊﾋﾌﾍﾎ',
    'ガギグゲゴザジズゼゾダヂヅデドバビブベボ'
    );
  
  // 全角から半角への変換用マップ
  var p = createKanaMap(
    'パピプペポ',
    'ﾊﾋﾌﾍﾎ'
    );
  // 半角から全角への変換用マップ
  var pp = createKanaMap(
    'ﾊﾋﾌﾍﾎ',
    'パピプペポ'
    );

  var gMark = 'ﾞ'.charCodeAt(0),
      pMark = 'ﾟ'.charCodeAt(0);

   return {
    /**
     * 全角から半角への変換用関数
     * @param  {[type]} str 変換対象文字列
     * @return {[type]}     変換後文字列
     */
    convertKanaToOneByte : function(str) {
      for(var i=0, len=str.length; i<len; i++) {
        // 濁音もしくは半濁音文字
        if(g.hasOwnProperty(str.charCodeAt(i)) || p.hasOwnProperty(str.charCodeAt(i))) {
          // 濁音
          if(g[str.charCodeAt(i)]) {
            str = str.replace(str[i], String.fromCharCode(g[str.charCodeAt(i)])+String.fromCharCode(gMark));
          }
          // 半濁音
          else if(p[str.charCodeAt(i)]) {
            str = str.replace(str[i], String.fromCharCode(p[str.charCodeAt(i)])+String.fromCharCode(pMark));
          }
          else {
            break;
          }
          // 文字列数が増加するため調整
          i++;
          len = str.length;
        }
        else {
          if(m[str.charCodeAt(i)]) {
            str = str.replace(str[i], String.fromCharCode(m[str.charCodeAt(i)]));
          }
        }
      }
      return str;
    },
    /**
     * 半角から全角への変換用関数
     * @param  {[type]} str 変換対象文字列
     * @return {[type]}     変換後文字列
     */
    convertKanaToTwoByte : function(str) {
    	for(var i=0, len=str.length; i<len; i++) {
        // console.log(str[i]);
        // 濁音もしくは半濁音文字
        if(str.charCodeAt(i) === gMark || str.charCodeAt(i) === pMark) {
          // 濁音
          if(str.charCodeAt(i) === gMark && gg[str.charCodeAt(i-1)]) {
            str = str.replace(str[i-1], String.fromCharCode(gg[str.charCodeAt(i-1)]))
                     .replace(str[i], '');
          }
          // 半濁音
          else if(str.charCodeAt(i) === pMark && pp[str.charCodeAt(i-1)]) {
            str = str.replace(str[i-1], String.fromCharCode(pp[str.charCodeAt(i-1)]))
                     .replace(str[i], '');
          }
          else {
            break;
          }
          // 文字列数が減少するため調整
          i--;
          len = str.length;
        }
        else {
          // １つ先の文字を見て濁音もしくは半濁音でないことを確認
          if(mm[str.charCodeAt(i)] && str.charCodeAt(i+1) !== gMark && str.charCodeAt(i+1) !== pMark) {
            str = str.replace(str[i], String.fromCharCode(mm[str.charCodeAt(i)]));
          }
        }
      }
    	return str;
    }
  };
})();

