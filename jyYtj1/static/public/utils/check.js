export default {
	//身份证号码验证
	getIdCardMsg: function(idCard) {
		var idCadMsg = {};
		var pass = true;
		var id = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
		if (!idCard || !id.test(idCard)) {
			pass = false;
		} else {
			//18位身份证需要验证最后一位校验位
			if (idCard.length == 18) {
				let card = idCard.split('');
				//∑(ai×Wi)(mod 11)
				//加权因子
				var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				//校验位
				var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
				var sum = 0;
				var ai = 0;
				var wi = 0;
				for (var i = 0; i < 17; i++) {
					ai = card[i];
					wi = factor[i];
					sum += ai * wi;
				}
				var last = parity[sum % 11];
				if (parity[sum % 11] != card[17]) {
					pass = false;
				}
			}
		}
		idCadMsg.pass = pass;
		if (!pass) {
			return idCadMsg;
		}
		//计算性别
		let gender;
		// 身份证为15位或者18位
		if (idCard.length == 15) {
			gender = idCard.substr(14, 1);
		} else {
			gender = idCard.substr(16, 1);
		}
		gender = gender % 2 == 0 ? '2' : '1';
		idCadMsg.gender = gender;
		//计算年龄
		var yearBirth = idCard.substring(6, 10);
		var monthBirth = idCard.substring(10, 12);
		var dayBirth = idCard.substring(12, 14);
		//获取当前年月日并计算年龄
		var myDate = new Date();
		var monthNow = myDate.getMonth() + 1;
		var dayNow = myDate.getDay();
		var age = myDate.getFullYear() - yearBirth;
		if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
			age--;
		}
		idCadMsg.age = age;

		//计算出生日期
		var birthday = "";
		if (idCard != null && idCard != "") {
			if (idCard.length == 15) {
				birthday = "19" + idCard.substr(6, 6);
			} else if (idCard.length == 18) {
				birthday = idCard.substr(6, 8);
			}
			birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
		}
		idCadMsg.birthday = birthday;
		return idCadMsg;
	},
	//年龄
	age: function(str){
		let r = str.substr(0, 10).match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
		if (r == null) {
			return ""
		}
		let d = new Date(r[1], r[3] - 1, r[4]);
		if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
			let Y = new Date().getFullYear();
			return (Y - r[1])
		}
		return "";
	},
	//姓名
	chinese: function(value) {
		let flag = /^[\u4e00-\u9fa5·]+$/.test(value)
		if (!flag) api.showToast("姓名只能输入汉字")
		return flag
	},
	//手机号码
	mobile: function(value) {
		let flag = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)
		if (!flag) uni.showToast("号码格式错误")
		return flag
	},
	//座机号码
	telphone: function(value) {
		let flag = /^(0\d{2,3})-?(\d{7,8})$/.test(value)
		if (!flag) api.showToast("座机只能输入区号-数字")
		return flag
	},
	//电子邮箱
	email: function(value) {
		let flag = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)
		if (!flag) api.showToast("您输入的不符合email格式要求")
		return flag
	},
	//邮政编码
	zipCode: function(value) {
		let flag = /^\d{6}$/g.test(value)
		if (!flag) api.showToast("您输入的邮政编码格式不正确")
		return flag
	},
	//统一社会信用代码
	unitCode: function(value) {
		let flag = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(value)
		if (!flag) api.showToast("您输入的统一社会信用代码格式不正确")
		return flag
	},
	//网址格式
	url: function(value) {
		let flag = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i.test(value)
		if (!flag) api.showToast("您输入的网址格式不正确")
		return flag
	},
	onlyNum:function(value){
		let flag = /^[0-9]+$/.test(value)
		if (!flag) api.showToast("只可输入数字")
		return flag
	},
	//只输入数字和英文
	getCharMsg: function(value) {
		let flag = /^[0-9a-zA-Z]+$/.test(value)
		if (!flag) api.showToast("只可输入数字或英文")
		return flag
	},
	//校验是否包含数字和字母
	getCharPass: function(value){
		let flag = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/g.test(value)
		// if (!flag) api.showToast("必须包含包含数字和字母")
		return flag
	},
    // 银行卡卡号校验
    luhnCheck: function(bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9
        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9) {
					arrJiShu.push(parseInt(newArr[j]) * 2);
				}else {
					arrJiShu2.push(parseInt(newArr[j]) * 2);
				}
            } else {
				//偶数位
				arrOuShu.push(newArr[j]);
			}
        }
        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }
        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }
        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }
        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
        //计算luhn值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhn = 10 - k;
        if (lastNum == luhn) {
            // $("#banknoInfo").html("luhn验证通过");
            return true;
        } else {
            // $("#banknoInfo").html("银行卡号必须符合luhn校验");
            return false;
        }
    }
}
