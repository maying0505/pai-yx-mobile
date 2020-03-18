<template>
	<view class="uc" :class="ifWEIXIN ? 'wx-uc' : ''">
		<view class="main">
			<view class="header_login" @click="goToLogin">
				<view class="avatar">
					<image v-if="userInfo && userInfo.headimgurl" :src="userInfo.headimgurl"></image>
					<image v-else src="../../static/image/no-login.png" class="no_login"></image>
				</view>
				<view class="nickname" v-if="userInfo">
					<view class="nickname-tip">您好，</view>
					<view>{{ userInfo.realname ? userInfo.realname : userInfo.nickname ? userInfo.nickname : userInfo.phone }}</view>
				</view>
				<view class="nickname" v-else>
					<view class="nickname-tip">您好，</view>
					<view>请点击登录</view>
				</view>
			</view>
			<uni-grid :column="3" :show-border="false" :square="false" @change="changeAssetStyle" class="asset-style">
				<uni-grid-item>
					<image class="image" src="../../static/image/ic_my_book@3x.png" mode="aspectFill" />
					<text class="text">我的预约</text>
				</uni-grid-item>
				<!-- <uni-grid-item>
					<image class="image" src="../../static/image/ic_preference@3x.png" mode="aspectFill" />
					<text class="text">我的订阅</text>
				</uni-grid-item> -->
				<uni-grid-item>
					<image class="image" src="../../static/image/ic_notice@3x.png" mode="aspectFill" />
					<text class="text">消息通知</text>
				</uni-grid-item>
				<uni-grid-item>
					<image class="image" src="../../static/image/ic_trace@3x.png" mode="aspectFill" />
					<text class="text">浏览历史</text>
				</uni-grid-item>
			</uni-grid>
			<view class="uc-panel">
				<view class="uc-panel-in">
					<!-- <navigator class="row" url="../member-subscription/index">
						<image class="row-icon" src="../../static/image/my-subscribe.png"></image>
						<view class="row-content">
							<view class="row-text">我的订阅</view>
						</view>
					</navigator> -->

					<view class="row row-last">
						<image class="row-icon" src="../../static/image/ic_call_phone@3x.png"></image>
						<view class="row-content" @click="call" data-phone="4000159899">
							<view class="row-text">联系客服</view>
							<view class="kefu-phone">400-015-9899</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mask" v-if="ifLogin"></view>
			<view class="if_login" v-if="ifLogin">
				<view>您还未登录</view>
				<view class="gray">请先登录再进行操作</view>
				<image src="../../static/image/upgrade.png"></image>
				<view class="if_login_b">
					<view class="if_login_b1" @click="noLogin">暂不登录</view>
					<button open-type="getUserInfo" withCredentials="true" lang="zh_CN" class="if_login_b2 userInfoBtn" @getuserinfo="goToLoginWx">立即登录</button>
				</view>
			</view>

			<div v-if="userInfo" class="logout-btn" @click="logout">退出登录</div>
		</view>
		<upgrade></upgrade>
	</view>
</template>

<script>
import upgrade from '../../components/upgrade.vue';
import uniGrid from '../../components/uni-grid/uni-grid.vue';
import uniGridItem from '../../components/uni-grid-item/uni-grid-item.vue';
export default {
	name: 'my',
	data() {
		return {
			ifWEIXIN: false,
			userInfo: null,
			ifLogin: false
		};
	},
	components: {
		upgrade,
		uniGrid,
		uniGridItem
	},
	onTabItemTap(item) {
		// uni.setTabBarItem({
		// 	index: 0,
		// 	text: ''
		// });
	},
	methods: {
		/**
		 * 跳转资产类型
		 */
		changeAssetStyle(e) {
			if (this.userInfo) {
				if (e.detail.index === 0) {
					uni.navigateTo({
						url: '../my-bid/my-bid'
					});
				} else if (e.detail.index === 1) {
					uni.navigateTo({
						url: '../message-notification/message-notification'
					});
				} else if (e.detail.index === 2) {
					uni.navigateTo({
						url: '../browsing-history/browsing-history'
					});
				}
			} else {
				// #ifdef MP-WEIXIN
				this.ifLogin = true;
				// uni.navigateTo({
				//   url: '../login/login',
				// })
				// #endif
				// #ifdef APP-PLUS
				uni.navigateTo({
					url: '../login/login'
				});
				// #endif
			}
		},
		call(event) {
			let phone = '4000159899';
			// #ifdef APP-PLUS
			// 导入Activity、Intent类
			plus.android.requestPermissions(['android.permission.CALL_PHONE'], function(e) {
				if (e.deniedAlways.length > 0) {
					//权限被永久拒绝
					uni.showToast({
						title: '请前往设置，开启拨打电话权限',
						icon: 'none'
					});
				}
				if (e.deniedPresent.length > 0) {
					//权限被临时拒绝
					console.log('temporary!!! ' + e.granted.toString());
				}
				if (e.granted.length > 0) {
					//权限被允许
					//调用依赖获取定位权限的代码
					console.log('Granted!!! ' + e.granted.toString());
				}
			});
			// #endif
			uni.makePhoneCall({
				phoneNumber: '4000159899'
			});
		},
		noLogin(event) {
			this.ifLogin = false;
		},
		/**
		 * 微信登录
		 */
		goToLoginWx(e) {
			console.log(e);
			let that = this;
			that.ifLogin = false;
			uni.showLoading({
				title: '登录中',
				mask: false
			});
			uni.login({
				provider: 'weixin',
				success: res => {
					console.log(res);
					if (res.code) {
						let code = res.code;
						uni.getUserInfo({
							withCredentials: true,
							provider: 'weixin',
							success: res => {
								console.log(res);
								let params = {
									code: code,
									encryptedData: res.encryptedData,
									iv: res.iv
								};
								this.$http({
									url: '/wx/weapp/auth',
									data: params
								})
									.then(res => {
										uni.hideLoading();
										if (res.code == 0) {
											let pages = getCurrentPages(); // 当前页面
											let beforePage = pages[pages.length - 2]; // 前一个页面
											this.userInfo = res.data;
											uni.setStorage({
												//将用户信息保存在本地
												key: 'userInfo',
												data: res.data,
												success: function() {
													console.log('success');
													uni.navigateBack({
														success: function() {
															beforePage.onLoad(); // 执行前一个页面的onLoad方法
														}
													});
												}
											});
										} else {
											uni.showToast({
												title: res.message ? res.message : '登录授权失败'
											});
										}
									})
									.catch(err => {
										console.log(err);
									});
							}
						});
					} else {
						uni.hideLoading();
						uni.showToast({
							title: '获取用户登录态失败'
						});
					}
				},
				fail: res => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: res.errMsg
					});
				}
			});
		},
		/**
		 * 跳转登录页
		 */
		goToLogin(id) {
			if (this.userInfo) {
				return;
			}
			// #ifdef MP-WEIXIN
			this.ifLogin = true;
			// uni.navigateTo({
			//   url: '../login/login',
			// })
			// #endif
			// #ifdef APP-PLUS
			uni.navigateTo({
				url: '../login/login'
			});
			// #endif
		},
		logout() {
			let that = this;
			uni.showModal({
				title: '提示',
				content: '确认退出',
				success: function(res) {
					if (res.confirm) {
						uni.removeStorage({
							key: 'userInfo'
						});
						uni.removeStorageSync('token');
						that.userInfo = null;
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
	},
	onLoad() {
		// #ifdef MP-WEIXIN
		this.ifWEIXIN = true;
		// #endif
	},
	onShow() {
		let that = this;
		uni.getStorage({
			key: 'userInfo',
			success: function(res) {
				that.userInfo = res.data;
				console.log('logined', that.userInfo);
			}
		});

		// this.getUserInfo();
	}
};
</script>

<style lang="scss" scoped>
.uc {
	padding-top: 50upx;
	.asset-style {
		.image {
			width: 80upx;
			height: 80upx;
		}

		.text {
			font-size: 30upx;
			margin-top: 10upx;
			color: #666;
		}
	}
	.main {
		margin-bottom: 100upx;
	}

	.header_login {
		position: relative;
		display: flex;
		align-items: center;
		background: #fff;
		padding: 20upx;
		padding-bottom: 60upx;
	}

	.avatar {
		width: 150upx;
		height: 150upx;
		border-radius: 100%;
		display: flex;
		align-items: center;
		margin: 0 20upx;
	}

	.avatar image {
		display: block;
		margin: 0 auto;
		width: 100%;
		height: 100%;
		border-radius: 100%;
	}

	.uc-panel {
		background: #fff;
		-webkit-box-flex: 1;
		-ms-flex: 1;
		flex: 1;
		width: 100%;
		border-radius: 5px;
		color: #333;
		font-size: 30upx;
		margin-top: 10upx;
	}

	.nickname {
		font-size: 36upx;
		color: #615f5f;
		flex: 1;
		color: #333;
		.nickname-tip {
			color: #666;
			font-size: 36upx;
		}
	}

	.row {
		padding: 30upx;
		border-bottom: 1px solid #eee;
		display: flex;
		flex-direction: row;
	}

	.row-auction {
		background: #3a938d;
	}

	.row-icon {
		width: 66upx;
		height: 66upx;
		border-radius: 50%;
		text-align: center;
	}

	.icon-auction,
	.icon-notice,
	.icon-phone {
		color: #fff;
		font-size: 30upx;
	}

	.row-content {
		-webkit-box-flex: 1;
		-ms-flex: 1;
		flex: 1;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		-ms-flex-direction: row;
		flex-direction: row;
		background: url(../../static/image/youjiantou@2x.png) no-repeat;
		background-position: right;
		background-size: 18upx;
		align-items: center;
	}

	.row-text {
		flex: 1;
		text-align: left;
		padding-left: 20upx;
		font-size: 30upx;
	}

	.kefu-phone {
		margin-right: 30upx;
	}

	.row-message {
		background: #ff9466;
	}

	.row-last {
		border: 0 none;
	}

	.row-kefu {
		background: #40b573;
	}

	.hover-class {
		background: #f0f0f0;
	}

	.userInfoBtn::after {
		border: none;
	}
	.userInfoBtn {
		background-color: transparent;
		line-height: normal;
	}

	.mask {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: #333;
		opacity: 0.5;
	}

	.if_login {
		width: 550upx;
		position: fixed;
		z-index: 2;
		background: #fff;
		border-radius: 15upx;
		text-align: center;
		padding: 50upx;
		font-size: 36upx;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
	}
	.if_login image {
		width: 308upx;
		height: 257upx;
		margin: 30upx;
		margin-top: 75upx;
	}

	.gray {
		font-size: 24upx;
		color: #666;
		margin: 10upx;
	}

	.if_login_b {
		display: flex;
		justify-content: space-around;
	}
	.if_login_b1 {
		border: 1px solid #cdcdcd;
		width: 230upx;
		height: 80upx;
		font-size: 30upx;
		border-radius: 40upx;
		color: #686868;
		margin: 0 10upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.if_login_b2 {
		border: 1px solid transparent;
		width: 230upx;
		height: 80upx;
		background: linear-gradient(90deg, rgba(226, 193, 153, 1), rgba(204, 151, 86, 1));
		font-size: 30upx;
		border-radius: 40upx;
		color: #fff;
		margin: 0 10upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.logout-btn {
		background: linear-gradient(90deg, rgba(226, 193, 153, 1), rgba(204, 151, 86, 1));
		color: #fff;
		padding: 20upx;
		margin: 40upx;
		border-radius: 100upx;
		font-size: 36upx;
		text-align: center;
		width: 90%;
	}
}
.wx-uc {
	padding-top: 0;
}
</style>
