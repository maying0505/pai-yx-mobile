<template>
	<view>
		<view class="city-search-top">
			<uni-search-bar radius="100" placeholder="搜索城市名称" @cancel="searchDo" @focus="searchDo" @input="searchInput"/>
			<!-- <view class="search-city-box" @click="searchDo(true)">搜索城市名称</view> -->
			<view class="cur-city-box" v-if="!ifSearch">
				<view class="cur-city">当前：<text>{{curAddress.name}}</text></view>
				<view class="cur-GPS" @click="bindClick({item: curGPS})">GPS定位<text>{{curGPS.name}}</text></view>
			</view>
		</view>
		<uni-indexed-list v-if="!ifSearch" :options="list" :show-select="false" @click="bindClick" />
		<view v-if="ifSearch">
			<view class="search-content" v-if="searchVal && searchVal !== ' '">
				<view class="search-item" v-for="(item,index) in KJCity" :key="index" v-if="item.name.indexOf(searchVal) !== -1" @click="bindClick({item: item})">
					<rich-text :nodes="searchItemShow(item.name)"></rich-text>
				</view>
				<view class="search-no-data" v-if="searchNodata">抱歉，未找到相关位置，可尝试修改后重试</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import cityList from '../../common/js/cityList.js'
	import KJCity from '../../common/js/KJCity.js'
	import uniIndexedList from '../../components/uni-indexed-list/uni-indexed-list.vue'
	import uniSearchBar from '../../components/uni-search-bar-init/uni-search-bar.vue'
	export default {
		components: {
			uniIndexedList,
			uniSearchBar
		},
		data() {
			return {
				searchVal: '',
				list: cityList,
				KJCity: KJCity,
				curGPS: {},
				curAddress: {},
				ifSearch: false,
				searchNodata: true
			}
		},
		onLoad() {
			this.curGPS = uni.getStorageSync('_curGPS');
			this.curAddress = uni.getStorageSync('_curAddress');
			console.log('900900:',this.curAddress)
		},
		methods: {
			searchInput (e) {
				this.searchVal = e.value;
				this.searchNodata = true;
				if (this.searchVal) {
					for (let item of this.KJCity) {
						if (item.name.indexOf(this.searchVal) !== -1) {
							this.searchNodata = false;
						}
					}
				}
			},
			searchDo(e) {
				this.ifSearch = e.value;
			},
			/**
			 * 搜索筛选内容
			 */
			searchItemShow(name) {
				let keyContent = '<span class="search-key">'+this.searchVal+'</span>';
				let showContent = name.replace(this.searchVal,keyContent)
				return showContent
			},
			/**
			 * 搜索确认
			 */
			bindClick(e) {
				console.log('eeee::',e)
				uni.setStorageSync('_curAddress',e.item);
				uni.setStorageSync('_ifReload',true);
				uni.navigateBack()
				console.log('点击item，返回数据' + JSON.stringify(e))
			}
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #F5F5F5;
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}

	.example {
		padding: 0 30upx 30upx
	}

	.example-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		color: #464e52;
		padding: 30upx 30upx 30upx 50upx;
		margin-top: 20upx;
		position: relative;
		background-color: #fdfdfd;
		border-bottom: 1px #f5f5f5 solid
	}

	.example-title__after {
		position: relative;
		color: #031e3c
	}

	.example-title:after {
		content: '';
		position: absolute;
		left: 30upx;
		margin: auto;
		top: 0;
		bottom: 0;
		width: 6upx;
		height: 32upx;
		background-color: #ccc
	}

	.example .example-title {
		margin: 40upx 0
	}

	.example-body {
		padding: 30upx;
		background: #fff
	}

	.example-info {
		padding: 30upx;
		color: #3b4144;
		background: #fff
	}
	.city-search-top{
		background: #fff;
		padding-top: 20upx;
		border-top: 1px solid #F0F0F0;
	}
	.search-city-box{
		margin: 0 30upx;
		height:60upx;
		line-height: 60upx;
		background:rgba(240,240,240,1);
		border-radius:30upx;
		font-size: 24upx;
		color: #999;
		padding-left: 80upx;
		background: #F0F0F0 url(../../static/image/ic_search.png) no-repeat;
		background-position: 28upx 50%;
		background-size: 24upx;
	}
	.cur-city-box{
		display: flex;
		justify-content: space-between;
		padding: 20upx 30upx;
	}
	.cur-city,.cur-GPS{
		font-size: 30upx;
		color: #666;
	}
	.cur-city text{
		color: #333;
		font-size: 30upx;
	}
	.cur-GPS text{
		padding: 6upx 30upx;
		background:rgba(204,152,87,0.1) url(../../static/image/cur-GPS_icon.png) no-repeat;
		border-radius:25px;
		color: #CC9857;
		padding-left: 60upx;
		background-size: 24upx 30upx;
		background-position: 22upx 50%;
		margin-left: 10upx;
	}
	.search-key{
		color: #CC9857;
	}
	.search-content{
		background: #fff;
		border-top: 1px solid #f0f0f0;
		padding-left: 30upx;
	}
	.search-item{
		padding: 20rpx 0;
		border-bottom: 1px solid #f0f0f0;
		font-size: 24upx;
	}
	.search-no-data{
		padding: 20upx 0;
		font-weight: bold;
		font-size: 24upx;
	}
	.search-clear{
		padding-left: 20upx;
		font-size: 30upx;
	}
</style>