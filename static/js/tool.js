
/**
 *获取当前时间
 *format=1精确到天
 *format=2精确到分
 */
function getCurrentDate(format) {
	var now = new Date();
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth(); //得到月份
	var date = now.getDate(); //得到日期
	var day = now.getDay(); //得到周几
	var hour = now.getHours(); //得到小时
	var minu = now.getMinutes(); //得到分钟
	var sec = now.getSeconds(); //得到秒
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	if (hour < 10) hour = "0" + hour;
	if (minu < 10) minu = "0" + minu;
	if (sec < 10) sec = "0" + sec;
	var time = "";
	//精确到天
	if (format == 1) {
		time = year + "-" + month + "-" + date;
	}
	//精确到分
	else if (format == 2) {
		time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;
	}
	// 精确到年
	else if(format == 0) {
		time = year;
	}
	return time;
}




// 无梁换柱
function checkValue(obj, key) {
    if(obj[key] && obj[key] !== '') {
        return obj[key]
    } 
    return '0'
}

// 图片地址 way 图片路径
function realmImg(way) {
	let api = 'https://img.hangzhouhuiyao.cn';
	let url = `${api}/images/hycar/${way}`
	return url
}


// 图片地址 way 图片路径
function realmImgTwo(way) {
	let api = 'https://img-dev.hangzhouhuiyao.cn';
	let url = `${api}/images/hyApplets_002/${way}`
	return url
}


// 数组去重
function distinct(arr,key){
    var newobj = {},newArr = [];
    for(var i=0;i<arr.length;i++){
        var item = arr[i];
    	if(!newobj[item[key]]){
            newobj[item[key]] = newArr.push(item);
    	}
    }
    return newArr;
}


/**
* 数字转整数 如 100000 转为10万
* @param {需要转化的数} num
* @param {需要保留的小数位数} point
*/
function tranNumber(num, point) {
	let numStr = num.toString()
	// 十万以内直接返回
	if (numStr.length < 6) {
		return numStr;
	} else if (numStr.length > 8) {
		//大于8位数是亿
		let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
		return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
	} else if (numStr.length > 5) {
		//大于6位数是十万 (以10W分割 10W以下全部显示)
		let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
		return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
	}
}


function getArrDifference(arr1, arr2) {
	return arr1.concat(arr2).filter(function(v, i, arr) {
		return arr.indexOf(v) === arr.lastIndexOf(v);
	});
}


// 字符串固定位置增加字符串
function insertStr(soure, start, newStr){   

   return soure.slice(0, start) + newStr + soure.slice(start);
}


// 防止处理多次点击
function noMultipleClicks(methods, info) {
	// methods是需要点击后需要执行的函数， info是点击需要传的参数
    let that = this;
    if (that.noClick) {
		// 第一次点击
        that.noClick= false;
		if(info && info !== '') {
			// info是执行函数需要传的参数
			methods(info);
		} else {
			methods();
		}
        setTimeout(()=> {
            that.noClick= true;
        }, 2000)
    } else {
		// 这里是重复点击的判断
	}
}

// 对象属性值转化成一串字符串
function getObjectValues(object){
	var str = '';
	var values = [];
	for (var property in object)
		values.push(object[property]
	);
	str = values.join(' ')
	return str;
}

export {
	getCurrentDate,
	checkValue,
	realmImg,
	realmImgTwo,
	distinct,
	tranNumber,
	getArrDifference,
	insertStr,
	noMultipleClicks,
	getObjectValues
}
