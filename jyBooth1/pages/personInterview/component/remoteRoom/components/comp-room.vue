<!--
 * @Description: 房间显示
 * @Date: 2022-03-16 17:40:28
 * @LastEditTime: 2022-03-29 16:13:06
-->
<template>
  <div class="rtc-container">
    <div class="changeBox" @click="exchangeWindow"></div>
    <div class="info-container" :class="exchange ? 'bigContent' : 'smallContent'">
      <!-- Log 展示区域 -->
      <div class="log-container" ref="logContainer" v-show="true">
        <p class="log-label">Log:</p>
        <div v-for="(item, index) in logList" :key="index">
          <span class="log-state" v-if="item.type === 'success'">🟩 </span>
          <span class="log-state" v-if="item.type === 'failed'">🟥 </span>
          <span>{{ item.log }}</span>
        </div>
      </div>

      <!-- 本地流区域 -->
      <div v-if="localStream" class="local-stream-container">
        <!-- 本地流播放区域 -->
        <div id="localStream" class="local-stream-content"></div>
        <!-- 本地流操作栏 -->
        <div v-if="isPlayingLocalStream" class="local-stream-control">
          <div class="video-control control">
            <span v-if="!isMutedVideo" @click="muteVideo">
              <svg-icon icon-name="video" class="icon-class"></svg-icon>
            </span>
            <span v-if="isMutedVideo" @click="unmuteVideo">
              <svg-icon icon-name="video-muted" class="icon-class"></svg-icon>
            </span>
          </div>
          <div class="audio-control control">
            <span v-if="!isMutedAudio" @click="muteAudio">
              <svg-icon icon-name="audio" class="icon-class"></svg-icon>
            </span>
            <span v-if="isMutedAudio" @click="unmuteAudio">
              <svg-icon icon-name="audio-muted" class="icon-class"></svg-icon>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 远端流区域 -->
    <div class="remote-container" :class="exchange ? 'smallContent' : 'bigContent'">
      <div v-if="remoteStreamList.length == 0" class="remote-nostream-container">
        <div>
          <div class="remote-nostream-container-box">
            <img :src="getRealImgUrl('img/personInterview/male.png')" alt=""/>
            <div>等待&lt;{{ communicator }}&gt;连接中...</div>
            <button @click="closeRoom">结束洽谈</button>
          </div>
        </div>
      </div>
      <div v-else v-for="item in remoteStreamList"
           :key="item.getUserId()"
           :id="item.getUserId()"
           class="remote-stream-container">

      </div>
    </div>
  </div>
</template>

<script>
import rtc from "./mixins/rtc.js";

export default {
  name: "compRoom",
  mixins: [rtc],
  props: {
    sdkAppId: Number,
    userId: String,
    roomId: Number,
    cameraId: String,
    microphoneId: String,
    userSig: String,
    communicator: String,
  },
  data() {
    return {
      logList: [{
        type: "success",
        log: "init"
      }],
      exchange: true,
    };
  },
  computed: {
    isReady() {
      return this.sdkAppId && this.userSig && this.userId && this.roomId;
    },
  },
  mounted() {
  },
  watch: {
    cameraId(val) {
      this.switchDevice("video", val);
    },
    microphoneId(val) {
      this.switchDevice("audio", val);
    },
    isReady(val) {
      if (val) {
        this.handleJoinRoom();
      }
    },
    remoteStreamList(val) {
    },
  },
  methods: {
    // 点击【Join Room】按钮
    async handleJoinRoom() {
      await this.initClient();
      await this.join();
      await this.initLocalStream();
      await this.playLocalStream();
      await this.publish();
    },

    // 点击【Publish】按钮
    async handlePublish() {
      await this.publish();
    },

    // 点击【Unpublish】按钮
    async handleUnpublish() {
      await this.unPublish();
    },

    // 点击【Leave Room】按钮
    async handleLeave() {
      await this.leave();
      // 关闭视频面试窗口
      this.$eventBus.$emit('closeVideoModal')
    },

    // 显示成功的 Log
    addSuccessLog(log) {
      this.logList.push({
        type: "success",
        log,
      });
      const {scrollHeight} = this.$refs.logContainer;
      this.$refs.logContainer.scrollTop = scrollHeight;
    },

    // 显示失败的 Log
    addFailedLog(log) {
      this.logList.push({
        type: "failed",
        log,
      });
      const {scrollHeight} = this.$refs.logContainer;
      this.$refs.logContainer.scrollTop = scrollHeight;
    },
    reportSuccessEvent(name) {
      // this.$aegis.reportEvent({
      //   name,
      //   ext1: `${name}-success`,
      //   ext2: "webrtcQuickDemoVue2",
      //   ext3: this.sdkAppId,
      // });
    },
    reportFailedEvent(name, error, type = "rtc") {
      // this.$aegis.reportEvent({
      //   name,
      //   ext1: `${name}-failed#${this.roomId}*${
      //     type === "share" ? this.shareUserId : this.userId
      //   }*${error.message}`,
      //   ext2: "webrtcQuickDemoVue2",
      //   ext3: this.sdkAppId,
      // });
    },
    // 大小窗切换
    exchangeWindow() {
      this.exchange = !this.exchange;
    },
    // 结束洽谈
    async closeRoom() {
      await this.handleLeave();
    },
  },

  activated() {

  },
  deactivated() {

  }
};
</script>

<style lang="less" scoped>
.rtc-container {
  width: 100%;
  height: 100%;
  position: relative;

  .changeBox {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 500;
    cursor: pointer;
  }

  .info-container {

    .log-container {
      position: absolute;
      z-index: 1000;
      padding: 10px;

      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow-y: auto;

      .log-label {
        font-weight: bold;
      }

      .log-state {
        display: inline-block;
        margin-right: 6px;
      }

      > div {
        font-size: 12px;
      }
    }

    .local-stream-container {
      width: 100%;
      height: 100%;
      position: relative;

      .local-stream-content {
        width: 100%;
        height: 100%;
      }

      .local-stream-control {
        position: absolute;
        width: 100%;
        height: 30px;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .control {
          margin-left: 10px;
        }

        .icon-class {
          color: #fff;
          cursor: pointer;
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .remote-container {
    z-index: 501 !important;

    .remote-stream-container,
    .remote-nostream-container {
      width: 100%;
      height: 100%;
      background: url("@/static/images/img/personInterview/male.png") no-repeat center;
      background-size: 100% 100%;

      > div {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        position: relative;

        > .remote-nostream-container-box {
          position: relative;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;

          > img {
            margin-bottom: 18px;
          }

          > div {
            margin-bottom: 12px;
            color: #fff;
            font-size: 16px;
            font-weight: bold;
          }

          > button {
            width: 100px;
            height: 32px;
            background: #fa0304;
            border-radius: 2px;
            color: #fff;
          }
        }
      }
    }
  }

  .label {
    margin: 14px 0 6px;
    text-align: left;
    font-weight: bold;
  }

  .smallContent {
    width: 320px;
    height: 240px;
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 300;
    border: 2px solid #666;
  }

  .bigContent {
    width: 100%;
    height: 100%;
  }
}
</style>
