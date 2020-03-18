<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(params) {
			this.url = decodeURIComponent(params.url);
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
