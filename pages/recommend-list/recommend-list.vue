<template>
	<view class="recommend-list">
		<view class="uni-list auction-list">
			<view class="nodata" v-if="noData">
				<image src="../../static/image/zanwushuju@2x.png"></image>
				<view>暂无数据</view>
			</view>
			<list-item :auctionList="auctionList"></list-item>
		</view>
		<uni-load-more :status="status" :content-text="contentText" v-if="noMore" />
	</view>
</template>
<script>
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
import listItem from '../../components/list-item.vue';
export default {
	name: 'index',
	components: {
		uniLoadMore,
		listItem
	},
	data() {
		return {
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
			params: {
				type: '1',
				pageNo: 1,
				pageSize: 10,
				paging: true
			},
			auctionList: [],
		};
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
	onTabItemTap(item) {
	},
	methods: {
		/**
		 * 跳转详情
		 */
		goToDetail(id) {
			uni.navigateTo({
				url: '../detail/detail?id=' + id
			});
		},
		/**
		 * 获取数据列表
		 */
		getAuctionList(isDownRefresh) {
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			if (this.last_id) {
				//说明已有数据，目前处于上拉加载
				this.status = 'loading';
			}
			const httpParams = this.params;
			this.$http({
				url: '/asset/recommend',
				data: httpParams
			})
				.then(res => {
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
				})
				.catch(err => {
					this.noData = true;
					this.noMore = false;
					uni.hideLoading();
					if (isDownRefresh) uni.stopPullDownRefresh();
				});
		},
		/**
		 * 设置导航栏Title
		 */
		titleShow(type) {
			let content = "";
			switch (type) {
				case '1':
					content = "今日推荐";
					break;
				case '2':
					content = "超值资产";
					break;
				case '3':
				  content = "最新发布";
				  break;
			}
			uni.setNavigationBarTitle({
			  title: content
			})
		},
	},
	onLoad(params) {
		let type = params.type;
		this.params.type = type;
		this.titleShow(type);
		this.getAuctionList();
	}
};
</script>
<style lang="scss" scoped>
.recommend-list {
	.auction-list {
		margin-top: 20rpx;
		padding: 6upx;
		padding-top: 0;
		min-height: 520upx;
		position: relative;
		background-color: inherit;
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
}
</style>
