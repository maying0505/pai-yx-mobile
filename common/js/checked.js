export default {
	/**
     * 检测电话号码
     */
    checkMobileNo(mobile) {
        return /0?[^012][0-9]{9}$/.test(mobile);
    },
    /**
     * 检测短信验证码
     */
    checkSmsCode(code) {
        return /^[0-9]{4}$/.test(code);
    },
    /**
     * 检测登录密码
     */
    checkPassword(pass) {
        return /^[A-Za-z0-9]{6,12}$/.test(pass);
    },
    /**
     * 检测金额
     */
    checkMoney(money) {
        return /^[0-9]\d{0,6}(.\d{1,2})?$/.test(money);
    },
    /**
     * 检测身份证号
     */
    checkIdCard(idcard) {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idcard);
    },
    /**
     * 检测昵称
     */
    checkNickName(nickname) {
        return /^[A-Za-z0-9\u4E00-\u9FFF]{2,20}$/.test(nickname);
    }
};