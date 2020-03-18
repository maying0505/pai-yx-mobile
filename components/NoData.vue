<template>
    <view class="no-data">
        <image src="/static/no-data.png" class="logo" :lazy-load="true"></image>
        <text class="title">没有找到数据啦...</text>
    </view>
</template>
<script>
export default {
    name: 'no-data'
}
</script>
<style lang="scss" scoped>
@import '../common/styles/defin';
.no-data {
    @include flex;
    width: 100%;
    padding: 100upx 30upx;
    .logo {
        @include flex;
        width: 371upx;
        height: 331upx;
    }
    .title {
        @include flex;
        width: 100%;
        margin-top: 39upx;
        font-family: 'PingFang-SC-Medium';
        @include font-size(30upx);
        color: #666666;
        font-weight: bold;
    }
}
</style>

