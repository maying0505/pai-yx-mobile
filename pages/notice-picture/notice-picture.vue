<template>
	<view class='pic-info' v-if="detailInfo">
		<rich-text :nodes="detailInfo"></rich-text>
	</view>
	<view v-else class="nodata">
		<image src="../../static/image/zanwushuju@2x.png"></image>
		<view>暂无数据</view>
	</view>
</template>

<script>
	import graceRichText from '@/components/richText.js';
	export default {
		data() {
			return {
				detailInfo: ""
			}
		},
		onLoad(options) {
			let type = options.type;
			this.getArticle(type);
		},
		methods: {
			getArticle(type) {
				let _detailContent = uni.getStorageSync('_detailContent') ? uni.getStorageSync('_detailContent') : {};
			    let content = "";
				let _detailInfo = '';
			    switch (type) {
					case "0":
						content = "标的物介绍";
						_detailInfo = _detailContent.html ? graceRichText.format(_detailContent.html) : '';
						break;
					case "1":
						content = "竞买公告";
						_detailInfo = _detailContent.announcement ? graceRichText.format(_detailContent.announcement) : '';
						break;
					case "2":
						content = "竞买须知";
						_detailInfo = _detailContent.notice ? graceRichText.format(_detailContent.notice) : '';
						break;
			    }
				if (_detailInfo) {
					this.detailInfo = _detailInfo;  
				}
				console.log('_detailInfo::',this.detailInfo)
			    uni.setNavigationBarTitle({
			      title: content
			    })
			},
		}
	}
</script>

<style lang="scss" scoped>
	.pic-info {
	  background:#fff;
	  padding: 20upx;
	  margin: 20upx 30upx;
	  border-radius: 10upx;
	  font-size: 24upx;
	  color: #666;
	  word-break: break-all;
	  image,img{
		  max-width: 100%!important;
		  height: 350upx;
		  margin: 10upx 0;
	  }
	  table{
		  max-width: 100%!important;
	  }
	}
	.nodata{
		text-align: center;
		height: 100vh;
		background: #fff;
		margin-top: 20upx;
		view{
			color: #666666;
			font-size: 28upx;
		}
		image{
			width: 331upx;
			height: 184upx;
			margin-top: 100upx;
		}
	}
</style>
