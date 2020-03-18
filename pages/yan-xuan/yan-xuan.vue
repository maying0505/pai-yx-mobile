<template>
	<view class="yan-xuan">
		<!-- 搜索框 -->
		<view class="search-box" :class="ifWEIXIN ? 'wx-search-box':''">
			<view class="address-input" v-if="!ifSearch" @click="goCitySearch">{{ Areaaddress }}</view>
			<uni-search-bar
				placeholder="请输入标的物名称"
				class="search-input"
				radius="100"
				clearButton="auto"
				searchTextB="#F0F0F0"
				@confirm="searchConfirm"
				@input="searchInput"
				@cancel="searchCancel"
				@focus="searchFocus"
				@onfocus="searchOnfocus"
				ref="searchInputRef"
			/>
		</view>
		<view v-if="!ifSearch">
			<!-- 筛选 -->
			<view class="picker-box">
				<picker @change="changeSort" :value="sortIndex" :range="sortList" range-key="text" class="picker-item">
					<view class="picker-text">{{ sortIndex == 0 ? '排序' : sortList[sortIndex].text }}</view>
				</picker>
				<picker @change="changeType" :value="typeIndex" :range="typeList" range-key="text" class="picker-item">
					<view class="picker-text">{{ typeIndex == 4 ? '类型' : typeList[typeIndex].text }}</view>
				</picker>
				<picker @change="changeAuctionStage" :value="auctionStageIndex" :range="auctionStageList" range-key="text" class="picker-item">
					<view class="picker-text">{{ auctionStageIndex == 3 ? '拍卖/变卖' : auctionStageList[auctionStageIndex].text }}</view>
				</picker>
			</view>
			<!-- 状态筛选 -->
			<view class="status-box">
				<scroll-view class="scroll-view_H" :class="sortIndex != 0 ? 'scroll-view_H1' : ''" scroll-x="true">
					<view
						class="scroll-view-item_H"
						v-for="(val, key) in statusStyle"
						:key="key"
						:class="curStatusStyle === val.id ? 'scroll-view-item_A' : ''"
						@click="changeStatusStyle(val.id)"
					>
						<view class="scroll-view-item_B"></view>
						{{ val.name }}
					</view>
				</scroll-view>
			</view>
			<view class="uni-list auction-list">
				<view class="nodata" v-if="noData">
					<image src="../../static/image/zanwushuju@2x.png"></image>
					<view>暂无数据</view>
				</view>
				<list-item :auctionList="auctionList" v-if="!noData"></list-item>
			</view>
			<uni-load-more :status="status" :content-text="contentText" v-if="noMore && !noData" />
		</view>
		<view v-if="ifSearch">
			<view class="search-history-box" :class="ifWEIXIN ? 'wx-search-history-box':''" v-if="ifSearchFocus">
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
import { distincts, statusStyle, sortList, typeList, stageList } from '../../common/js/data.js';
import uniSearchBar from '../../components/uni-search-bar/uni-search-bar.vue';
import uniGrid from '../../components/uni-grid/uni-grid.vue';
import uniGridItem from '../../components/uni-grid-item/uni-grid-item.vue';
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
import listItem from '../../components/list-item.vue';
import amap from '../../common/js/amap-wx.js';
export default {
	name: 'index',
	components: {
		uniSearchBar,
		uniGrid,
		uniGridItem,
		uniLoadMore,
		listItem
	},
	data() {
		return {
			ifWEIXIN: false,
			amapPlugin: null,
			key: 'e705bbca07713526dea1b8395a7e36d0',//高德地图-微信小程序Key  
			curAddressSuccess: false,
			Areaaddress: '全国',
			typeList: typeList,
			typeIndex: 4,
			auctionStageList: stageList,
			auctionStageIndex: 3,
			sortList: sortList,
			sortIndex: 0,
			ifSearchFocus: false,
			searchHistory: [],
			noMore: false,
			status: 'more',
			contentText: {
				contentdown: '上拉加载更多',
				contentrefresh: '加载中',
				contentnomore: '没有更多'
			},
			last_id: '',
			noData: true,
			reload: true,
			statusStyle: statusStyle,
			curStatusStyle: -1,
			params: {
				sort: -1,
				type: -1,
				province: '',
				city: '',
				area: '',
				status: -1,
				stage: '',
				assetTitle: '',
				pageNo: 1,
				pageSize: 10
			},
			auctionList: [],
			ifSearch: false,
			curAddress: {name:'全国',parentName:'全国'},
			curGPS: {name:'全国',parentName:'全国'}
		};
	},
	/**
	 * 刷新
	 */
	onPullDownRefresh() {
		// // uni.startPullDownRefresh();
		// // uni.stopPullDownRefresh();
		this.last_id = '';
		this.reload = true;
		this.params.pageNo = 1;
		uni.showLoading({
			title: '数据加载中...',
			mask: true
		});
		this.getAuctionList(true);
	},
	onReachBottom() {
		if ((!this.noMore && !this.ifSearch) || (!this.noMoreSeacrh && this.ifSearch)) {
			return;
		}
		this.status = 'more';
		this.reload = false;
		this.params.pageNo = this.params.pageNo + 1;
		uni.showLoading({
			title: '数据加载中...',
			mask: true
		});
		this.getAuctionList();
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
		 * 类型选择
		 */
		changeType(event){
			this.typeIndex = event.detail.value;
			this.params.type = this.typeList[event.detail.value].id;
			this.last_id = '';
			this.reload = true;
			this.params.pageNo = 1;
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			this.getAuctionList();
		},
		/**
		 * 拍卖阶段选择
		 */
		changeAuctionStage(event){
			this.auctionStageIndex = event.detail.value;
			this.params.stage = this.auctionStageList[event.detail.value].id;
			this.last_id = '';
			this.reload = true;
			this.params.pageNo = 1;
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			this.getAuctionList();
		},
		/**
		 * 排序方式选择
		 */
		changeSort(event) {
			this.sortIndex = event.detail.value;
			this.params.sort = this.sortList[event.detail.value].id;
			this.reload = true;
			this.params.pageNo = 1;
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			this.getAuctionList();
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
			console.log(res);
			this.auctionList = [];
			this.noMore = false;
			this.noData = false;
			this.status = 'more';
			this.last_id = '';
			this.reload = true;
			this.params.assetTitle = res.value;
			this.params.pageNo = 1;
			this.ifSearchFocus = false;
			this.ifSearch = false;
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			this.getAuctionList();
			let searchHistoryB = this.searchHistory;
			if (searchHistoryB.indexOf(res.value) === -1 && res.value) {
				searchHistoryB.push(res.value);
				this.searchHistory = searchHistoryB;
				uni.setStorage({
					key: '_searchHistory',
					data: this.searchHistory
				})
				
			}
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
		},
		/**
		 * 搜索框focus
		 */
		searchOnfocus(res) {
			this.ifSearchFocus = res.searchFocus;
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
		 * 状态选择
		 */
		changeStatusStyle(id) {
			this.curStatusStyle = id;
			this.params.status = id;
			this.last_id = '';
			this.reload = true;
			this.params.pageNo = 1;
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			this.getAuctionList();
		},
		/**
		 * 获取数据列表
		 */
		getAuctionList(isDownRefresh) {
			if (this.last_id) {
				//说明已有数据，目前处于上拉加载
				this.status = 'loading';
			}
			const httpParams = this.params;
			console.log('httpParams',httpParams)
			this.$http({
				url: '/asset/list',
				data: httpParams
			})
				.then(res => {
					console.log(res)
					if (isDownRefresh) uni.stopPullDownRefresh();

					const auctionListB = res.data;
					this.auctionList = this.reload ? auctionListB : this.auctionList.concat(auctionListB);
					if (auctionListB && auctionListB.length > 0) {
						this.noData = false;
						if (auctionListB.length == this.params.pageSize) {
							this.noMore = true;
						} else {
							this.noMore = false;
						}
					} else {
						this.noMore = false;
						this.noData = this.reload ? true : false;
					}
					this.last_id = auctionListB[auctionListB.length - 1];
					this.status = 'more';
					uni.hideLoading();
					uni.removeStorageSync('_type');
					uni.removeStorageSync('_ifReload');
					uni.removeStorageSync('_typeIndex');
					uni.removeStorageSync('_assetTitle');
				})
				.catch(err => {
					this.noData = true;
					this.noMore = false;
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
			if (!uni.getStorageSync('_curAddress') || !uni.getStorageSync('_ifReload')) {
				this.params.province = province;
				this.params.city = city;
				this.Areaaddress = city;
				this.curAddress.name = city;
				this.curAddress.parentName = province;
				uni.setStorageSync('_curAddress',this.curAddress)
			}
			
			this.curGPS.name = city;
			this.curGPS.parentName = province;
			this.curAddressSuccess = true;
			this.getAuctionList();
		},
		curAddressGet(){
			let that = this;
			// #ifdef MP-WEIXIN
			console.log('jisjdfijsdf')
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
						uni.showToast({
							title: "您拒绝了定位,如需获取附近的拍品信息，请在设置为应用设置权限哦~",
							icon: "none"
						})
						that.getAuctionList();
					} );
			// #endif
		}
	},
	onShow() {
		let that = this;
		let _ifReload = uni.getStorageSync('_ifReload');
		let _type = uni.getStorageSync('_type');
		let _typeIndex = uni.getStorageSync('_typeIndex');
		let _assetTitle = uni.getStorageSync('_assetTitle');
		let _curAddress = uni.getStorageSync('_curAddress');
		let _historySearchCity = uni.getStorageSync('_historySearchCity') ? uni.getStorageSync('_historySearchCity') : [];
		if ((_type || _type == 0) &&  (_typeIndex || _typeIndex === 0)) {
			that.params.type = _type;
			that.typeIndex = _typeIndex;
		}
		if (_assetTitle) {
			that.params.assetTitle = _assetTitle;
			this.$refs.searchInputRef.searchValSet(_assetTitle)
		}
		if (_curAddress && _ifReload) {
			that.curAddress = _curAddress;
			that.Areaaddress = _curAddress.name;
			that.params.province = _curAddress.parentName === '全国' ? '' : _curAddress.parentName;
			that.params.city = _curAddress.name === '全国' ? '' : _curAddress.name;
			if (_historySearchCity.length > 0) {
				let ifEqule = false;
				for (let item of _historySearchCity) {
					if (item.name === _curAddress.name) {
						ifEqule = true;
					}
				}
				if (!ifEqule) {
					_historySearchCity.push(_curAddress)
				}
			} else {
				_historySearchCity.push(_curAddress)
			}
			uni.setStorageSync('_historySearchCity',_historySearchCity)
		}
		if (_ifReload) {
			this.auctionList = [];
			this.noMore = false;
			this.noData = false;
			this.status = 'more';
			this.last_id = '';
			this.reload = true;
			this.params.pageNo = 1;
			this.ifSearchFocus = false;
			this.ifSearch = false;
			if (this.curAddressSuccess) {
				uni.showLoading({
					title: '数据加载中...',
					mask: true
				});
				this.getAuctionList();
			} else {
				uni.showLoading({
					title: '数据加载中...',
					mask: true
				});
				this.curAddressGet();
			}
		}
	},
	onLoad(params) {
		// #ifdef MP-WEIXIN
		this.ifWEIXIN = true;
		// #endif
		if (!uni.getStorageSync('_ifReload')) {
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			this.curAddressGet();
		} 
		let that = this;
		let _searchHistory = [];
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
.yan-xuan {
	.search-box {
		display: flex;
		align-items: center;
		padding: 0 20upx;
		padding-top: 40upx;
		background: #fff;
		.address-input {
			color: #666;
			width: 100upx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			font-size: 28upx;
			padding-right: 30upx;
			background: url(../../static/image/xiala@2x.png) no-repeat;
			background-position: right;
			background-size: 25upx;
		}
		.search-input {
			flex: 1;
		}
	}
	.wx-search-box{
		padding-top: 0;
	}
	.asset-style {
		.image {
			width: 100upx;
			height: 100upx;
		}

		.text {
			font-size: 26upx;
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
		// .scroll-view_H1 {
		// 	// width: 70%;
		// 	width: 100%;
		// }

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
				bottom: 20upx;
				height: 6upx;
				border-radius:3upx;
				width: 100%;
				background: #CC9756;
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
	
	.search-list {
		padding-top: 20upx;
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
	.picker-box {
		display: flex;
		background: #FFFFFF;
		justify-content: space-around;
		.picker-item{
			// display: flex;
			// justify-content: center;
			.picker-text{
				// text-align: center;
				// width: 100%;
			}
		}
		.picker-item {
			display: flex;
			align-items: center;
			margin: 20upx 0;
			padding-left: 20upx;
			padding-right: 35upx;
			position: relative;
			background: url('../../static/image/picker-icon.png') no-repeat;
			background-size: 14upx 10upx;
			background-position: right;
		}
	}
	
	.popular-recommend-box{
		background: #fff;
		padding: 30upx;
		margin-bottom: 10upx;
		.p-r-title{
			display: flex;
			align-items: center;
			.title-text{
				flex: 1;
			}
			.more{
				background: url(../../static/image/youjiantou@2x.png) no-repeat;
				background-size: 10upx 18upx;
				background-position: right;
				padding-right: 20upx;
				font-size: 26upx;
				color: #666;
			}
		}
		.p-r-content{
			display: flex;
			.pr-right,.pr-left{
				width: calc(50% - 5upx);
				.title-text{
					text-align: center;
					color: #666;
					font-size: 28upx;
				}
			}
			.pr-left{
			}
			.pr-left,.super-value-assets,.newest{
				background: #EEEEEE;
				border-radius: 10upx;
				padding: 20upx;
				
			}
			.pr-right{
				margin-left: 10upx;
				.newest{
					margin-top: 10upx;
				}
				.super-value-assets,.newest{
					
				}
			}
		}
	}
}
</style>
