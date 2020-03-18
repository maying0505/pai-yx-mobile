<template>
	<view class="uni-searchbar">
		<view :class="show?'':'hide'" class="uni-searchbar-form">
			<view :style="{borderRadius:radius+'upx'}" class="uni-searchbar-form__box">
				<uni-icons :color="'#999999'" class="icon-search" type="search" size="18" />
				<input :placeholder="placeholder" @blur="onblur" :focus="show" @focus="onfocus" v-model="searchVal" class="search-input" type="text" placeholder-style="color:#cccccc" confirm-type="search" @confirm="confirm">
				<uni-icons :color="'#999999'" v-if="clearButton==='always'||clearButton==='auto'&&searchVal!==''" class="icon-clear" type="clear" size="24" @click="clear" />
			</view>
			<view :style="{borderRadius:radius+'upx',background: searchTextB}" class="uni-searchbar-form__text" @click="searchClick">
				<uni-icons color="#999999" class="icon-search" type="search" size="18" />
				<text class="placeholder" v-if="!confirmVal">{{ placeholder }}</text>
				<text class="search-value" v-if="confirmVal">{{ confirmVal }}</text>
				<uni-icons :color="'#999999'" v-if="confirmVal" class="icon-clear" type="clear" size="24" @click.native.stop="clearConfirmVal" />
			</view>
			<text v-if="!ifSearchValue && show" class="uni-searchbar-form__cancel" @click="cancel" :style="{color: cancelColor}">取消</text>
			<text v-if="ifSearchValue && show" class="uni-searchbar-form__confirm" @click="confirm">搜索</text>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue'
	export default {
		name: 'UniSearchBar',
		components: {
			uniIcons
		},
		props: {
			searchTextB: {
				type: String,
				default: '#fff'
			},
			cancelColor: {
				type: String,
				default: '#333'
			},
			placeholder: {
				type: String,
				default: '搜索'
			},
			radius: {
				type: [Number, String],
				default: 10
			},
			clearButton: {
				type: String,
				default: 'auto'
			}
		},
		data() {
			return {
				ifSearchValue: false,
				show: false,
				searchVal: '',
				confirmVal: ''
			}
		},
		watch: {
			searchVal() {
				if (this.searchVal === '') {
					this.ifSearchValue = false
				} else {
					this.ifSearchValue = true
				}
			}
		},
		methods: {
			searchValSet(item){
				console.log('909090',item)
				this.confirmVal = item;
			},
			searchValChange(item){
				this.searchVal = item;
				this.confirm();
			},
			searchClick() {
				console.log('--------')
				this.$emit('focus', {
					ifSearch: true
				})
				this.searchVal = '';
				this.show = true
			},
			onfocus(){
				this.$emit('onfocus', {
					searchFocus: true
				})
			},
			onblur(){
				// this.$emit('onfocus', {
				// 	searchFocus: false
				// })
			},
			clear() {
				this.searchVal = ''
			},
			clearConfirmVal() {
				this.searchVal = '';
				this.confirm();
			},
			cancel() {
				this.$emit('cancel', {
					ifSearch: false
				})
				this.searchVal = ''
				this.show = false
			},
			confirm() {
				this.show = false;
				this.confirmVal = this.searchVal;
				this.$emit('confirm', {
					value: this.searchVal,
				})
			}
		}
	}
</script>

<style>
	@charset "UTF-8";

	.uni-searchbar-form {
		position: relative;
		display: flex;
		padding: 15upx;
		width: 100%;
		box-sizing: border-box
	}

	.uni-searchbar-form__box {
		display: flex;
		flex: 1;
		align-items: center;
		width: 100%;
		height: 64upx;
		color: #c8c7cc;
		background: #eee;
		border-radius: 30upx;
		padding-left: 20upx;
	}

	.uni-searchbar-form__box .icon-search {
		color: #c8c7cc;
		line-height: 24px;
		padding: 0upx 10upx 0upx 10upx
	}

	.uni-searchbar-form__box .search-input {
		flex: 1;
		font-size: 28upx;
		height: 64upx;
		line-height: 64upx;
		color: #333;
		padding: 10upx 0;
	}

	.uni-searchbar-form__box .icon-clear,.uni-searchbar-form__text .icon-clear {
		color: #c8c7cc;
		line-height: 20px;
		padding: 0upx 15upx 0upx 10upx
	}
	
	.uni-searchbar-form__text .icon-clear {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.uni-searchbar-form__text {
		display: flex;
		flex: 1;
		align-items: center;
		width: 100%;
		height: 64upx;
		text-align: center;
		color: #c8c7cc;
		border-radius: 30upx;
		display: none;
		position: relative;
	}

	.uni-searchbar-form__text .icon-search {
		height: 35upx;
		line-height: 35upx;
		margin-left: 15upx;
	}

	.uni-searchbar-form__text .placeholder {
		display: inline-block;
		font-size: 24upx;
		color: #999999;
		margin-left: 10upx
	}
	.uni-searchbar-form__text .search-value {
		display: inline-block;
		font-size: 24upx;
		margin-left: 10upx;
		color: #333;
	}

	.uni-searchbar-form__cancel {
		width:140upx;
		height:64upx;
		text-align: center;
		line-height: 64upx;
		margin-left: 20upx;
		color: #333;
		white-space: nowrap;
		font-size: 30upx;
	}
	
	.uni-searchbar-form__confirm{
		width:140upx;
		height:64upx;
		text-align: center;
		line-height: 64upx;
		background:linear-gradient(90deg,rgba(226,193,153,1),rgba(204,151,86,1));
		border-radius:30upx;
		white-space: nowrap;
		font-size: 30upx;
		margin-left: 20upx;
		color: #fff;
	}

	.uni-searchbar-form.hide .uni-searchbar-form__box {
		display: none
	}

	.uni-searchbar-form.hide .uni-searchbar-form__text {
		text-align: inherit;
		display: block
	}

	.uni-searchbar-form.hide .uni-searchbar-form__cancel {
		display: none
	}
	.list-msg2 {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  padding: 0 10upx;
	  font-size: 28upx;
	  color: #333;
	}
	
	.list-msg2 .line{
		width: 2upx;
		height: 30upx;
		background: #BEBEBE;
		margin-left: 10upx;
	}
	
	.list-msg2 image {
	  height: 16upx;
	  width: 26upx;
	  margin: 0 10upx;
	}
</style>