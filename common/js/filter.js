export default {
	/**
	 * 手机号验证
	 */
	isMobile(mobile) {
		const mobile_regex = /^((1[0-9]))\d{9}$/;
		return mobile_regex.test(mobile);
	},
	/**
	 * 金额万元格式
	 */
	amountFormat(num) {
		let priceA = this.delcommafy(num);
		let price = '';
		if (Number(priceA) > 100) {
			priceA = (Number(priceA) / 10000).toFixed(2);
			price = priceA + '万';
		} else {
			priceA = Number(priceA).toFixed(2);
			price = priceA;
		}
		return price;
	},
	/**
	 * 拍卖阶段显示
	 */
	stageShow (stageList,stage) {
		for (let i = 0; i < stageList.length; i++) {
			if (stageList[i].id == stage) {
				return stageList[i].text
			}
		}
	},
	/**
	 * 拍卖状态显示
	 */
	statusShow (allStatus,status) {
		return allStatus[status]
	},
	/**
	 * 当前定位-省-code
	 * @param {*} num 
	 */
	getCodeProvince(name,DISTINCTS) {
	  let showCode = '';
	  for (let x in DISTINCTS) {
	    for (let y in DISTINCTS[x]) {
	      if (name == DISTINCTS[x][y]) {
	        showCode = y;
	      }
	    }
	  }
	  return showCode
	},
	/**
	 * 当前定位-市-code
	 * @param {*} num 
	 */
	getCode(name,DISTINCTS){
	  for (let x in DISTINCTS){
	    for (let y in DISTINCTS[x]){
	      if (name == DISTINCTS[x][y]){
	        return y;
	      }
	    }
	  }
	},
	/**
	 * 当前定位index
	 * @param {*} num 
	 */
	getCodeIndex(name,array) {
	  for (let x in array) {
	    if (name === array[x].name) {
	      return x;
	    }
	  }
	},
	/**
	 * 金额去除千位分隔符
	 * @param {*} num 
	 */
	delcommafy(num) {
	    if (num || num == 0) {
	      if ((num + "").trim() == "") {
	        return "--";
	      }
	      num = num.replace(/,/gi, '');
	      return num;
	    } else {
	      return "--";
	    }
	},
    /**
     * 数字表示
     * @param {*} num 
     */
    thousandBitSeparator(num) {
        if (!isNaN(num)) num = Number(num);
        return num && (
            num.toString().indexOf('.') != -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {
                return $1 + ",";
            }) : num.toString().replace(/(\d)(?=(\d{3})+\b)/g, function($0, $1) {
                return $1 + ",";
            }));
    },
    /**
     * 浮点数转化
     * @param {*} Dight 
     * @param {*} How 
     */
    forDight(Dight, How = 2){  
        Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);  
        return Dight;  
    },
    /**
     * 格式化时间
     * @param {*} date 
     * @param {*} fmt 
     */
    formatDate(date, fmt) {
        date = new Date(date * 1000);
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        };
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
            }
        }
        return fmt;
    },
    /**
     * 秒转时间
     * @param {*} value 
     */
    formatSeconds(value, fmt) {
        let theTime = parseInt(value);// 秒
        let m = 0;// 分
        let h = 0;// 小时
        const formatInt = (val) => {
           if (parseFloat(val) < 10) return `0${val}`;
           return val; 
        };
        if (theTime > 60) {
            m = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
                if (m >= 60) {
                    h = parseInt(m / 60);
                    m = parseInt(m % 60);
                }
        }
        let s = formatInt(parseInt(theTime));
        if (m > 0) {
            m =  parseInt(m);
        }
        m =  formatInt(m);
        if (h > 0) {
            h = parseInt(h);
        }
        h = formatInt(h);
        return fmt.replace(/(h+)/, h).replace(/(m+)/, m).replace(/(s+)/, s);
    },
    /**
     * 获取参数
     * @param {*} _search 
     */
    getQuery(_search) {
        let temp = {};

        if (_search) {
            let searchArry = _search.split('&'),
                searchIndex = 0,
                searchArryLen = searchArry.length,
                tempSearch = [];
            for (searchIndex; searchIndex < searchArryLen; searchIndex++) {
                tempSearch = searchArry[searchIndex].split("=");
                temp[tempSearch[0]] = tempSearch[1];
            }
        }
        return temp;
    },
	/**
	 * 获取省、市、区数组
	 * @param {*} _key,_distincts
	 */
	getDistincts(_key,_distincts) {
	    const _array = _distincts[_key];
	    let array = [];
	    for(let i in _array){
	    	array.push({
	    		name: _array[i],
	    		key: i
	    	})
	    }
	    return array;
	}
};