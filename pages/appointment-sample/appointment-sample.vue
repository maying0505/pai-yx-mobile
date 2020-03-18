<template>
	<view class="appointment-sample-box">
		<view class="main">
			<view class="content">
				<!-- <view class="head">
					预约看样
				</view> -->
				<form @submit="formSubmit" report-submit='true'>
					<view class="form-item form-item-first-child">
						<label for="name">
							您的姓名
						 </label>
						<input id="name" class="item" name="name" />
					</view>
					<view class="form-item">
						<label for="mobile">
							手机号码
						 </label>
						<input id="mobile" class="item" name="mobile" @input="inputMobile"/>
					</view>
					<view class="form-item form-item-last-child">
						<label for="smcode">
							短信验证码
						 </label>
						<input id="smcode" class="item" name="smcode" />
						<view class="get-smcode" @click="getCode">{{smcodebtnTxt}}</view>
					</view>
					<!-- <view class="form-item"  @click="radioChange">
						<radio value="" style="transform:scale(0.5)" color="#CC9756" :checked="radioChecked"/><view class="look-sample-text" @click="seeRule">我已阅读并接受<text>《看样告知书》</text></view>
					</view> -->
					
                <view class="form-btn-submit">
                    <button form-type="submit">马上预约</button>
                </view>
				</form>
			</view>
			<!-- <view class="dialog-close" @click='closeDialog'>
				<image class="close" src='../static/image/close.png'></image>
			</view> -->
		</view>
		<!-- <view class="mask"></view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				radioChecked: true,
				smcodebtnTxt: '获取验证码',
				isGetSmCode: false,
				params: {
					page: "1",
					mobile: "",
					smcode: "",
					name: "",
					assetId: "",
					userId: ""
				},
				smcode: {
				  mobile: "",
				  type: "ASSETBOOK"
				},
				authTime: 60,
				isBookSubmit: false,
				getSmCoded: false
			};
		},
		methods:{
			/**
			 * 关闭
			 */
			// closeDialog(){
			// 	uni.$emit('openAppointmentSampke', false);
			// },
			/**
			 * 点击马上预约
			 */
			formSubmit(e) {
			    let paramsData = e.detail.value
			    if (this.isBookSubmit) return;
				this.isBookSubmit = true;
				
			    let user = null;
				uni.getStorage({
				    key: 'userInfo',
				    success: function (res) {
				        user = res.data;
				    }
				});
			    let userId = '';
			    if (user) {
			      userId = user.id;
			    }
			
				this.params.userId = userId;
			
			    if (paramsData.name == "") {
			      uni.showToast({
			        icon: 'none',
			        title: '请填写预约人姓名',
			      })
				  this.isBookSubmit = false;
			      return;
			    } else if (paramsData.mobile == "") {
			      uni.showToast({
			        icon: 'none',
			        title: '请填写看样手机号码',
			      })
			      this.isBookSubmit = false;
			      return;
			    } else if (!this.isMobile(paramsData.mobile)) {
			      uni.showToast({
			        icon: 'none',
			        title: '请填写正确的手机号码',
			      })
			      this.isBookSubmit = false;
			      return;
			    } else if (!this.getSmCoded) {
			      uni.showToast({
			        icon: 'none',
			        title: '请获取短信验证码',
			      })
			      this.isBookSubmit = false;
			      return;
			    } else if (paramsData.smcode == "") {
			      uni.showToast({
			        icon: 'none',
			        title: '请填写验证码',
			      })
			      this.isBookSubmit = false;
			      return;
			    } 
				// else if (!this.radioChecked) {
			 //      uni.showToast({
			 //        icon: 'none',
			 //        title: '请阅读并接受《看样告知书》',
			 //      })
			 //      this.isBookSubmit = false;
			 //      return;
			 //    }
			
				this.params.name = paramsData.name;
				this.params.smcode = paramsData.smcode;
				this.params.mobile = paramsData.mobile;
				this.isBookSubmit = false;
				console.log('params...',this.params)
				this.$http({
					url: '/book/add',
					data: this.params
				})
				.then(res => {
					uni.showToast({
						title: '预约成功',
						icon: 'success',
					})
					setTimeout(function(){
						uni.navigateBack()
					},2000)
				})
				.catch(err => {
				});
			
			  },
			/**
			 * 查看看样告知书
			 */
			seeRule() {
			    // uni.navigateTo({
			    //   url: '../auction/rule',
			    // })
			},
			/**
			 * 手机号填写
			 */
			inputMobile(e) {
			    let mobile = e.detail.value;
			    this.params.mobile = mobile;
			 },
			/**
			 * 手机号验证
			 */
			isMobile(mobile) {
			    const mobile_regex = /^((1[0-9]))\d{9}$/;
			    return mobile_regex.test(mobile);
			},
			/**
			 * 获取验证码
			 */
			getCode() {
			    if (this.params.mobile == "") {
			      uni.showToast({
			        icon: 'none',
			        title: '请输入手机号码',
			      })
			      return;
			    }
			    if (!this.isMobile(this.params.mobile)) {
			      uni.showToast({
			        icon: 'none',
			        title: '请填写正确的手机号码',
			      })
			      return;
			    }
			
			    if (this.isGetSmCode) return;
				this.isGetSmCode = true;
				this.smcode.mobile = this.params.mobile;
				this.smcode.type = "ASSETBOOK";
				// uni.showLoading({
				// 	title: '请稍等...',
				// 	mask: true
				// });
				this.$http({
					url: '/sm/send',
					data: this.smcode
				})
				.then(res => {
					this.getSmCoded = true;
					let authTime=60
					let timer = setInterval(()=> {
					    this.smcodebtnTxt = (--authTime) + 's';
					    this.isGetSmCode = true
						if (authTime == -1) { 
							clearInterval(timer)
							this.smcodebtnTxt = '获取验证码';
							this.isGetSmCode = false
						}
					}, 1000)
					// uni.hideLoading();
				})
				.catch(err => {
					// uni.hideLoading();
					this.getSmCoded = false;
				});
			  },
			/**
			 * 是否阅读并接受看样告知书
			 */
			radioChange(){
				this.radioChecked = !this.radioChecked;
			},
		},
		onLoad(params) {
			 this.params.assetId = params.assetId;
		},
		
	}
</script>

<style lang="scss" scoped>
	.appointment-sample-box{
		.mask{
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			background: #333333;
			opacity: 0.7;
			z-index: 4;
		}
		.main{
			margin: 20upx 30upx;
			// position: fixed;
			// top: 150upx;
			// left: 50%;
			// width: 600upx;
			// z-index: 5;
			// transform: translateX(-50%);
			.content{
				border-radius: 10upx;
				.head{
					background: #D8D8D8 url(../../static/image/book-icon.png) no-repeat;
					background-position: 160upx;
					background-size: 58upx;
					padding: 30upx;
					border-radius: 20upx 20upx 0 0; 
					text-align: center;
				}
				form {
					display: flex;
					flex-direction: column;
					.form-item{
						display: flex;
						align-items: center;
						color: #666;
						font-size: 28upx;
						border-bottom: 1px solid #eee;
						padding: 20upx;
						background: #fff;
						label{
							margin-right: 30upx;
						}
						.get-smcode{
							margin-left: 20upx;
							font-size: 24upx;
							color: #CC9857;
							border-radius: 5upx;
							padding: 12upx 20upx;
							background: #f5f5f5;
							width: 170upx;
							text-align: center;
						}
						.item{
							flex: 1;
							color: #333;
							.look-time{
								font-size: 28upx;
								text-align: center;
							}
						}
						.look-sample-text{
							font-size: 24upx;
							text{
								font-size: 24upx;
								color: #CC9756;
							}
						}
					}
					.form-item-first-child{
						border-radius: 10upx 10upx 0 0;
					}
					.form-item-last-child{
						padding: 13rpx 20rpx;
						border-radius: 0 0 10upx 10upx;
					}
					.form-btn-submit{
						margin-top: 30upx;
						button{
							background: linear-gradient(90deg,rgba(226,193,153,1),rgba(204,151,86,1));
							padding: 10upx;
							color: #fff;
							border-radius:100upx;
						}
					}
				}
			}
			.dialog-close {
			  color: #fff;
			  background: transparent;
			  height: 82upx;
			  margin-top: 20upx;
			  text-align: center;
			  .close {
			    width: 78upx;
			    height: 78upx;
			    text-align: center;
			    margin: 0 auto;
			  }
			}
		}
	}
</style>
