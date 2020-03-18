<template>
	<view class="index">
		<!-- 搜索框 -->
		<view class="search-box" :class="[ifSearch ? 'search-focus-box' : '',ifWEIXIN ? 'wx-search-box':'']">
			<view class="address-input" v-if="!ifSearch" @click="goCitySearch">{{Areaaddress}}</view>
			<uni-search-bar
				placeholder="请输入标的物名称"
				class="search-input"
				radius="100"
				clearButton="auto"
				@confirm="searchConfirm"
				@input="searchInput"
				@cancel="searchCancel"
				@focus="searchFocus"
				@onfocus="searchOnfocus"
				ref="searchInputRef"
			/>
		</view>
		<view v-if="!ifSearch">
			<!-- 轮播图 -->
			<swiper
				class="swiper-box"
				:indicator-dots="indicatorDots"
				indicator-color="#ffffff"
				indicator-active-color="#FFAF35"
				:autoplay="true"
				:interval="3000"
				:duration="1000"
				circular="true"
			>
				<swiper-item>
					<view class="swiper-item"><image src="../../static/image/banner1.png" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
			<!-- 热门推荐 -->
			<view class="popular-recommend-box">
				<view class="p-r-title">
					<view class="title-text">
						<image src="../../static/image/hot-recommend.png" class="hot-recommend-icon"></image>
						热门推荐
					</view>
					<view class="more" @click="goList">更多</view>
				</view>
				<view class="p-r-content">
					<view class="pr-left" @click="goRecommendList('1')"><image class="today-recommend" src="../../static/image/today-recommend.png"></image></view>
					<view class="pr-right">
						<view class="super-value-assets" @click="goRecommendList('2')"><image src="../../static/image/super-value-assets.png"></image></view>
						<view class="newest" @click="goRecommendList('3')"><image src="../../static/image/latest-release.png"></image></view>
					</view>
				</view>
			</view>
			<!-- 资产类型 -->
			<uni-grid :column="5" :show-border="false" :square="false" @change="changeAssetStyle" class="asset-style">
				<uni-grid-item v-for="(item, index) in typeList" :key="index">
					<image class="image" :src="assetStyleIcons[index]" mode="aspectFill" />
					<text class="text">{{ item.text }}</text>
				</uni-grid-item>
			</uni-grid>
			<!-- 为你推荐 -->
			<view class="uni-list recommend-list-box">
				<view class="title">为你推荐</view>
				<view class="nodata" v-if="noData">
					<image src="../../static/image/zanwushuju@2x.png"></image>
					<view>暂无数据</view>
				</view>
				<recommend-item  v-if="!noData" :recommendList="auctionList"></recommend-item>
				<view class="more" @click="goList">查看更多<image src="../../static/image/arrow.png"></image></view>
			</view>
		</view>
		<view v-if="ifSearch">
			<view class="search-history-box" :class="ifWEIXIN ? 'wx-search-history-box':''" v-if="ifSearchFocus && searchHistory.length > 0">
				<view class="search-history">
					<view class="search-history-title">
						<view>历史搜索</view>
						<image src="../../static/image/clear-icon.png" @click="deleteSearchHistory"></image>
					</view>
					<view class="search-history-content">
						<view v-for="(item, index) in searchHistory" :key="index" @click="searchValChange(item)">{{ item }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import { allStatus, typeList, stageList } from '../../common/js/data.js';
import uniSearchBar from '../../components/uni-search-bar/uni-search-bar.vue';
import uniGrid from '../../components/uni-grid/uni-grid.vue';
import uniGridItem from '../../components/uni-grid-item/uni-grid-item.vue';
import recommendItem from '../../components/recommend-item.vue';
import amap from '../../common/js/amap-wx.js';
export default {
	name: 'index',
	components: {
		uniSearchBar,
		uniGrid,
		uniGridItem,
		recommendItem
	},
	data() {
		return {
			ifWEIXIN: false,
			amapPlugin: null,
			key: 'e705bbca07713526dea1b8395a7e36d0',//高德地图-微信小程序Key  
			ifInit: true,
			rejectGetLoction: false,
			indicatorDots: false,
			Areaaddress:'全国', //当前位置
			assetStyleIcons: [
				'../../static/image/ic_build@3x.png',
				'../../static/image/ic_car@3x.png',
				'../../static/image/ic_land@3x.png',
				'../../static/image/ic_certificate@3x.png',
				'../../static/image/ic_all@3x.png'
			],
			bannerList: [],
			ifSearchFocus: false,
			searchHistory: [],
			noData: true,
			typeList: typeList,
			auctionList: [],
			ifSearch: false,
			curAddress: uni.getStorageSync('_curAddress') ?uni.getStorageSync('_curAddress') :{name:'全国',parentName:'全国'},
			curGPS: uni.getStorageSync('_curGPS') ? uni.getStorageSync('_curGPS'): {name:'全国',parentName:'全国'},
			httpParams: {
				type: '1',
				pageNo: 1,
				pageSize: 20,
				paging: true
			}
		};
	},
	/**
	 * 刷新
	 */
	onPullDownRefresh() {
		// // uni.startPullDownRefresh();
		// // uni.stopPullDownRefresh();
		if (this.ifSearch) {
			return
		}
		this.httpParams.pageNo = 1;
		uni.showLoading({
			title: '数据加载中...',
			mask: true
		});
		this.getAuctionList(true);
	},
	onTabItemTap(item) {
		// uni.setTabBarItem({
		// 	index: 0,
		// 	text: ''
		// });
	},
	methods: {
		/**
		 * 跳转城市筛选
		 */
		goCitySearch() {
			uni.setStorageSync('_curAddress',this.curAddress);
			uni.setStorageSync('_curGPS',this.curGPS);
			uni.navigateTo({
				url: '../city-search/city-search'
			})
		},
		/**
		 * 跳转推荐列表
		 */
		goRecommendList(type){
			uni.navigateTo({
				url: '../recommend-list/recommend-list?type='+type
			});
		},
		/**
		 * 跳转严选
		 */
		goList () {
			uni.switchTab({
				url: '../yan-xuan/yan-xuan'
			})
		},
		/**
		 * 搜索历史点击
		 */
		searchValChange(item){
			this.$refs.searchInputRef.searchValChange(item)
		},
		/**
		 * 点击搜索
		 */
		searchConfirm(res) {
			this.$refs.searchInputRef.searchValSet('')
			let searchHistoryB = this.searchHistory;
			if (searchHistoryB.indexOf(res.value) === -1 && res.value) {
				searchHistoryB.push(res.value);
				this.searchHistory = searchHistoryB;
				uni.setStorage({
					key: '_searchHistory',
					data: this.searchHistory
				})
			}
			uni.setStorageSync('_ifReload',true);
			uni.setStorageSync('_assetTitle',res.value);
			uni.switchTab({
				url: '../yan-xuan/yan-xuan'
			})
		},
		/**
		 * 搜索框输入
		 */
		searchInput(res) {
			console.log(res);
		},
		/**
		 * 删除历史搜索
		 */
		deleteSearchHistory(){
			this.searchHistory = [];
			uni.setStorage({
				key: '_searchHistory',
				data: []
			})
		},
		/**
		 * 搜索框取消
		 */
		searchCancel(res) {
			this.ifSearch = res.ifSearch;
		},
		/**
		 * 搜索状态
		 */
		searchFocus(res) {
			this.ifSearch = res.ifSearch;
			// uni.setNavigationBarColor({
			//     frontColor: '#ffffff',
			// })
		},
		/**
		 * 搜索框focus
		 */
		searchOnfocus(res) {
			this.ifSearchFocus = res.searchFocus;
			// uni.setNavigationBarColor({
			//     frontColor: '#000000',
			// })
		},
		/**
		 * 跳转详情
		 */
		goToDetail(id) {
			uni.navigateTo({
				url: '../detail/detail?id=' + id
			});
		},
		/**
		 * 跳转资产类型
		 */
		changeAssetStyle(e) {
			let _type = typeList[e.detail.index].id;
			uni.setStorageSync('_type', _type);
			uni.setStorageSync('_ifReload',true);
			uni.setStorageSync('_typeIndex',e.detail.index);
			uni.switchTab({
				url: '../yan-xuan/yan-xuan' 
			})
		},
		/**
		 * 获取数据列表
		 */
		getAuctionList(isDownRefresh) { 
			this.$http({
				url: '/asset/recommend',
				data: this.httpParams
			})
				.then(res => {
					uni.hideLoading();
					if (isDownRefresh) uni.stopPullDownRefresh();

					const auctionListB = res.data.data;
					this.auctionList = auctionListB;
					if (auctionListB && auctionListB.length > 0) {
						this.noData = false;
					}
					this.ifInit = false;
				})
				.catch(err => {
					console.log('------')
					this.noData = true;
					this.ifInit = false;
					uni.hideLoading();
					if (isDownRefresh) uni.stopPullDownRefresh();
				});
		},
		addressGetDetail(res) {
			const province = res.province;
			let city = res.city;
			if (city.indexOf('市') !== -1) {
				city = city.substr(0,city.indexOf('市'))
			}
			this.curGPS.name = city;
			this.curGPS.parentName = province;
			this.curAddress.name = city;
			this.curAddress.parentName = province;
			this.httpParams.city = this.curAddress.name;
			this.Areaaddress = this.curAddress.name;
			uni.setStorageSync('_curAddress',this.curAddress);
			uni.setStorageSync('_curGPS',this.curGPS);
			this.getAuctionList();
		},
		curAddressGet() {
			let that = this;
			// #ifdef MP-WEIXIN
				that.amapPlugin = new amap.AMapWX({
					key: that.key  
				}); 
				that.amapPlugin.getRegeo({  
					success: (data) => {  
						let res = data[0].regeocodeData.addressComponent;  
						that.addressGetDetail(res);
					},
					fail: (data) => {
						if (!that.ifInit) {
							that.rejectGetLoction = true;
						}
						that.getAuctionList();
					}
				});  
			// #endif
			// #ifdef APP-PLUS
				plus.geolocation.getCurrentPosition(function(p){
					console.log('ppp',p)
					let res = p.address;
					that.addressGetDetail(res);
				}, function(e){
					console.log(e)
					if (!that.ifInit) {
						that.rejectGetLoction = true;
						uni.showToast({
							title: "您拒绝了定位,如需获取附近的拍品信息，请在设置为应用设置权限哦~",
							icon: "none"
						})
					}
					that.getAuctionList();
				} );
			// #endif
		}
	},
	onHide() {
		this.ifSearchFocus = false;
		this.ifSearch = false;
	},
	onShow() {
		console.log('onShow index')
		let _curAddress = uni.getStorageSync('_curAddress');
		if (_curAddress) {
			this.curAddress = _curAddress;
		}
		if (!this.ifInit && this.curAddress.name !== this.Areaaddress) {
			this.httpParams.city = this.curAddress.name;
			this.Areaaddress = this.curAddress.name;
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			this.getAuctionList();
		}
		if (this.ifInit || (!uni.getStorageSync('_curAddress')&&!this.rejectGetLoction)) {
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			console.log('0000')
			this.curAddressGet();
		}
	},
	onLoad(params) {
		// #ifdef MP-WEIXIN
		this.ifWEIXIN = true;
		// #endif
		let _ifReload = uni.getStorageSync('_ifReload');
		let _searchHistory = [];
		let that = this;
		uni.getStorage({
		    key: '_searchHistory',
		    success: function (res) {
		        _searchHistory = res.data;
				that.searchHistory = _searchHistory;
		    }
		});
	}
};
</script>
<style lang="scss" scoped>
.index {
	.search-box {
		display: flex;
		align-items: center;
		padding: 0 20upx;
		background: initial;
		position: absolute;
		top: 40upx;
		width: 100%;
		z-index: 2;
		.address-input {
			color: #fff;
			width: 100upx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			font-size: 28upx;
			padding-right: 30upx;
			background: url(../../static/image/down-white.png) no-repeat;
			background-position: right;
			background-size: 25upx;
		}
		.search-input {
			flex: 1;
		}
	}
	.search-focus-box {
		top: 50upx;
		background: #fff;
	}
	.wx-search-box{
		top: 0;
	}
	.wx-search-box.search-focus-box{
		top: 0;
		background: #fff;
	}
	.swiper-box,
	swiper {
		height: 400upx;
		image {
			width: 100%;
			height: 400upx;
		}
	}
	.asset-style {
		.image {
			width: 80upx;
			height: 80upx;
		}

		.text {
			font-size: 24upx;
			margin-top: 10upx;
		}
	}
	.status-box {
		display: flex;
		.scroll-view_H {
			white-space: nowrap;
			// width: 78%;
			width: 100%;
		}
		.scroll-view_H1 {
			// width: 70%;
			width: 100%;
		}

		.scroll-view-item {
			height: 80upx;
			line-height: 80upx;
			text-align: center;
		}

		.scroll-view-item_H {
			display: inline-block;
			margin: 0 20upx;
			height: 100upx;
			line-height: 100upx;
			text-align: center;
			position: relative;
			color: #666666;
		}
		.scroll-view-item_A {
			color: #333;
			.scroll-view-item_B {
				position: absolute;
				bottom: 38upx;
				height: 6upx;
				width: 100%;
				background: #32b381;
				z-index: -1;
			}
		}
	}
	.auction-list {
		padding: 6upx;
		padding-top: 0;
		min-height: 520upx;
		position: relative;
		background-color: inherit;
	}
	.recommend-list-box {
		margin-top: 10upx;
		.title {
			color: #323232;
			font-size: 30upx;
			padding: 30upx;
			padding-bottom: 0;
		}
		.more{
			color: #999;
			font-size: 30upx;
			display: flex;
			align-items: center;
			justify-content: center;
			image{
				width: 30upx;
				height: 24upx;
			}
			padding-bottom: 20upx;
		}
	}

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
	.search-history-box {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 150upx;
		left: 0;
		padding: 30upx;
		z-index: 5;
		.search-history {
			position: relative;
			z-index: 2;
			background: #fff;
			padding: 30upx 20upx;
			border-radius: 15upx;
			.search-history-title {
				display: flex;
				align-items: center;
				view {
					font-size: 32upx;
					flex: 1;
				}
				image {
					width: 28upx;
					height: 30upx;
				}
			}
			.search-history-content {
				display: flex;
				flex-wrap: wrap;
				view {
					padding: 8upx 28upx;
					margin: 10upx;
					background: #eee;
					color: #666;
					border-radius: 50upx;
				}
			}
		}
	}
	.wx-search-history-box{
		top: 90upx;
	}
	.popular-recommend-box {
		background: #fff;
		padding: 30upx;
		margin-bottom: 10upx;
		.p-r-title {
			display: flex;
			align-items: center;
			margin-bottom: 20upx;
			.hot-recommend-icon {
				width: 34upx;
				height: 42upx;
				margin-right: 10upx;
			}
			.title-text {
				flex: 1;
				display: flex;
				align-items: center;
			}
			.more {
				background: url(../../static/image/youjiantou@2x.png) no-repeat;
				background-size: 10upx 18upx;
				background-position: right;
				padding-right: 20upx;
				font-size: 26upx;
				color: #666;
			}
		}
		.p-r-content {
			display: flex;
			.pr-right,
			.pr-left {
				width: calc(50% - 5upx);
				.title-text {
					text-align: center;
					color: #666;
					font-size: 28upx;
				}
			}
			.pr-left {
				width: 350upx;
				height: 300upx;
				box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.08);
				border-radius: 10upx;
				.today-recommend {
					width: 100%;
					height: 100%;
				}
			}
			.super-value-assets,
			.newest {
				border-radius: 10upx;
				width: 340upx;
				height: 145upx;
				box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.08);
			}
			.super-value-assets image,
			.newest image {
				width: 100%;
				height: 100%;
			}
			.pr-right {
				margin-left: 10upx;
				.newest {
					margin-top: 10upx;
				}
				.super-value-assets,
				.newest {
				}
			}
		}
	}
}
</style>
