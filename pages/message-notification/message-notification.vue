<template>
	<view class="message-list">
		<view class="message-item" v-for="(item, index) in noticeList" :key="index" @click="goDetail(item.assetId)">
			<view class="title">
				<image src="../../static/image/xiaoxi@2x.png" class="notice-icon"></image>
				<text>通知：{{ item.title }}</text>
			</view>
			<view class="content">
				<view class="row" v-for="(val, key) in item.content" :key="key">{{ val.keyword }}：{{ val.content ? val.content :'--' }}</view>
			</view>
			<view class="open-detail">
				<view>查看详情</view>
				<image src="../../static/image/youjiantou@2x.png"></image>
			</view>
		</view>
		<view class="nodata" v-if="noticeList.length == 0">
			<image src="../../static/image/zanwushuju@2x.png"></image>
			<view>暂无数据</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			noticeList: [],
			params: {
				userId: ''
			}
		};
	},
	onLoad() {
		let user = {};
		uni.getStorage({
			key: 'userInfo',
			success: function(res) {
				user = res.data;
			}
		});
		let userId = user.id;
		this.params.userId = userId;
		this.getNoticeList();
	},
	methods: {
		/**
		 * 跳转详情
		 */
		goDetail(assetId) {
		    uni.navigateTo({
		      url: '../detail/detail?id=' + assetId
		    })
		},
		/**
		 * 获取数据列表
		 */
		getNoticeList() {
			uni.showLoading({
				title: '数据加载中...',
				mask: true
			});
			this.$http({
				url: '/notice/list',
				data: this.params
			})
				.then(res => {
					console.log('3333', res);
					res.data.forEach((item, index) => {
						let content = item.content ? JSON.parse(item.content) : [];
						item.content = content;
					});
					this.noticeList = res.data;
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.message-list {
	padding: 25upx;
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
			margin-top: 50upx;
		}
	}
	.message-item {
		border-radius: 5px;
		background: #fff;
		margin-bottom: 10upx;
	}
	.title {
		font-size: 28upx;
		margin-bottom: 10upx;
		color: #333;
		display: flex;
		align-items: center;
		padding: 20upx;
		padding-bottom: 0;
	}

	.notice-icon {
		width: 44upx;
		height: 44upx;
		margin-right: 10upx;
	}
	.title text {
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.content {
		margin-left: 30upx;
		font-size: 24upx;
		color: #666;
		padding: 0 40upx 40upx 40upx;
	}

	.row {
		/* height: 36upx */
		line-height: 36upx;
		/* overflow: hidden; */
		text-overflow: ellipsis;
		font-size: 28upx;
	}

	.icon-right {
		float: right;
		margin-right: 20upx;
		width: 30upx;
		height: 30upx;
	}
	.detail {
		background: #d9d9d9;
		border-radius: 0 0 10upx 10upx;
		height: 80upx;
		line-height: 80upx;
		padding-left: 50upx;
		color: #333;
	}
	.nodata {
		height: 50vh;
		background: #fff;
		text-align: center;
	}
	.nodata image {
		width: 331upx;
		height: 184upx;
		margin-top: 70upx;
	}
	.nodata view {
		color: #666;
		font-size: 26upx;
		margin-top: 20upx;
	}
	.open-detail {
		padding: 20upx 30upx;
		border-radius: 0 0 10upx 10upx;
		background: #D9D9D9;
		display: flex;
		align-items: center;
	}
	.open-detail view {
		font-size: 30upx;
		flex: 1;
	}
	.open-detail image {
		width: 14upx;
		height: 28upx;
	}
}
</style>
