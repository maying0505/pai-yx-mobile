<template>
	<view class="login-box">
		<view class="login-tip">
			<view class="tip-title">登录能拍严选</view>
			<view class="tip-text">无需注册，输入手机号即可登录</view>
		</view>
		<view class="form-box">
			<form @submit="formSubmit" report-submit="true">
				<view class="form-item"><input type="number" class="item name" name="phone" placeholder="请输入手机号" @input="inputMobile"/></view>
				<view class="form-item smcode-box">
					<input class="item code" name="code" placeholder="请输入验证码" />
					<text class="smcode-get" @click="smcodeGet">{{smcodebtnTxt}}</text>
				</view>
				<button form-type="submit" class="login-btn">登录</button>
				<view class="form-item-1" v-if="agreement2Show || agreement1Show">
					<view @click="radioChange" class="rule">
						<radio value="" name="" style="transform:scale(0.5)" color="#CC9756" :checked="radioChecked" />
						我已阅读并同意
						<text class="look-sample-text" @click.native.stop="seeRule('0')" v-if="agreement1Show">《用户使用协议》</text>
						<text v-if="agreement1Show">及</text>
						<text class="look-sample-text" @click.native.stop="seeRule('1')" v-if="agreement2Show">《隐私条款》</text>
					</view>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			radioChecked: true,
			mobileNum: '',
			isGetSmCode: false,
			getSmCoded: false,
			smcodebtnTxt: '获取验证码',
			agreement1Show: false,
			agreement2Show: false,
			agreementList: []
		};
	},
	onLoad() {
		this.agreementListGet();
	},
	methods: {
		/**
		 * 手机号填写
		 */
		inputMobile(e) {
		    let mobile = e.detail.value;
		    this.mobileNum = mobile;
		 },
		/**
		 * 获取验证码
		 */
		smcodeGet() {
			if (this.mobileNum == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号'
				});
				return;
			}
			if (!this.$filter.isMobile(this.mobileNum)) {
				uni.showToast({
					icon: 'none',
					title: '请填写正确的手机号'
				});
				return;
			}

			if (this.isGetSmCode){
				return;
			} 
			let smcodeParams = {
				mobile: this.mobileNum,
				type: 'LOGIN'
			}
			this.$http({
				url: '/sm/send',
				data: smcodeParams
			})
				.then(res => {
					this.getSmCoded = true;
					let authTime = 60;
					let timer = setInterval(() => {
						this.smcodebtnTxt = --authTime + 's';
						this.isGetSmCode = true;
						if (authTime == -1) {
							clearInterval(timer);
							this.smcodebtnTxt = '获取验证码';
							this.isGetSmCode = false;
						}
					}, 1000);
				})
				.catch(err => {
					console.log('0000')
				});
		},
		/**
		 * 协议list
		 */
		agreementListGet() {
			this.$http({
				url: '/agreement/list',
			})
				.then(res => {
					if(res.data && res.data.length > 0){
						this.agreementList = res.data;
						for(let item of res.data){
							if (item.type === '0' && item.url) {
								this.agreement1Show = true;
							}
							if (item.type === '1' && item.url) {
								this.agreement2Show = true;
							}
						}
					}
				})
				.catch(err => {});
		},

		/**
		 * 登录
		 */
		formSubmit(e) {
			console.log(e);
			let phone = e.detail.value.phone;
			let code = e.detail.value.code;
			let params = {
				phone: phone,
				code: code
			};
			if (!phone) {
				uni.showToast({
					icon: 'none',
					title: '请输入手机号'
				});
				return;
			} else if (!this.$filter.isMobile(phone)) {
				uni.showToast({
					icon: 'none',
					title: '请输入正确的手机号'
				});
				return;
			} else if (!this.getSmCoded) {
				uni.showToast({
					icon: 'none',
					title: '请获取短信验证码',
				})
				return;
			}  else if (!code) {
				uni.showToast({
					icon: 'none',
					title: '请输入验证码'
				});
				return;
			} else if (!this.radioChecked) {
				uni.showToast({
					icon: 'none',
					title: '请阅读并同意协议和条款'
				});
				return;
			}
			uni.showLoading({
				title: '登录中',
				mask: false
			});
			this.$http({
				url: '/user/login',
				data: params
			})
				.then(res => {
					uni.hideLoading();
					console.log(res);
					let pages = getCurrentPages(); // 当前页面
					let beforePage = pages[pages.length - 2]; // 前一个页面
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
				})
				.catch(err => {
					console.log(err);
				});
		},
		/**
		 * 是否阅读并同意服务条款
		 */
		radioChange() {
			this.radioChecked = !this.radioChecked;
		},
		/**
		 * 查看服务条款
		 */
		seeRule(index) {
			let url = this.agreementList[index].url;
			uni.navigateTo({
			  url: '../agreement/agreement?url=' + encodeURIComponent(url)
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.login-box {
	height: 100vh;
	width: 100%;
	background-color: #fff;
	.login-tip {
		padding: 60upx;
		padding-bottom: 30upx;
		.tip-title {
			font-size: 40upx;
		}
		.tip-text {
			font-size: 24upx;
			color: #666;
		}
	}
	.form-box {
		margin: 30upx;

		.form-item {
			padding: 20upx;
			background: #e6e6e6;
			border-radius: 10upx;
			margin: 25upx 10upx;

			.name {
			}
			.code {
				flex: 1;
			}
		}
		.smcode-box {
			padding: 10upx 20upx;
			display: flex;
			align-items: center;
			.smcode-get {
				padding: 10upx 0;
				background-color: #fff;
				color: #666;
				font-size: 30upx;
				border-radius: 10upx;
				width: 180upx;
				text-align: center;
			}
		}
		.form-item-1 {
			display: flex;
			color: #808080;
			padding: 0 10upx;
			margin-bottom: 20upx;
			.rule {
				flex: 1;
				text {
					font-size: 26upx;
				}
			}
		}
		.login-btn {
			background: linear-gradient(90deg, rgba(226, 193, 153, 1), rgba(204, 151, 86, 1));
			color: #fff;
			padding: 10upx;
			margin: 0 20upx;
			border-radius: 100upx;
			font-size: 36upx;
			margin-top: 50upx;
		}
	}
	.rule {
		margin-top: 20upx;
		color: #666;
		font-size: 24upx;
		.look-sample-text {
			color: #cc9756;
			font-size: 24upx;
		}
	}
}
</style>
