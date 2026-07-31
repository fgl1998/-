<template>
    <div class="page">
        <!-- 岗位列表 -->
        <common-header></common-header>
        <div class="page-wrap">
            <div class="wrap-center">
                <div class="wrap-box">
                    <div id="AILink">
                        <iframe :src="iframeUrl" width="100%" height="100%" frameborder="0"
                            allow="camera *; microphone *" />
                    </div>
                </div>
            </div>
        </div>
        <common-footer :userName="userInfo.aac003" :isLogin="isLogin" @login="login"></common-footer>
        <!-- https://gajy.org.cn/kfmobile/ -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                iframeUrl: 'http://59.195.11.109:30001/znkfytj/#/?channelCode=jyyz', // 传入channelCode
                // iframeUrl: 'http://localhost:8080/#/?channelCode=jyyz',
                token: '',
            }
        },
        onShow() {

        },
        created() {
            this.token = uni.getStorageSync('setToken')
            this.userInfo = uni.getStorageSync("userInfo");
            if (this.userInfo) {
                this.isLogin = true;
            } else {
                this.isLogin = false;
            }
            if (this.token) {
                this.iframeUrl = this.iframeUrl + '&token=' + this.token
            }
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
    // .wrap-box {
    // 	border: 1px solid #A2A7A9;
    // }
    #AILink {
        width: 1760px;
        height: 760px;
        z-index: 1000;
    }
</style>