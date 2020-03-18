<template>
   <view class="update" v-if="isUpdate || isShow">
       <view class="container">
            <view class="infos">
                <image src="../../static/update-bg.png" class="logo" :lazy-load="true"></image>
                <view class="info">
                    <text class="strong">V{{ProVersion || version || '1.0.0'}}</text>
                    <text class="small">发现新版本</text>
                </view>
            </view>
            <!-- <view >
                更新了ui<br>
                更新了ui<br>
                更新了ui<br>
            </view> -->
            <rich-text class="contant" :nodes="ProInfos || infos"></rich-text>
            <navigator hover-class="none" :url="'/pages/web?url=' + download" class="base-btn">立即更新</navigator>
       </view>
   </view>
</template>
<script>
export default {
    name: 'update',
    props: {
        isShow: {
            type: Boolean,
            default: false,
        },
        ProVersion: {
            type: String,
            default: '',
        },
        ProInfos: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            isUpdate: false,
            version: '',//版本
            infos: '没有更新信息啦<br>反正就是更新啦',//版本信息
            download: '',//下载地址
        }
    },
    methods: {
        /**
         * 更新
         */
        $update() {
            const self = this;
            uni.getStorage({
                key: 'version',
                success(res) {
                    const version = res.data;
                    self.$http({
                        data: {
                            module: 'Start',
                            action: 'start',
                        }
                    }).then(data => {
                        const result = data.result || {};
                        const isIos = uni.getSystemInfoSync().platform === 'ios';
                        // console.log('isIos', isIos);
                        if (data.code === 200) {
                            self.infos = isIos ? result.iosVersionInfo : result.androidVersionInfo;
                            self.version = isIos ? result.iosVersionName : result.androidVersionName;
                            self.download = result.download || '';
                            // console.info('self.version', self.version, 'version', version);
                            if (self.version !== version) {
                                self.isUpdate = true;
                            }
                        }
                    }).catch(err => {
                    });
                }
            });
        }
    },
    onLoad() {
        this.$update();
    }
}
</script>
<style lang="scss" scoped>
@import '../common/styles/defin';
.update {
    position: fixed;
    left: 0;
    top: 0;
    @include flex;
    width: 100%;
    height: 100%;
    background-color: $uni-bg-color-mask;
    .container {
        @include flex;
        width: 551upx;
        background-color: #ffffff;
        border-radius: 10upx;
        overflow: hidden;
        .infos {
            position: relative;
            @include flex;
            width: 100%;
            .logo {
                @include flex;
                width: 100%;
                height: 294upx;
            }
            .info {
                position: absolute;
                left: 0;
                top: 0;
                @include flex;
                width: 100%;
                padding: 70upx 30upx 30upx;
                .strong,
                .small {
                    @include flex;
                    width: 100%;
                    align-items: flex-start;
                    @include font-size(30upx);
                    color: #D2D1E3;
                    font-weight: bold;
                }
                .strong {
                    font-family: 'DIN-Medium';
                    @include font-size(50upx);
                    margin-bottom: 20upx;
                }
            }
        }
        .contant {
            box-sizing: border-box;
            @include flex;
            width: 100%;
            padding: 30upx;
            align-items: flex-start;
            @include font-size(28upx, 2);
            color: #999999;
            font-weight: bold;
        }
        .base-btn {
            width: 491upx;
            margin: 20upx 0 50upx;
        }
    }
}
</style>

