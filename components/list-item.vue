<template>
	<view class="list-item">
		<view class="uni-list-cell auction-item" hover-class="uni-list-cell-hover" v-for="(item, index) in auctionList" :key="index" @click="goToDetail(ifAssetId ? item.assetId: item.id)">
			<view class="uni-media-list">
				<!-- <view class="auction-status" :class="'auction-status-' + item.status" v-if="item.status">{{ $filter.statusShow(allStatus,item.status) }}</view> -->
				<image class="uni-media-list-logo auction-image" lazy-load="true" :src="item.cover ? item.cover : '../../static/image/default-cover.png'"></image>
				<view class="uni-media-list-body">
					<view class="uni-media-list-text-top">{{ item.name ? item.name : item.subjectMatterName ? item.subjectMatterName : '--' }}</view>
					<view class="uni-aution-status-stage">
						<view class="recommend-auction-status" :class="'auction-status-' + item.status">{{ $filter.statusShow(allStatus,item.status) }}</view>
						<view class="recommend-auction-stage">{{ $filter.stageShow(stageList,item.stage) }}</view>
					</view>
					<view class="uni-media-list-text-bottom uni-ellipsis">
						<view class="auction-amount">
							<view class="txt" v-if="item.status == 13">
								<br />
								成交价
							</view>
							<view class="amount" v-if="item.status == 13">{{ item.finalPrice ? $filter.amountFormat(item.finalPrice) : '--' }}</view>
							<view class="txt" v-if="item.status != 13">
								<br />
								起拍价
							</view>
							<view class="amount" v-if="item.status != 13">{{ item.startintPrice ? $filter.amountFormat(item.startintPrice) : '--' }}</view>
							<!-- <view class="book-btn book-btn1" v-if="item.status==9">
								<br/>预约
								<br/>看样
							  </view> -->
						</view>
						<view class="auction-time" v-if="item.status == 13">
							<br />
							<text>成交时间</text> {{ item.transactionTime ? item.transactionTime : '--' }}
						</view>
						<view class="auction-time" v-else>
							<br />
							<text>开拍时间</text> {{ item.auctionTime ? item.auctionTime : '--' }}
						</view>
					</view>
				</view>
			</view>
			<view class='bookcode' v-if="ifBook">
				<image src="../../static/image/ic_book_num.png"></image>
				预约号码：{{item.code}}
			</view>
		</view>
	</view>
</template>
<script>
import { allStatus, stageList } from '../common/js/data.js';
export default {
	name: 'list-item',
	props: {
		auctionList: Array,
		ifBook: Boolean,
		ifAssetId : Boolean
	},
	components: {},
	data() {
		return {
			allStatus: allStatus,
			stageList: stageList
		};
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
	},
	mounted: function() {}
};
</script>
<style lang="scss" scoped>
.list-item {
	.auction-item {
		font-size: 30upx;
		border-radius: 10upx;
		background: #fff;
		display: flex;
		min-height: 220upx;
		flex-direction: column;
		margin: 10upx;
	}
	.auction-item:first-child {
		margin-top: 0;
	}

	.uni-media-list {
		padding: 6upx;
		padding: 15upx;
	}
	
	.bookcode {
	  background: linear-gradient(90deg,rgba(226,193,153,1),rgba(204,151,86,1));
	  color: #fff;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  padding: 5upx 0;
	  font-size: 28upx;
	  width: 100%;
	  border-radius: 0 0 10upx 10upx;
	}
	
	.bookcode image{
	  width: 30upx;
	  height: 30upx;
	  margin-right: 10upx;
	}

	.auction-image {
		position: relative;
		width: 280upx;
		height: 220upx;
		border-radius: 8upx;
	}

	.uni-media-list-body {
		height: auto;
	}

	.auction-status {
		position: absolute;
		left: 10upx;
		top: 6upx;
		padding: 0 20upx;
		font-size: 24upx;
		color: #fff;
		background: rgba(0, 0, 0, 0.9);
		border-radius: 0 27upx 27upx 0;
		z-index: 2;
	}

	.auction-info {
		flex: 1;
		padding-left: 20upx;
		padding-top: 5upx;
	}

	.auction-title {
		color: #323232;
		font-size: 30upx;
		cursor: hand;
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.auction-amount {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.txt {
		font-size: 24upx;
		color: #666;
		width: 85upx;
		text-align: left;
		line-height: 30upx;
		margin-right: 30upx;
	}

	.amount {
		font-size: 48upx;
		color: #333;
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.book-btn {
		position: absolute;
		top: 0;
		right: -10upx;
		width: 66upx;
		height: 60upx;
		line-height: 30upx;
		font-size: 24upx;
		background: #fe7073;
		padding: 15upx 0;
		text-align: center;
		color: #fff;
	}

	.auction-time {
		font-size: 20upx;
		color: #666;
		text{
			font-size: 20upx;
			margin-right: 10upx;
		}
	}

	.auction-status-18 {
		background-image: linear-gradient(to right, #7e7e7e, #4f4f4f);
	}

	.auction-status-9 {
		background-image: linear-gradient(to right, #62cc67, #25b28f);
	}

	.auction-status-8,
	.auction-status-10,
	.auction-status-14,
	.auction-status-15,
	.auction-status-16,
	.auction-status-7 {
		background-image: linear-gradient(to right, #fb6f5b, #f94554);
	}
	.auction-status-11 {
		background-image: linear-gradient(to right, #ffb86c, #ff9a6d);
	}
	.auction-status-12 {
		background-image: linear-gradient(to right, #fb6f5b, #f94554);
	}
	.auction-status-13 {
		background-image: linear-gradient(to right, #44ccfe, #1ea5f2);
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
	.uni-aution-status-stage{
		display: flex;
		margin-top: 10upx;
		view{
			border-radius:15px;
			font-size: 18upx;
			padding: 2upx 20upx;
		}
		.recommend-auction-status{
			color: #fff;
			margin-right: 10upx;
		}
		.recommend-auction-stage{
			color: #676767;
			background: #E6E6E6;
		}
	}
}
</style>
