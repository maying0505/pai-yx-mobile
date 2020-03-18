import http from './http';
import httpConfig from '../config/config.http';
import Config from '../config/config.default';
import checked from './checked';
import filter from './filter';
import store from './store/index';

export default {
    install(vue, options) {
        /**
         * http请求
         */
        vue.prototype.$http = http.http;
        /**
         * 请求相关配置
         */
        vue.prototype.$HTTP_CONFIG = httpConfig;
        /**
         * 默认配置
         */
        vue.prototype.$CONFIG = Config;
        /**
         * 全局数据
         */
        vue.prototype.$store = store;
        /**
         * 是否认证
         */
        vue.prototype.$isAuth = () => {
            // 需要userId(登录验证)
            const userId = uni.getStorageSync('userId') || '';
            // 没有userId
            if (!userId) {
                uni.hideLoading();
                uni.navigateTo({
                    url: '/pages/login/code'
                });
                return false;
            }
            return userId;
        },
        /**
         * 验证
         */
        vue.prototype.$checked = checked;
        /**
         * 过滤器
         */
        vue.prototype.$filter = filter;
        /**
         * 平台列表公共过滤
         */
        vue.prototype.$borrowListFilter = results => {
            let temp = [];
            if (results) {
                for (let result of results) {
                    let tempMoneyArry = [result.moneyMin || 0, result.moneyMax || 0];
                    let _index = 0;
                    for (let tempMoney of tempMoneyArry) {
                        if (tempMoney >= 1e4 && (tempMoney % 1e4) % 1e3 === 0) {
                            tempMoney = `${filter.thousandBitSeparator(tempMoney / 1e4)}万`;
                        } else {
                            tempMoney = `${filter.thousandBitSeparator(tempMoney)}` || '0';
                        }
                        tempMoneyArry[_index] = tempMoney;
                        _index++;
                    }
                    temp.push(Object.assign(result, {
                        rate_format: filter.thousandBitSeparator(result.rate) || '0',
                        lendingNum_format: filter.thousandBitSeparator(result.lendingNum) || '0',
                        moneyMin_format: tempMoneyArry[0],
                        moneyMax_format: tempMoneyArry[1],
                    }));
                }
            }
            // console.info(temp);
            return temp;
        };
    }
};