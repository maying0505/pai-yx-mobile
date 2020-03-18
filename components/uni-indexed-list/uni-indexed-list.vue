<template>
	<view class="uni-indexed">
		<scroll-view :scroll-into-view="scrollViewId" :style="{ height: winHeight + 'px' }" class="uni-indexed__list" scroll-y>
			<view class="history-city-box" v-if="historyCityList.length > 0">
				<view class="title">历史城市</view>
				<view class="history-city">
					<view v-for="(item,index) in historyCityList" :key="index" @click="onClick(item)">{{item.name}}</view>
				</view>
			</view>
			<view class="hot-city-box" id="uni-indexed-list-hot">
				<view class="title">热门城市</view>
				<view class="hot-city">
					<view v-for="(item,index) in hotCityList" :key="index" @click="onClick(item)">{{item.name}}</view>
				</view>
			</view>
			<block v-for="(list, idx) in lists" :key="idx">
				<view v-if="list.items && list.items.length > 0" :id="'uni-indexed-list-' + list.key" class="uni-indexed__list-title">{{ list.key }}</view>
				<view v-if="list.items && list.items.length > 0" class="uni-list">
					<view v-for="(item, index) in list.items" :key="index" class="uni-list-item" hover-class="uni-list-item--hover">
						<view class="uni-list-item__container" @click="onClick(item)">
							<view v-if="showSelect" style="margin-right: 20upx;">
								<uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'" :color="item.checked ? '#007aff' : '#aaa'" size="24" />
							</view>
							<view class="uni-list-item__content">{{ item.name }}</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		<view :class="touchmove ? 'active' : ''" class="uni-indexed__menu">
			<text :class="touchmoveIndex == -2 ? 'active' : ''" class="uni-indexed__menu-item" @touchstart="touchStart(-2)" @touchmove.stop.prevent="touchMove(-2)" @touchend="touchEnd(-2)">
				热
			</text>
			<text v-for="(list, key) in lists" :key="key" :class="touchmoveIndex == key ? 'active' : ''" class="uni-indexed__menu-item" @touchstart="touchStart(key)" @touchmove.stop.prevent="touchMove(key)" @touchend="touchEnd(key)">
				{{ list.key }}
			</text>
		</view>
		<view v-if="touchmove" class="uni-indexed--alert">{{ touchmoveIndex === -2 ? '热' : lists[touchmoveIndex].key }}</view>
	</view>
</template>
<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	import hotCityList from '../../common/js/hotCity.js'
	export default {
		name: 'UniIndexedList',
		components: {
			uniIcons
		},
		props: {
			options: {
				type: Array,
				default () {
					return []
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				hotCityList: hotCityList,
				historyCityList: [],
				lists: [],
				touchmove: false,
				touchmoveIndex: -1,
				itemHeight: 0,
				winHeight: 0,
				scrollViewId: ''
			}
		},
		watch: {
			options: {
				handler: function() {
					this.setList()
				},
				deep: true
			}
		},
		created() {
			console.log('_historySearchCity::',uni.getStorageSync('_historySearchCity'))
			if (uni.getStorageSync('_historySearchCity')) {
				this.historyCityList = uni.getStorageSync('_historySearchCity');
			}
			this.setList()
		},
		methods: {
			setList() {
				let winHeight = uni.getSystemInfoSync().windowHeight
				// this.itemHeight = winHeight / this.options.length
				this.winHeight = winHeight
				this.lists = this.options
				return
				console.log(this.options)
				this.lists = this.options.map(value => {
					// console.log(value)
					let items = value.data.map(item => {
						let obj = {}
						// for (let key in item) {
						obj['key'] = value.letter
						obj['name'] = item
						// }
						obj.checked = item.checked ? item.checked : false
						return obj
					})
					return {
						title: value.letter,
						key: value.letter,
						items: items
					}
				})
				console.log(this.lists)
			},
			touchStart(e) {
				this.touchmove = true
	
				// let pageY = e.touches[0].pageY
				// let index = Math.floor(pageY / this.itemHeight)
				let index = e;
				if (e == -2) {
					this.scrollViewId = 'uni-indexed-list-hot'
					this.touchmoveIndex = -2
					return
				}
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + item.key
					this.touchmoveIndex = index
				}
			},
			touchMove(e) {
				// let pageY = e.touches[0].pageY
				// let index = Math.floor(pageY / this.itemHeight)
				let index = e;
				if (e == -2) {
					this.scrollViewId = 'uni-indexed-list-hot'
					this.touchmoveIndex = -2
					return
				}
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = 'uni-indexed-list-' + item.key
					this.touchmoveIndex = index
				}
			},
			touchEnd() {
				this.touchmove = false
				this.touchmoveIndex = -1
			},
			onClick(item) {
				this.$emit('click', {
					item: item
				})
			}
		}
	}
</script>
<style>
	@charset "UTF-8";

	.uni-list {
		background-color: #fff;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column
	}

	.uni-list::after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #e5e5e5
	}

	.uni-list::before {
		position: absolute;
		z-index: 10;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #e5e5e5
	}

	.uni-list-item {
		font-size: 32upx;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center
	}

	.uni-list-item__container {
		padding: 24upx 30upx;
		width: 100%;
		box-sizing: border-box;
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	.uni-list-item__content {
		color: #666;
		font-size: 30upx;
	}

	.uni-list-item__container:after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 30upx;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #e5e5e5
	}

	.uni-indexed {
		display: flex;
		flex-direction: row
	}

	.uni-indexed__list {
		flex: 1;
		height: 100vh
	}

	.uni-indexed__list-title {
		padding: 10upx 30upx;
		line-height: 1.5;
		font-size: 24upx;
		color: #999;
	}

	.uni-indexed__menu {
		width: 64upx;
		/* height: 100vh; */
		background-color: transparent;
		display: flex;
		flex-direction: column;
		position: fixed;
		right: 0;
		top: calc(50% + 90upx);
		transform: translateY(-50%);
		z-index: 10;
	}

	.uni-indexed__menu.active {
		/* background-color: #c8c8c8 */
	}

	.uni-indexed__menu.active .uni-indexed__menu-item {
		color: #666
	}

	.uni-indexed__menu.active .uni-indexed__menu-item.active {
		color: #CC9857
	}

	.uni-indexed__menu-item {
		color: #666;
		font-size: 24upx;
		text-align: center;
	}

	.uni-indexed--alert {
		position: absolute;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		z-index: 20;
		width: 160upx;
		height: 160upx;
		left: 50%;
		top: 50%;
		margin-left: -80upx;
		margin-top: -80upx;
		border-radius: 80upx;
		text-align: center;
		font-size: 70upx;
		color: #fff;
		background-color: rgba(0, 0, 0, .5)
	}
	.history-city-box,.hot-city-box{
		padding: 20upx 30upx;
		padding-bottom: 0;
	}
	.hot-city-box{
		padding-top: 10upx;
	}
	.history-city-box .title,.hot-city-box .title{
		color: #999;
		font-size: 24upx;
	}
	.history-city-box .history-city,.hot-city-box .hot-city{
		padding: 20upx 0;
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 10upx;
	}
	.hot-city-box .hot-city{
		padding-bottom: 0;
	}
	.history-city-box .history-city view,.hot-city-box .hot-city view{
		padding: 20upx 70upx;
		font-size: 30upx;
		margin-right: 10upx;
		margin-bottom: 10upx;
		background: #fff;
	}
</style>