<template>
	<view class="recommend-list">
		<view class="uni-list-cell recommend-item" hover-class="uni-list-cell-hover" v-for="(item, index) in recommendList" :key="index" @click="goToDetail(item.id)">
			<view class="uni-media-list">
				<!-- <view class="auction-status" :class="'auction-status-' + item.status" v-if="item.status">{{ statusShow(item.status) }}</view> -->
				<image class="uni-media-list-logo auction-image" lazy-load="true" :src="item.cover ?  item.cover : '../../static/image/default-cover.png'"></image>
				<view class="uni-media-list-body">
					<view class="uni-media-list-text-top">{{ item.name ? item.name : '--' }}</view>
					<view class="uni-aution-status-stage">
						<view class="recommend-auction-status" :class="'auction-status-' + item.status">{{ $filter.statusShow(allStatus,item.status) }}</view>
						<view class="recommend-auction-stage">{{ $filter.stageShow(stageList,item.stage) }}</view>
					</view>
					<view class="uni-media-list-text-bottom uni-ellipsis">
						<view class="auction-amount">
							<view class="amount" v-if="item.status == 13">{{ item.finalPrice ? $filter.amountFormat(item.finalPrice) : '--' }}</view>
							<view class="amount" v-if="item.status != 13">{{ item.startintPrice ? $filter.amountFormat(item.startintPrice) : '--' }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import { allStatus,stageList } from '../common/js/data.js';
export default {
	name: 'recommend-item',
	props: {
		recommendList: Array
	},
	components: {},
	data() {
		return {
			stageList: stageList,
			allStatus:allStatus
		};
	},
	methods: {
		/**
		 * 对应状态名
		 */
		statusShow(id) {
			return allStatus[id];
		},
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
.recommend-list {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	padding: 30rpx;
	.recommend-item {
		width: 335upx;
		font-size: 30upx;
		border-radius: 10upx;
		background: #fff;
		margin-bottom: 10upx;
		box-shadow:0px 3px 7px 0px rgba(0, 0, 0, 0.08);
		border-radius:5px;
	}
	.uni-media-list{
		display: initial;
	}
	// .recommend-item:first-child {
	// 	padding-top: 0;
	// 	margin-top: 0;
	// }

	.uni-media-list {
		padding: 0;
	}

	.auction-image {
		position: relative;
		width:335upx;
		height:240upx;
		border-radius: 10upx 10upx 0 0;
	}

	.uni-media-list-body {
		height: auto;
		padding: 20upx;
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
		color: #313131;
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
	.uni-media-list-text-top{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		font-size: #323232;
		font-size: 24upx;
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
