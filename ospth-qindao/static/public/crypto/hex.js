function Hex(){

}


Hex.encode = function(b,pos,len) {
    var hexCh = new Array(len*2);
    var hexCode = new Array('0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F');

    for(var i = pos,j = 0;i<len+pos;i++,j++) {
        hexCh[j] = hexCode[(b[i]&0xFF)>>4];
        hexCh[++j] = hexCode[(b[i]&0x0F)];
    }

    return hexCh.join('');
}

Hex.decode = function(hex) {

    if(hex == null || hex == '') {
        return null;
    }
    if(hex.length%2 != 0) {
        return null;
    }

    var ascLen = hex.length/2;
    var hexCh = this.toCharCodeArray(hex);
    var asc = new Array(ascLen);

    for(var i = 0;i<ascLen;i++) {

        if(hexCh[2*i]>=0x30 && hexCh[2*i]<=0x39) {
            asc[i] = ((hexCh[2*i]-0x30)<<4);
        }else if(hexCh[2*i]>=0x41 && hexCh[2*i]<=0x46) {//A-F : 0x41-0x46
            asc[i] = ((hexCh[2*i]-0x41+10)<<4);
        }else if(hexCh[2*i]>=0x61 && hexCh[2*i]<=0x66) {//a-f  : 0x61-0x66
            asc[i] = ((hexCh[2*i]-0x61+10)<<4);
        }else {
            return null;
        }

        if(hexCh[2*i+1]>=0x30 && hexCh[2*i+1]<=0x39) {
            asc[i] = (asc[i] | (hexCh[2*i+1]-0x30));
        }else if(hexCh[2*i+1]>=0x41 && hexCh[2*i+1]<=0x46) {
            asc[i] = (asc[i] | (hexCh[2*i+1]-0x41+10));
        }else if(hexCh[2*i+1]>=0x61 && hexCh[2*i+1]<=0x66) {
            asc[i] = (asc[i] | (hexCh[2*i+1]-0x61+10));
        }else {
            return null;
        }


    }

    return asc;
}

Hex.utf8StrToHex = function(utf8Str){
	var ens = encodeURIComponent(utf8Str);
	var es = unescape(ens);


	var esLen = es.length;

    // Convert
    var words = [];
    for (var i = 0; i < esLen; i++) {
        words[i] = (es.charCodeAt(i).toString(16));
    }
    return words.join('');
}

Hex.utf8StrToBytes = function(utf8Str){
	var ens = encodeURIComponent(utf8Str);
	var es = unescape(ens);


	var esLen = es.length;

    // Convert
    var words = [];
    for (var i = 0; i < esLen; i++) {
        words[i] = es.charCodeAt(i);
    }
    return words;
}

Hex.hexToUtf8Str = function(utf8Str){

	var utf8Byte = Hex.decode(utf8Str);
    var latin1Chars = [];
    for (var i = 0; i < utf8Byte.length; i++) {
        latin1Chars.push(String.fromCharCode(utf8Byte[i]));
    }
    return decodeURIComponent(escape(latin1Chars.join('')));
}

Hex.bytesToUtf8Str = function(bytesArray){

	var utf8Byte = bytesArray;
    var latin1Chars = [];
    for (var i = 0; i < utf8Byte.length; i++) {
        latin1Chars.push(String.fromCharCode(utf8Byte[i]));
    }
    return decodeURIComponent(escape(latin1Chars.join('')));
}

Hex.toCharCodeArray = function(chs){
    var chArr = new Array(chs.length);
    for(var i = 0;i<chs.length;i++){
        chArr[i] = chs.charCodeAt(i);
    }
    return chArr;
}

var BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz'
var b64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
var b64pad = '='

Hex.hex2b64 = function(d) {
	var b
	var e
	var a = ''
	for (b = 0; b + 3 <= d.length; b += 3) {
		e = parseInt(d.substring(b, b + 3), 16)
		a += b64map.charAt(e >> 6) + b64map.charAt(e & 63)
	}
	if (b + 1 == d.length) {
		e = parseInt(d.substring(b, b + 1), 16)
		a += b64map.charAt(e << 2)
	} else {
		if (b + 2 == d.length) {
		  e = parseInt(d.substring(b, b + 2), 16)
		  a += b64map.charAt(e >> 2) + b64map.charAt((e & 3) << 4)
		}
	}
	if (b64pad) {
		while ((a.length & 3) > 0) {
		  a += b64pad
		}
	}
	return a
}

Hex.hextob64 = function(a) {
	return Hex.hex2b64(a)
}

Hex.int2char = function (a) {
	return BI_RM.charAt(a)
}

Hex.b64tohex= function(f) {
	var d = ''
	  var e
	  var b = 0
	  var c
	  var a
	  for (e = 0; e < f.length; ++e) {
	    if (f.charAt(e) == b64pad) {
	      break
	    }
	    a = b64map.indexOf(f.charAt(e))
	    if (a < 0) {
	      continue
	    }
	    if (b == 0) {
	      d += Hex.int2char(a >> 2)
	      c = a & 3
	      b = 1
	    } else {
	      if (b == 1) {
	        d += Hex.int2char((c << 2) | (a >> 4))
	        c = a & 15
	        b = 2
	      } else {
	        if (b == 2) {
	          d += Hex.int2char(c)
	          d += Hex.int2char(a >> 2)
	          c = a & 3
	          b = 3
	        } else {
	          d += Hex.int2char((c << 2) | (a >> 4))
	          d += Hex.int2char(a & 15)
	          b = 0
	        }
	      }
	    }
	  }
	  if (b == 1) {
	    d += Hex.int2char(c << 2)
	  }
	  return d
}

Hex.b64toBA = function(e) {
	var d = Hex.b64tohex(e)
	var c
	var b = new Array()
	for (c = 0; 2 * c < d.length; ++c) {
	    b[c] = parseInt(d.substring(2 * c, 2 * c + 2), 16)
	}
	return b
}

Hex.BAtohex = function(b) {
	var e = ''
	for (var d = 0; d < b.length; d++) {
		var c = b[d].toString(16)
		if (c.length == 1) {
			c = '0' + c
		}
		e = e + c
	}
	return e
}

Hex.BAtob64=function(ba) {
  return Hex.hextob64(Hex.BAtohex(ba))
}

export default Hex
