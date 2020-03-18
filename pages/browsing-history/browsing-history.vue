<template>
	<view class="browsing-history">
		<view class="uni-list auction-list">
			 <view class='nodata' v-if="noData">
			  <image src="../../static/image/zanwushuju@2x.png"></image>
			  <view>暂无数据</view>
			</view>
			<list-item :auctionList="auctionList" :ifAssetId="ifAssetId"></list-item>
		</view>
		<uni-load-more :status="status" :content-text="contentText" v-if="noMore" />
	</view>
</template>
<script>
import listItem from '../../components/list-item.vue';
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
export default {
	name: 'myBid',
	components: {
		listItem,
		uniLoadMore
	},
	data() {
		return {
			ifAssetId: true,
			noMore: false,
			status: 'more',
			contentText: {
				contentdown: '上拉加载更多',
				contentrefresh: '加载中',
				contentnomore: '没有更多'
			},
			last_id: '',
			reload: true,
			noData: true,
			auctionList: [],
			params: {
			  pageNo: 1,
			  pageSize: 10,
			  paging: true
			}
		}
	},
	onNavigationBarButtonTap(e) {
		if(e.index === 0) {
			uni.showLoading({
			    title: '清空中...',
			    mask: true,
			});
			this.$http({
				url: '/asset/history/deleteAll',
			}).then(res => {
				uni.showToast({
					title: '清空完成',
					icon: 'success'
				})
				this.noData = true;
				this.auctionList = [];
				this.noMore = false;
				uni.hideLoading();
				
			}).catch(err => {
				uni.hideLoading();
			});
		}
	},
	/**
	 * 刷新
	 */
	onPullDownRefresh() {
		this.last_id = '';
		this.reload = true;
		this.params.pageNo = 1;
		this.getAuctionList(true);
	},
	onReachBottom() {
		if (!this.noMore) {
			return;
		}
		this.status = 'more';
		this.reload = false;
		this.params.pageNo = this.params.pageNo + 1;
		this.getAuctionList();
	},
	onTabItemTap(item){
		// uni.setTabBarItem({
		// 	index: 0,
		// 	text: '首页'
		// });
	},
	methods: {
		/**
		 * 获取数据列表
		 */
		getAuctionList(isDownRefresh) {
			uni.showLoading({
			    title: '数据加载中...',
			    mask: true,
			});
			if (this.last_id) {
				//说明已有数据，目前处于上拉加载
				this.status = 'loading';
			}
			console.log('params',this.params)
			this.$http({
				url: '/asset/history/list',
				data: this.params
			}).then(res => {
				if (isDownRefresh) uni.stopPullDownRefresh();
				const auctionListB = res.data.data;
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
			}).catch(err => {
				this.noData = true;
				this.noMore = false;
				uni.hideLoading();
				if (isDownRefresh) uni.stopPullDownRefresh();
			});
		},
	},
	onLoad(params) {
		let that = this;
		let user = {};
		uni.getStorage({
		    key: 'userInfo',
		    success: function (res) {
		        user = res.data;
				let userId = user.id;
				that.params.userId = userId;
				that.getAuctionList();
		    }
		});
		
	}
}
</script>
<style lang="scss" scoped>
	.browsing-history{
		padding: 20upx 0;
		.auction-list {
		  padding:6upx;
		  padding-top: 0;
		  min-height: 520upx;
		  position: relative;
		  background-color: inherit;
		}
		.nodata{
			text-align: center;
			height: 50vh;
			background: #fff;
			view{
				color: #666666;
				font-size: 28upx;
			}
			image{
				width: 331upx;
				height: 184upx;
				margin-top: 70upx;
			}
		}
	}
</style>



