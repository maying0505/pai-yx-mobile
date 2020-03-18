<template>
	<view class="upgrade" v-if="ifUpgrade">
		<view class="mask"></view>
		<view class="upgrade_box">
			<image src='../../static/image/upgrade.png' mode="widthFix" class="upgrade_icon"></image>
			<view class="upgrade_text">系统升级中，请稍后...</view>
		</view>
	</view>
</template>
<script>
export default {
    name: 'upgrade',
    props: {
       
    },
    data() {
        return {
            ifUpgrade: false,
        }
    },
    methods: {
        /**
         * 获取是否升级中
         */
        $upgradeDo() {
        	this.$http({
        		url: '/asset/wxupgrade',
        	}).then(res => {
        		this.ifUpgrade = !res.data;
        	}).catch(err => {
				
        	});
        },
    },
	mounted: function () {
		this.$upgradeDo();
	}
}
</script>
<style lang="scss" scoped>
.upgrade {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
	z-index: 5;
	.mask{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #333;
		opacity: 0.6;
		z-index: -1;
	}
	.upgrade_box {
		position: absolute;
		width: 450upx;
		padding: 30upx;
		text-align: center;
		background: #fff;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		border-radius: 15upx;
	}
    .upgrade_icon {
      width: 330upx;
	  height: 254upx;
      margin-top: 50upx;
    }
    
    .upgrade_text {
      text-align: center;
      margin-top: 50upx;
    }
}
</style>

