<template>
	<view class="detail">
		<!-- 轮播图 -->
		<swiper
			class="swiper-box"
			:autoplay="true"
			:interval="3000"
			:duration="1000"
			circular="true"
			@change="swiperChange"
			v-if="auctionDetail.files"
		>
			<swiper-item v-for="(item, index) in auctionDetail.files" :key="index" @click="previewImg(index)">
				<view class="swiper-item"><image :src="item.thumbFileName" mode="aspectFill"></image></view>
			</swiper-item>
		</swiper>
		<view class="indicator-num">{{curIndicatorNum}}/{{auctionDetail.files.length}}</view>
		<view class="auction-detail-1">
			<!-- <image src="../../static/image/paimaijieshu@2x.png" class="auction-end-icon" v-if="auctionDetail.status == 13"></image> -->
			

			<view class="auction-price" v-if="auctionDetail.status == 13">
				<view class="text">成交价</view>
				<view class="price red-color">{{ auctionDetail.finalPrice ? $filter.amountFormat(auctionDetail.finalPrice) : '--' }}</view>
			</view>
			<view class="auction-price" v-else>
				<view class="text">起拍价</view>
				<view class="price red-color">{{ auctionDetail.startintPrice ? $filter.amountFormat(auctionDetail.startintPrice) : '--' }}</view>
			</view>

			<view class="auction-time-resource" v-if="auctionDetail.status != 13">
				<view class="text">开拍时间</view>
				<view class="auction-time">{{ auctionDetail.auctionTime ? auctionDetail.auctionTime : '--' }}</view>
			</view>
			<view class="auction-time-resource" v-else>
				<view class="text">成交时间</view>
				<view class="transaction-time">{{ auctionDetail.transactionTime ? auctionDetail.transactionTime : '--' }}</view>
			</view>
			<view class="auction-number-title">
				<text :selectable="true">{{ auctionDetail.name ? auctionDetail.name : '--' }}</text>
			</view>
			<view class="uni-aution-status-stage">
				<view class="recommend-auction-status" :class="'auction-status-' + auctionDetail.status">{{ $filter.statusShow(allStatus,auctionDetail.status) }}</view>
				<view class="recommend-auction-stage">{{ $filter.stageShow(stageList,auctionDetail.stage) }}</view>
				<view class="recommend-auction-stage">{{auctionDetail.handleUnit ? auctionDetail.handleUnit : '--'}}</view>
			</view>
			<view class="auction-time-resource auction-time-resource1">
				<view class="resource">
					已有{{ auctionDetail.numbers ? auctionDetail.numbers : '0' }}人预约看样 | {{ auctionDetail.applyNum ? auctionDetail.applyNum : '0' }}人报名
				</view>
				<view class="resource resource1 text-right">来源 {{ auctionDetail.auctionPlatform ? auctionDetail.auctionPlatform : '--' }}</view>
			</view>
		</view>
		<view class="auction-end-box" v-if="auctionDetail.status == 13">
			<view class="auction-end">
				<view class="auction-end-left">
					<view class="text">起拍价</view>
					<view class="value">￥{{ auctionDetail.startintPrice ? auctionDetail.startintPrice : '--' }}元</view>
				</view>
				<view class="line"></view>
				<view class="auction-end-right">
					<view class="text">开拍时间</view>
					<view class="value">{{ auctionDetail.auctionTime ? auctionDetail.auctionTime : '--' }}</view>
				</view>
			</view>
		</view>
		<view class="auction-detail-2-box">
			<view class="auction-detail-2-t">拍卖信息</view>
			<view class="auction-detail-2">
				<view class="table-cell">
					<view class="cell-text">评估价</view>
					<view class="cell-value">￥{{ auctionDetail.evaluationPrice ? auctionDetail.evaluationPrice : '--' }}元</view>
				</view>
				<view class="table-cell">
					<view class="cell-text">竞价周期</view>
					<view class="cell-value">{{ auctionDetail.biddingCycle ? auctionDetail.biddingCycle : '--' }}</view>
				</view>
				<view class="table-cell">
					<view class="cell-text">保证金</view>
					<view class="cell-value">￥{{ auctionDetail.bond ? auctionDetail.bond : '--' }}元</view>
				</view>
				<view class="table-cell  ">
					<view class="cell-text">处置方式</view>
					<view class="cell-value">{{ auctionDetail.auction == 0 ? '线上' : '线下' }}</view>
				</view>
				<view class="table-cell border-bottom-none">
					<view class="cell-text">加价幅度</view>
					<view class="cell-value">￥{{ auctionDetail.price ? auctionDetail.price : '--' }}元</view>
				</view>
				<view class="table-cell border-bottom-none">
					<view class="cell-text">优先购买权</view>
					<view class="cell-value">{{ auctionDetail.preemption ? auctionDetail.preemption : '--' }}</view>
				</view>
			</view>
		</view>
		
		<!-- <view class="auction-detail-3" @click="openAddress">
			<view class="text">标的位置</view>
			<view class="value">{{ auctionDetail.address ? auctionDetail.address : '--' }}</view>
			<image src="../../static/image/map-bg@2x.png"></image>
		</view> -->
		<view class="auction-detail-4-box">
			<view class="auction-detail-4-t">更多详情</view>
			<view class="auction-detail-4">
				<view class="row" @click="openNoticePicture('0')" hover-class="hover-class">
					<image src="../../static/image/ic_bid_info@3x.png" class="detail-icon"></image>
					<view class="text">标的物介绍</view>
					<view class="value"></view>
					<view class="icon-right iconfont"></view>
				</view>
				<view class="row" @click="openNoticePicture('1')" hover-class="hover-class">
					<image src="../../static/image/ic_auction_announcement@3x.png" class="detail-icon"></image>
					<view class="text">竞买公告</view>
					<view class="value"></view>
					<view class="icon-right iconfont"></view>
				</view>
				<view class="row" @click="openNoticePicture('2')" hover-class="hover-class">
					<image src="../../static/image/ic_buy_tip@3x.png" class="detail-icon"></image>
					<view class="text">竞买须知</view>
					<view class="value"></view>
					<view class="icon-right iconfont"></view>
				</view>
			</view>
		</view>
		
		<view class="auction-detail-6-box">
			<view class="auction-detail-6-t">为你推荐</view>
			<view class="auction-detail-6">
				<view class="nodata" v-if="noData">
					<image src="../../static/image/zanwushuju@2x.png"></image>
					<view>暂无数据</view>
				</view>
				<recommend-item :recommendList="auctionList"></recommend-item>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="call-phone" @click="callPhone">
				<image src="../../static/image/ic_query@3x.png"></image>
				<view class="call-box">
					<view>竞拍咨询</view>
					<view class="call-num">(4000159899)</view>
				</view>
			</view>
			<view class="cur-status" @click="openAppointmentSampke">
				<image src="../../static/image/ic_book_see@3x.png"></image>{{auctionDetail.status ? $filter.statusShow(allStatus,auctionDetail.status) : ''}}
			</view>
		</view>
	</view>
</template>

<script>
import {allStatus, stageList} from '../../common/js/data.js';
import recommendItem from '../../components/recommend-item.vue';
export default {
	data() {
		return {
			allStatus: allStatus,
			stageList: stageList,
			curIndicatorNum: 1,
			auctionDetail: {},
			pictures: [],
			assetId: '',
			auctionList: [],
			noData: true,
		};
	},
	components:{
		recommendItem
	},
	onLoad(params) {
		console.log(params);
		this.assetId = params.id;
		this.getDetailInfo(params.id);
		// uni.$on('openAppointmentSampke', this.openAppointmentSampke)
	},
	// onUnload() {
	// 	 uni.$off('openAppointmentSampke', this.openAppointmentSampke)
	// },
	methods: {
		/**
		 * 获取推荐数据列表
		 */
		getAuctionList(city,assetType) {
			const httpParams = {
				type: '1',
				pageNo: 1,
				pageSize: 4,
				paging: true,
				city: city,
				assetType: assetType
			};
			this.$http({
				url: '/asset/recommend',
				data: httpParams
			})
				.then(res => {
					const auctionListB = res.data.data;
					this.auctionList = auctionListB;
					if (auctionListB && auctionListB.length > 0) {
						this.noData = false;
					}
					uni.hideLoading();
				})
				.catch(err => {
					this.noData = true;
					uni.hideLoading();
				});
		},
		/**
		 * 轮播图current改变
		 */
		swiperChange(event){
			this.curIndicatorNum = event.detail.current + 1
		},
		/**
		 * 打开预约看样
		 */
		openAppointmentSampke(){
			if(this.auctionDetail.status!=9) return
			if (this.auctionDetail.isBooked) {
		      uni.showToast({
		        icon: 'none',
		        title: '您已经预约过了',
		      })
		    } else {
			  let assetId = this.auctionDetail.id;
			  uni.navigateTo({
			  	url: '../appointment-sample/appointment-sample?assetId=' + assetId
			  })
		    }
		},
		/**
		 **打开拍卖公告、竞买须知、标的物介绍
		 */
		openNoticePicture(type){
			uni.setStorageSync('_detailContent',this.auctionDetail)
			uni.navigateTo({
				url: '../notice-picture/notice-picture?type=' + type
			})
		},
		/**
		 **打开标的位置
		 */
		openAddress(){
			let latitude = this.auctionDetail.latitude;
			let longitude = this.auctionDetail.longtitude;
			console.log(latitude,longitude)
			if (latitude && longitude) {
				uni.openLocation({
					latitude: Number(latitude),
					longitude: Number(longitude),
					name: '我在这里',
					address: this.auctionDetail.locationName,
					success: function () {
						console.log('success');
					}
				});
			} else {
				uni.showToast({
				  title: '位置信息错误！',
				  icon: 'none'
				})
			}
			
		},
		/**
		 * 竞拍咨询
		 */
		callPhone(){
			let phone = '4000159899';
			// #ifdef APP-PLUS
			 // 导入Activity、Intent类
			 plus.android.requestPermissions(["android.permission.CALL_PHONE"], function(e){
				 if(e.deniedAlways.length>0){ //权限被永久拒绝
					uni.showToast({
					  title: '请前往设置，开启拨打电话权限',
					  icon: 'none'
					})
				 }
				 if(e.deniedPresent.length>0){ //权限被临时拒绝
					console.log('temporary!!! '+e.granted.toString());
				 }
				 if(e.granted.length>0){ //权限被允许
					//调用依赖获取定位权限的代码
					console.log('Granted!!! '+e.granted.toString());
				 }
			})
			// #endif
			uni.makePhoneCall({
			    phoneNumber: '4000159899'
			});
		},
		/**
		 * 获取数据列表
		 */
		getDetailInfo(id) {
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			let params = {
				assetId: id,
				notNeedStyle: true
			};
			this.$http({
				url: '/asset/detail',
				data: params
			})
				.then(res => {
					this.auctionDetail = res.data;
					let picturesB = [];
					res.data.files.forEach((item, index) => {
					  picturesB.push(item.thumbFileName)
					})
					this.pictures = picturesB;
					this.getAuctionList(res.data.city,res.data.type);
				})
				.catch(err => {
					this.getAuctionList();
				});
		},
		/**
		 * 预览图片
		 */
		previewImg(index) {
		    uni.previewImage({
		      current: this.pictures[index],
		      urls: this.pictures,
		      success: function () {
		      },
		      fail: function () {
		        uni.showToast({
		          title: '图片预览错误',
		        })
		      }
		    })
		},
	}
};
</script>

<style lang="scss" scoped>
.detail {
	display: flex;
	flex-direction: column;
	.swiper-box,
	swiper {
		height: 350upx;
		image {
			width: 100%;
			height: 350upx;
		}
	}
	.indicator-num{
		position: absolute;
		top: 300upx;
		right: 20upx;
		color: #fff;
		font-size: 24upx;
	}
	.auction-detail-1 {
		background: #fff;
		position: relative;
		overflow: hidden;
		.auction-number-title {
			padding: 0 30upx;
			line-height: 1.3;
			margin-top: 10upx;
			text {
				color: #323232;
				font-size: 30upx;
				margin: 15upx 0;
			}
		}
		.auction-price {
			display: flex;
			flex-direction: row;
			padding: 0 30upx;
			align-items: center;
			.text{
				font-size: 30upx;
				color: #333;
			}
			.price{
				color: #CC9756;
				font-size: 48upx;
			}
		}
		.text {
			color: #666;
			font-size: 26upx;
			text-align: left;
		}
		.auction-time,
		.transaction-time {
			padding-left: 30upx;
		}
		.red-color.price {
			font-size: 48upx;
			flex: 1;
		}
		.red-color {
			color: #fe7073;
			padding-left: 30upx;
			font-size: 26upx;
		}
		.auction-time-resource {
			padding: 0 30upx;
			color: #666;
			display: flex;
			flex-direction: row;
			view{
				font-size: 24upx;
			}
		}
		.auction-time-resource1{
			padding: 20upx 30upx;
		}
		.time,
		.resource {
			flex: 2;
			font-size: 26upx;
		}
		.resource1 {
			flex: 1;
		}

		.text-right {
			text-align: right;
		}

		.book-btn {
			font-size: 30upx;
			position: absolute;
			right: 0;
			top: 50upx;
			color: #fff;
			padding: 30upx 15upx;
			background: #fe7073;
			width: 60upx;
			word-wrap: wrap;
		}

		.auction-end-icon {
			position: absolute;
			width: 177upx;
			height: 144upx;
			right: 50upx;
			top: 50%;
			transform: translateY(-50%);
		}
	}

	.auction-end-box {
		margin-top: 10upx;
		background: #fff;
		padding: 10upx 30upx;
		.auction-end {
			display: flex;
			position: relative;
			.line {
				position: absolute;
				width: 1px;
				height: calc(100% - 20upx);
				left: calc(50% - 20upx);
				background: #E6E6E6;
				top: 10upx;
			}
			.auction-end-left,
			.auction-end-right {
				flex: 1;
				padding-left: 90upx;
				view {
					font-size: 26upx;
					line-height: 1.5;
				}
				.text {
					font-size: 24upx;
					color: #666;
				}
			}
			.auction-end-left {
				background: url(../../static/image/qipaijia@2x.png) no-repeat;
				background-position: left;
				background-size: 68upx;
			}
			.auction-end-right {
				background: url(../../static/image/kaipaishijian@2x.png) no-repeat;
				background-position: left;
				background-size: 68upx;
			}
		}
	}
	.auction-detail-2-box {
		margin-top: 10upx;
		background: #fff;
		.auction-detail-2-t{
			padding: 20upx 30upx;
			font-size: 30upx;
		}
		.auction-detail-2 {
			margin: 0 20upx;
			padding: 0 20upx;
			display: flex;
			background: #FAF4EE;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: center;
			border-radius: 10upx;
			margin-bottom: 20upx;
			.table-cell {
				border-bottom: 1px solid #E6E6E6;
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 20upx 30upx;
				color: #666;
			}
			.table-cell:nth-child(odd) {
				width: 65%;
			}
				
			.table-cell:nth-child(even) {
				width: 35%;
			}
		
			.cell-text {
				color: #666;
				font-size: 24upx;
				margin-right: 30upx;
			}
		
			.cell-value {
				color: #6b6a6a;
				font-size: 24upx;
				flex: 1;
			}
			.border-right-none {
				border-right: 0 none;
			}
		
			.border-bottom-none {
				border-bottom: 0 none;
			}
		}
	}

	.row {
		border-bottom: 1px solid #E6E6E6;
		padding: 20upx 30upx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.icon-right {
		background: url(../../static/image/youjiantou@2x.png) no-repeat;
		width: 14upx;
		height: 28upx;
		background-size: contain;
		margin-left: 30upx;
	}

	.auction-detail-3 {
		position: relative;
		height: 150upx;
		padding: 20upx 0;
		image {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.text {
			color: #333;
			width: 50%;
			padding-left: 40upx;
			line-height: 1.5;
			font-size: 30upx;
		}

		.value {
			color: #666;
			font-size: 24upx;
			width: 70%;
			padding-left: 40upx;
			line-height: 1.5;
		}
	}

	.icon-location {
		transform: rotate(360deg);
		width: 14upx;
		height: 28upx;
		font-size: 28upx;
	}

	.row:last-child {
		border-bottom: 0 none;
	}

	.row:first-child .value {
		text-align: left;
		padding-left: 0.2rem;
	}
	.auction-detail-4-box {
		background: #fff;
		.auction-detail-4-t{
			font-size: 30upx;
			padding: 20upx 30upx;
		}
		.auction-detail-4 {
			margin: 0 20upx;
			background: #F5F5F5;
			border-radius: 10upx;
			.text {
				flex: 1;
				font-size: 30upx;
			}
			.value {
				flex: 1;
				font-size: 24upx;
				color: #666;
				text-align: right;
			}
		}
	}
	.border-bottom-none {
		border-top: 0 none;
	}
	
	.auction-detail-6-box{
		margin-bottom: 200upx;
		background: #fff;
		.auction-detail-6-t{
			font-size: 30upx;
			padding: 20upx 30upx;
			padding-bottom: 0;
		}
		.auction-detail-6{
			.nodata {
				text-align: center;
				height: 50vh;
				background: #fff;
				view {
					color: #666666;
					font-size: 28upx;
				}
				image {
					width: 331upx;
					height: 184upx;
					margin-top: 70upx;
				}
			}
		}
	}
	
	.detail-bottom{
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		.call-phone,.cur-status{
			align-items: center;
			padding: 16upx 0;
			flex: 1;
			display: flex;
			justify-content: center;
			image{
				width: 60upx;
				height: 60upx;
				margin-right: 20upx;
			}
		}
		.call-phone{
			background: #fff;
			.call-box{
				view{
					line-height: 1.2;
				}
				.call-num{
					color: #999999;
					font-size: 20upx;
				}
			}
		}
		.cur-status{
			color: #fff;
			background: linear-gradient(90deg,rgba(226,193,153,1),rgba(204,151,86,1));
		}
	}

	.hover-class {
		background: #f0f0f0;
	}

	.eye-icon {
		width: 38upx;
		height: 38upx;
		vertical-align: middle;
		margin-right: 18upx;
	}

	.icon-phone {
		margin-right: 18upx;
	}

	.detail-icon {
		width: 34upx;
		height: 34upx;
		vertical-align: middle;
		margin-right: 18upx;
	}
	.uni-aution-status-stage{
		display: flex;
		padding: 20upx 30upx;
		border-bottom: 1px solid #E6E6E6;
		view{
			border-radius:15px;
			font-size: 18upx;
			padding: 2upx 20upx;
		}
		.recommend-auction-status{
			color: #fff;
		}
		.recommend-auction-stage{
			color: #676767;
			background: #E6E6E6;
			margin-left: 10upx;
		}
	}
}
</style>
