<script>
export default {
	onLaunch: function () {
		uni.setStorageSync('version', '1.0.0');
		uni.setStorageSync('sourceId', 15);
	},
	onShow: function () {
		// this.$http({
		//     data: {
		//         module: 'Dc',
		//         action: 'index',
		//         appstore: 'huawei',
		// 		v: 0,
		//     }
		// }).then(data => {
		// 	uni.setStorageSync('vvvv', data.result.v);
		// }).catch(err => {
		    
		// });
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>
<style lang="scss">
@import './common/styles/defin';
@import './common/styles/iconfont';
@import './common/styles/uni.css';
page,
view,
text,
input,
button,
image,
navigator,
swiper,
textarea {
	// display: flex;
	font-size: 32upx;
	box-sizing: border-box;
	font-family: $font-normal;
}
page {
	background-color: #F5F5F5;
	min-height: 100%;
	// padding-top: 40upx;
}
button::after{ 
	border: none; 
}
.base-btn {
	@include flex;
	width: 100%;
	height: 98upx;
	@include font-size(30upx);
	color: #FFFFFF;
	font-weight: bold;
	background-color: #FF7B28;
	background: linear-gradient(90deg, #F67B03, #F41C11);
	border-radius: 4upx;
	&.disabled {
		background: #CCCCCC;
	}
	&.grey {
		background-color: #BBBBBB;
		background: linear-gradient(90deg, #BBBBBB, #999999);
	}
}
.base-mask {
	position: fixed;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	z-index: 10;
	background-color: $uni-bg-color-mask;
}
.base-tips {
	@include flex;
	width: 100%;
	padding: 30upx;
	@include font-size(24upx);
	color: #999999;
}

.font-din {
	font-family: "DIN-Medium" !important;
}
.auction-status-18 {
	background: linear-gradient(to right, #7e7e7e, #4f4f4f);
}

.auction-status-9 {
	background: linear-gradient(to right, #62cc67, #25b28f);
}

.auction-status-8,
.auction-status-10,
.auction-status-14,
.auction-status-15,
.auction-status-16,
.auction-status-7 {
	background: linear-gradient(to right, #fb6f5b, #f94554);
}
.auction-status-11 {
	background: linear-gradient(to right, #ffb86c, #ff9a6d);
}
.auction-status-12 {
	background: linear-gradient(to right, #fb6f5b, #f94554);
}
.auction-status-13 {
	background: linear-gradient(to right, #44ccfe, #1ea5f2);
}
</style>

