<template>
  <div class="customer-service h5-page">
    <div class="official-wrapper">
      <div class="official guess-wrapper">
        <div class="guess">猜你想问</div>
        <div class="guess-con">
          <block v-for="(item, index) in guessArr" :key="index">
            <div class="item" @click="handleClickGuessItem(item)">
              {{ item }}
            </div>
          </block>
        </div>
      </div>
    </div>

    <block v-for="item in chatRecord" :key="item.id">
      <div class="private-wrapper" v-if="item.type === 'private'">
        <div class="iconimg"></div>
        <div class="private">{{ item.content }}</div>
      </div>
      <div class="official-wrapper" v-else>
        <div class="official">
          <div class="iconimg"></div>
          <div class="text" v-if="item.contentType == 'text'">
            {{ item.content }}
          </div>
          <!-- 地市智能咨询可以在发放系统配置时 -->
          <div
            class="items"
            v-if="item.contentType == 'array' && !smartConsultingNoYGFF"
          >
            <block
              v-for="(itemContent, indexContent) in item.content"
              :key="indexContent"
            >
              <div class="items-title d-f ai-c">
                <div class="iconimg"></div>
                <div>{{ itemContent.title }}</div>
              </div>
              <div
                class="item"
                :class="['item-' + itemContent.type]"
                v-for="(itemList, indexList) in itemContent.list"
                :key="indexList"
                @click="handleClickItem(itemList)"
              >
                <block v-if="itemContent.type == '1'">
                  <div class="link-text">{{ itemList.name }}</div>
                  <div class="iconimg"></div>
                </block>
                <block v-if="itemContent.type == '2'">
                  <div class="item-question">
                    {{ itemList.name }}
                  </div>
                  <div class="item-answer">
                    答：{{ itemList.value || "暂无回答" }}
                  </div>
                </block>
                <block v-if="itemContent.type == '3'">
                  {{ itemList.name }}
                </block>
                <block v-if="itemContent.type == '4'">
                  <div class="item-name d-f ai-c">
                    {{ itemList.value.chi031_desc || "暂无" }}
                  </div>
                  <div class="cell-wrapper">
                    <div class="cell d-f ai-c jc-sb">
                      <div class="key">发放单位</div>
                      <div class="value">
                        {{ itemList.value.chi037_desc || "暂无" }}
                      </div>
                    </div>
                    <div class="cell d-f ai-c jc-sb">
                      <div class="key">发放状态</div>
                      <div
                        class="value tag"
                        :class="[itemList.value.state === '1' ? 'ed' : '']"
                      >
                        {{ itemList.value.state_desc || "暂无" }}
                      </div>
                    </div>
                    <div class="cell d-f ai-c jc-sb amount">
                      <div class="key">发放金额</div>
                      <div class="value amount">
                        {{
                          itemList.value.aae019
                            ? itemList.value.aae019 + "元"
                            : "暂无"
                        }}
                      </div>
                    </div>
                    <div class="cell d-f ai-c jc-sb">
                      <div class="key">发放日期</div>
                      <div class="value">
                        {{ itemList.value.chb204 || "暂无" }}
                      </div>
                    </div>
                    <div class="cell d-f ai-c jc-sb">
                      <div class="key">发放期号</div>
                      <div class="value">
                        {{ itemList.value.aae209 || "暂无" }}
                      </div>
                    </div>
                  </div>
                </block>
              </div>
            </block>
          </div>
          <!-- 地市智能咨询不能在发放系统配置时，走审批调发放拿数据 -->
          <div
            class="items"
            v-if="item.contentType == 'array' && smartConsultingNoYGFF"
          >
            <block
              v-for="(itemContent, indexContent) in item.content"
              :key="indexContent"
            >
              <div class="items-title d-f ai-c">
                <div class="iconimg"></div>
                <div>{{ itemContent.title }}</div>
              </div>
              <div
                class="item"
                :class="['item-' + itemContent.type]"
                v-for="(itemList, indexList) in itemContent.list"
                :key="indexList"
                @click="handleClickItem(itemList)"
              >
                <block v-if="itemContent.type == '1'">
                  <div class="link-text">{{ itemList.name }}</div>
                  <div class="iconimg"></div>
                </block>
                <block v-if="itemContent.type == '2'">
                  <div class="item-question">
                    {{ itemList.name }}
                  </div>
                  <div class="item-answer">
                    答：{{ itemList.value || "暂无回答" }}
                  </div>
                </block>
                <block v-if="itemContent.type == '3'">
                  {{ itemList.name }}
                </block>
                <block v-if="itemContent.type == '4'">
                  <div class="item-name d-f ai-c">
                    {{ itemList.chi031_desc || "暂无" }}
                  </div>
                  <div class="cell-wrapper">
                    <div class="cell d-f ai-c jc-sb">
                      <div class="key">发放单位</div>
                      <div class="value">
                        {{ itemList.chi037_desc || "暂无" }}
                      </div>
                    </div>
                    <div class="cell d-f ai-c jc-sb">
                      <div class="key">发放状态</div>
                      <div
                        class="value tag"
                        :class="[itemList.state === '1' ? 'ed' : '']"
                      >
                        {{ itemList.state_desc || "暂无" }}
                      </div>
                    </div>
                    <div class="cell d-f ai-c jc-sb amount">
                      <div class="key">发放金额</div>
                      <div class="value amount">
                        {{ itemList.aae019 ? itemList.aae019 + "元" : "暂无" }}
                      </div>
                    </div>
                    <div class="cell d-f ai-c jc-sb">
                      <div class="key">发放日期</div>
                      <div class="value">
                        {{ itemList.chb204 || "暂无" }}
                      </div>
                    </div>
                    <div class="cell d-f ai-c jc-sb">
                      <div class="key">发放期号</div>
                      <div class="value">
                        {{ itemList.aae209 || "暂无" }}
                      </div>
                    </div>
                  </div>
                </block>
              </div>
            </block>
          </div>
        </div>
      </div>
    </block>

    <div
      class="recording"
      @longpress="handleStartRecord"
      @touchend="handleStopRecord"
      :class="[isStartRecord ? 'active' : '']"
    >
      <div class="iconimg"></div>
      <div class="tip-text">{{ isStartRecord ? "松开发送" : "按住说话" }}</div>
    </div>
  </div>
</template>
<script>
/* #ifdef MP-ALIPAY */
const pluginAVoice = requirePlugin("aVoice");
/* #endif */

/* #ifdef MP-WEIXIN */
const plugin = requirePlugin("WechatSI");
const pluginAVoice = plugin.getRecordRecognitionManager();
/* #endif */

import { showModal, showLoading, hideLoading } from "@/utils/uni-api"; // 封装过后的api，推荐使用。方便以后统一修改，便于维护。
import {
  requestWXGetZnzxAnswer,
  requestWXGetAlipayToken,
  requestB150,
} from "@/service/api";
import { previewPDFWeixin } from "@/utils/custom-api";

import config from "@/config";

import { USER_INFO } from "@/store/constants"; // 常量
import { mapGetters } from "vuex";

export default {
  name: "pageCustomerService",
  data() {
    return {
      // 猜你想问列表
      guessArr: [
        "我的补贴到账了吗？",
        "如何申报生态护林员补助？",
        "如何申报雨露计划职业教育补助资金？",
      ],
      // guessArr: [
      //   {
      //     id: '1',
      //     idCard: '510902199507236534',
      //     name: '独生子女父母奖励金怎么申请？',
      //   },
      //   {
      //     id: '2',
      //     idCard: '510902199507236534',
      //     name: '我的高龄津贴到账了吗？',
      //   },
      //   { id: '3', idCard: '510722196709042835', name: '攀枝花' },
      //   {
      //     id: '4',
      //     idCard: '511002196609244111',
      //     name: '我的补贴到账了吗',
      //   },
      //   { id: '5', idCard: '510722196709042835', name: '哈哈哈' },
      //   {
      //     id: '6',
      //     idCard: '511002196609244111',
      //     name: '我的补贴到账了吗',
      //   },
      //   {
      //     id: '7',
      //     idCard: '511002196609244111',
      //     name: '城市最低生活保障金',
      //   },
      //   {
      //     id: '8',
      //     idCard: '511002196609244111',
      //     name: '补贴',
      //   },
      // ],
      // 聊天记录
      chatRecord: [
        // {
        //   id: '1',
        //   type: 'private',
        //   content:
        //     '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
        //   contentType: 'text',
        // },
        // { id: '2', type: 'private' ,content: ''},
      ],
      // 语音识别数据
      token: "", // 支付宝语音识别 token
      time: 0, // 录制时间
      timer: null, // 定时器 控制
      isStartRecord: false, // 是否开始录音
      smartConsultingNoYGFF: false, // 智能咨询是否无法在发放系统配置
    };
  },
  onLoad(e) {
    const { customerServiceGuess, smartConsultingNoYGFF } = config;
    this.smartConsultingNoYGFF = smartConsultingNoYGFF;
    if (customerServiceGuess && customerServiceGuess.length > 0) {
      this.guessArr = [...customerServiceGuess];
    } else {
      showModal(
        "请在config/ykt/地市行政区划编码.js文件中配置customerServiceGuess，具体参考内江地市文件，配置完成后请提交代码！！"
      );
    }
  },
  onShow() {
    /* #ifdef MP-ALIPAY */
    this.handleCheckCanIUsePlugin();
    /* #endif */
  },
  onReady() {
    /* #ifdef MP-WEIXIN */
    // 有新的识别内容返回，则会调用此事件
    pluginAVoice.onRecognize = (res) => {
      // console.log('有新的识别内容返回，则会调用此事件', res)
    };
    // 识别结束事件
    pluginAVoice.onStop = (res) => {
      // console.log('识别结束事件', res)
      this.stopRecord(res);
    };
    // 正常开始录音识别时会调用此事件
    pluginAVoice.onStart = (res) => {
      // console.log('成功开始录音识别', res)
    };
    // 识别错误事件
    pluginAVoice.onError = (res) => {
      // console.error('识别错误事件', res)
      hideLoading();
      const { retcode } = res;
      this.handleWechatSpeechRecognitionError(retcode);
    };
    /* #endif */
  },
  onHide() {},
  methods: {
    // 预览政策文件
    reviewPDF(chi050) {
      previewPDFWeixin(chi050, "pdf", "file.pdf", false, true);
    },
    /* // 地址页面跳转
    jumpRoute(value) {
      if (!value) {
        return
      }
      // value =
      //   '/pages/packageDeclareNeijiang/declare-20002/declare-20002?chi031=20002&chi031_desc=独生子女&declareType=01'
      uni.navigateTo({
        url: value,
        success(res) {
          // console.log(res);
        },
        fail(err) {},
      })
    }, */
    // 停止录音
    stopRecord(res) {
      const { result, duration } = res;
      if (result) {
        this.updateChatRecord("private", result);
        this.requestGetZnzxAnswer(result);
      } else {
        hideLoading();
      }
    },
    // 更新 chatRecord [type => private 咨询者 official 回答者; data 数据,contentType=> text 文本 array 列表]
    updateChatRecord(type, data, contentType = "text") {
      const newChatRecord = [...this.chatRecord];
      newChatRecord.push({
        id: "cs_" + +new Date(),
        content: data,
        contentType,
        type,
      });
      this.chatRecord = [...newChatRecord];
      // console.log('newChatRecord', newChatRecord)
    },
    // 判断数据类型
    isType(data, type) {
      const typeObj = {
        "[object String]": "string",
        "[object Number]": "number",
        "[object Boolean]": "boolean",
        "[object Null]": "null",
        "[object Undefined]": "undefined",
        "[object Object]": "object",
        "[object Array]": "array",
        "[object Function]": "function",
        "[object Date]": "date", // Object.prototype.toString.call(new Date())
        "[object RegExp]": "regExp",
        "[object Map]": "map",
        "[object Set]": "set",
        "[object HTMLDivElement]": "dom", // document.querySelector('#app')
        "[object WeakMap]": "weakMap",
        "[object Window]": "window", // Object.prototype.toString.call(window)
        "[object Error]": "error", // new Error('1')
        "[object Arguments]": "arguments",
      };
      let name = Object.prototype.toString.call(data); // 借用 Object.prototype.toString()获取数据类型
      let typeName = typeObj[name] || "未知类型"; // 匹配数据类型
      return typeName === type; // 判断该数据类型是否为传入的类型
    },
    // 请求 支付宝token
    requestGetAlipayToken() {
      requestWXGetAlipayToken()
        .then((res) => {
          const { token } = res;
          if (token) {
            this.token = token;
          }
        })
        .catch((err) => {});
    },
    // 检测支付宝端 手机能否使用该插件
    handleCheckCanIUsePlugin() {
      const tag = pluginAVoice.canIUse();
      if (!tag) {
        showModal("检测到您的支付宝不支持该插件，请升级支付宝！");
      } else {
        this.requestGetAlipayToken();
      }
    },
    // 请求智能咨询
    requestGetZnzxAnswer(question) {
      showLoading("咨询中");
      const { idCard, user_id } = this.userInfo;
      if (this.smartConsultingNoYGFF) {
        this.requestB150GetZnzxAnswer(idCard, user_id, question);
      } else {
        this.requestFFGetZnzxAnswer(idCard, user_id, question);
      }
    },
    requestFFGetZnzxAnswer(idCard, user_id, question) {
      requestWXGetZnzxAnswer(idCard, user_id, question, false)
        .then((res) => {
          let { status, data, message } = res.output;

          switch (status) {
            case "01":
              this.updateChatRecord("official", message);
              break;
            case "02":
              this.updateChatRecord("official", message);
              break;
            case "10":
              let arr = ["申报入口", "问答", "政策文件", "发放记录"];

              let obj = {
                id: "cs_" + +new Date(),
                type: "official",
                content: "暂无相关信息",
              };

              const dataList = [];
              for (let key in data) {
                let type = "";
                let value = data[key];
                let row = value.row;
                let tempObj = {
                  title: key,
                  status,
                  list: [],
                };
                // row 是对象
                if (this.isType(row, "object")) {
                  type = row.type;
                  tempObj.list = [row];
                }
                // row 是数组
                if (this.isType(row, "array")) {
                  type = row[0].type;
                  tempObj.list = row;
                }
                tempObj.type = type;
                dataList.push(tempObj);
              }

              // console.log('dataList => ', dataList)

              this.updateChatRecord("official", dataList, "array");
              break;
            default:
              this.updateChatRecord("official", "该回答类型暂未处理！");
              break;
          }
        })
        .catch((err) => {
          this.updateChatRecord("official", "暂无相关信息");
        })
        .finally(() => {
          hideLoading();
        });
    },
    // 通过B150调发放系统拿数据
    requestB150GetZnzxAnswer(idCard, user_id, question) {
      requestB150(idCard, user_id, question, false)
        .then((res) => {
          const { status, message, lists } = res;
          // 这里必须使用var声明，否则后续无法读取到相应的变量名
          if (lists) {
            var { acceptEntranceList, answerList, hi05List, hb01List } = lists;
          }

          switch (status) {
            case "01":
              this.updateChatRecord("official", message);
              break;
            case "02":
              this.updateChatRecord("official", message);
              break;
            case "10":
              // 审批无法解析发放查询过来的数据，所以返回值有四种情况
              if (hb01List || acceptEntranceList || answerList || hi05List) {
                let list = [];
                let title = "";
                if (hb01List) {
                  list = hb01List.list;
                  title = "发放记录";
                } else if (acceptEntranceList) {
                  list = acceptEntranceList.list;
                  title = "申报入口";
                } else if (answerList) {
                  list = answerList.list;
                  title = "问答";
                } else {
                  list = hi05List.list;
                  title = "政策文件";
                }
                if (list.length > 0) {
                  const dataList = [
                    {
                      title,
                      status,
                      list: [],
                    },
                  ];
                  list.forEach((item) => {
                    dataList[0].list.push({ ...item });
                    dataList[0].type = item.type;
                  });
                  this.updateChatRecord("official", dataList, "array");
                }
              }
              break;
            default:
              this.updateChatRecord("official", "该回答类型暂未处理！");
              break;
          }
        })
        .catch((err) => {
          this.updateChatRecord("official", "暂无相关信息");
        })
        .finally(() => {
          hideLoading();
        });
    },
    // 长按 开始录音
    handleStartRecord() {
      // console.log('start record')
      this.isStartRecord = true;
      /* #ifdef MP-ALIPAY */
      pluginAVoice.startRecord();
      this.time = 0;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.time++;
      }, 1000);
      /* #endif */

      /* #ifdef MP-WEIXIN */
      pluginAVoice.start();
      /* #endif */
    },
    // 取消长按
    handleStopRecord() {
      // console.log('start end')
      this.isStartRecord = false;
      /* #ifdef MP-ALIPAY */
      clearInterval(this.timer);
      const time = this.time;
      pluginAVoice
        .stopRecord({
          token: this.token,
          appkey: "KsPNePwQgWEhSfrG",
          source: "",
          format: "wav",
          enable_punctuation_prediction: true,
        })
        .then((res) => {
          let text = "";
          const { flash_result, status, message } = res;
          if (status === 20000000 && flash_result) {
            const { sentences } = flash_result;
            // console.log(sentences, 88)
            if (sentences && sentences.length > 0) {
              sentences.map((item) => {
                text += item.text;
              });
            }
            this.requestGetZnzxAnswer(text);
            const chatRecord = this.chatRecord;
            chatRecord.push({
              id: +new Date(),
              content: text,
              type: "private",
            });
            this.chatRecord = [...chatRecord];
          } else {
            if (time < 3) {
              showModal("录制时间太短，请重新录制");
            }
            // showModal(message)
          }
        });
      /* #endif */

      /* #ifdef MP-WEIXIN */
      pluginAVoice.stop();
      /* #endif */
    },
    // 结果点击
    handleClickItem(item) {
      const { type, value } = item;
      // 申报入口
      if (type === "1") {
        this.jumpRoute(value);
      }
      // 政策文件
      if (type === "3") {
        this.reviewPDF(value);
      }
    },
    // 猜想点击
    handleClickGuessItem(name) {
      // console.log(name,1234);
      this.updateChatRecord("private", name);
      this.requestGetZnzxAnswer(name);
    },
    // 处理微信语音识别错误
    handleWechatSpeechRecognitionError(code) {
      let errMsg = "";
      switch (code) {
        case -30001:
          errMsg = "录音接口出错。";
          break;
        case -30002:
          errMsg = "录音暂停接口被调用，录音终止，识别终止。";
          break;
        case -30003:
          errMsg = "录音帧数据未产生或者发送失败导致的数据传输失败。";
          break;
        case -30004:
          errMsg = "因网络或者其他非正常状态导致的未查询识别结果。";
          break;
        case -30005:
          errMsg = "语音识别服务内部错误。";
          break;
        case -30006:
          errMsg = "语音识别服务未在限定时间内识别完成。";
          break;
        case -30007:
          errMsg = "start启动参数错误。";
          break;
        case -30008:
          errMsg = "查询请求时网络失败。";
          break;
        case -30009:
          errMsg = "创建鉴权内部失败。";
          break;
        case -30010:
          errMsg = "发送鉴权时网络失败。";
          break;
        case -30011:
          errMsg =
            "试图在识别正在进行中是再次调用start，返回错误，正在进行的识别任务正常进行。";
          break;
        case -30012:
          errMsg = "当前无识别任务进行时调用stop错误。";
          break;
        case -30013:
          errMsg = "其他未知错误。";
          break;
        case -40001:
          errMsg = "达到接口调用频率限制。";
          break;
        default:
          errMsg = "未知错误。";
          break;
      }
      errMsg += "请稍后重试！";
      showModal(errMsg);
    },
  },
  computed: { ...mapGetters([USER_INFO]) },
  watch: {},
};
</script>

<style lang="scss" scoped>
// $primary: #3882ff;
@keyframes a {
  0% {
    box-shadow: 0 0 10rpx 10rpx rgba($primary, 0.2);
  }
  50% {
    box-shadow: 0 0 40rpx 20rpx rgba($primary, 0.4);
  }
  100% {
    box-shadow: 0 0 10rpx 10rpx rgba($primary, 0.2);
  }
}
.customer-service {
  position: relative;
  padding-bottom: 218rpx + 40rpx;
  padding-top: $spacing;
  .private-wrapper,
  .official-wrapper {
    display: flex;
    margin-bottom: 48rpx;
  }
  .private-wrapper {
    justify-content: flex-end;
    padding-right: 82rpx;
    position: relative;
    .iconimg {
      position: absolute;
      top: 12rpx;
      right: $spacing;
      width: 40rpx;
      height: 40rpx;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABLUExURUdwTNjl/9Tk/9fs/9Xl/9Tk/9Tk/9Tk/9Tk/9///9fm/9Tl/9Tk/9Pj/9OC/9Pj/ziC/32t/2Se/0OJ/8bb/7bR/1CR/5S7/6XH//T+DAsAAAAOdFJOUwAfthNt79PhlAdCTcVSN+tLYwAAAnBJREFUWMO1mdmSqyAQhl1QXCaFNIu+/5MeT2oqM478zVL4X+Ui+YqmVzpNw6tfxNSNclBqkGM3iaVvyjWv06huGqd1LsIt06CAhmnJPpyQipUUc01cJnJNwL2RaxKu7VSyujbOew0qQ8MrdnuTytTE3mT/pbL1xYR6O6oCjfAiW6mKJNu6PETsR1WsMXCPM+MPt5M3xtPuoGfuvsbxctD2ESHkdItnyNPbRRp87U+Etyg/LG1/RDacM1fHwPy98U4iyOtLfUG8fQsIWP2r9swoAq0JAbew0fLH0yLRIZEjiugB1Qak+CPCAx4IePBHlJkWQ5vld79UtYBqiSQdISBxCTgP9YDDzAV1gcnv4Gba0o6Au2JsZuqqRUALK+1ZqLlKTHlXeKpnggZH9oF/seA0wUdkDngmCz8qhMqNsdwg0URGI3cjGseOT02seTp/5XnHN9Qm3t0v4a1tpOc3CdOb1d+n9DHcmXxNzGJ6Q6w7Dvf+oIm3uYmc7b8X9AfhtImYPbAmfxxiSJ8iE3fMwDnFGZTLOHQkEzaYxxBHHNiW4eF06XDq0caKUOqJ3BbKlxwBy5ePAT0oX31m9Y/0gR61AIoDKdwCwl6xW4JsuEmthRYHbV5Ro9cpQB1u9EGbfQrQg7dAKHBMCtCAYSlUH8qAEg+cvggo8Ehc5JSfqV0UuVnDoT04tbtYtXHMsyIc3HYn4JvzXWrZhw9+mtlj10Tk/Yk23p8f9X7Y+NMMPx7TFy5t6vM2Ua/0B3ja+iZrRZCwvJmfX2LUX7PUXwTVX1XVX6bVX/fVX0g+sDKtv9R9YO1cfzH+wOr+iT8XCv/++AeePCyxAkvSnQAAAABJRU5ErkJggg==);
      background-size: 100% 100%;
    }
    .private {
      color: #fff;
      font-size: 30rpx;
      line-height: 1.4;
      padding: 12rpx 20rpx;
    }
  }
  .official-wrapper {
    justify-content: flex-start;
    padding-left: $spacing;
  }
  .official,
  .private {
    position: relative;
    max-width: 560rpx;
    background-color: $primary;
    box-shadow: 0rpx 2rpx 18rpx 0rpx rgba(42, 121, 255, 0.14);
    border-radius: 8rpx;
  }
  .official {
    background-color: #ffffff;
    box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(8, 76, 192, 0.06);
    .text {
      font-size: 30rpx;
      line-height: 1.4;
      padding: 12rpx 20rpx;
    }
    &.guess-wrapper {
      width: 560rpx;
      .guess {
        font-size: 32rpx;
        font-weight: 700;
        color: #3d424d;
        line-height: 90rpx;
        padding: 0 32rpx;
        border-bottom: 1px solid $border-color;
      }
      .guess-con {
        padding: 10rpx 0;
        .item {
          font-size: 30rpx;
          line-height: 1.4;
          color: #1b6eff;
          padding: 10rpx 32rpx;
        }
      }
    }
  }

  .recording {
    position: fixed;
    left: 50%;
    bottom: 76rpx;
    transform: translateX(-50%);
    width: 178rpx;
    height: 178rpx;
    background-color: #ffffff;
    box-shadow: 0rpx 7rpx 20rpx 0rpx rgba(56, 130, 255, 0.14);
    border-radius: 50%;
    font-size: 24rpx;
    line-height: 1;
    text-align: center;
    letter-spacing: 0rpx;
    color: $primary;
    transition: all 0.3s;
    padding-top: 32rpx;
    animation: a 2s infinite;
    animation-name: none;
    .iconimg {
      width: 74rpx;
      height: 74rpx;
      background-image: url(data:image/png;base64,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);
      background-size: 100% 100%;
      margin: auto;
    }
    .tip-text {
      padding-top: 10rpx;
    }
    &.active {
      color: #fff;
      background-color: $primary;
      animation-name: a;
      .iconimg {
        background-image: url(data:image/png;base64,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);
      }
    }
  }
  .items {
    padding: 0 20rpx 20rpx 54rpx;
    .items-title {
      font-size: 32rpx;
      line-height: 40rpx;
      font-weight: 700;
      color: #3d424d;
      padding: $spacing 0;
      position: relative;
      .iconimg {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        top: 50%;
        transform: translateY(-50%);
        left: -44rpx;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABSCAMAAAD0B6OUAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABvUExURUdwTDiD/zuF/8/l/zmD/87k/9Po/zmC/ziC/87j/4y8/+Ty/87j/zmD/zmD/zuE/8/j/87j/87j/87j/0CK/87j/87j/87j/ziD/83i/83i/ziC/0KI/p7E/rvW/sng/nOo/n2u/lya/lOU/leV/qkj1oQAAAAadFJOUwCvNDxsUhyH+s0OB/rU3kB4kfC4Eufho+TdkrBUkwAAAaRJREFUWMPtmNmSgjAQRQOIsgTRGUedBgkq//+NE/Y1ULQ9lg+5j/1wKqcISXcY09HR0Xl3wsAJNr2K5XLXxvOcKIocw2srNgeZi4cEBlGRvdlUXCjya+GAcoH7YpGNNi+BnB9QQMnahdd8kcaprEAVjtPOgexkdLShzdlCAhnbtNodICC0KyAz97U29IjfWySw0r6GfeB67QZYa+9gmAMWWGk/kiFxlXYXyLxCO74NiT8WElhpR3eB1x4AmRm8qD0EMi9VaNtIIINbPKnNjz4SCMlzUpu7WyRQiGlt/mXjgDIKbVjWVgBFqZ0NtDksaiuAEqn42kvaSmCtna7UngFCkuXE52iTz2rPAUHc12vPAtXaFx8JhORRaI9+G9dHAivtdHTsHrHAUjseVc8fA6RWLj9KNt6LPum24chtQ72xqX894sOB+viaPmABe8AK4itAvHA3q6/RjOwaxeu+pRWhbpaI2znqhpO6JVY07StnlX8bKxSDD2AHH+LRjHp4nB5v5ZyHGW+lajA5gANyACd/IigeMSLCRwzyZxZFfKajo/P5+QO/kaPScxgvPAAAAABJRU5ErkJggg==);
      }
    }
    .item {
      background-color: #ffffff;
      margin-bottom: $spacing;
      &.item-1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid $border-color;
        font-size: 30rpx;
        line-height: 40rpx;
        padding: $spacing 0;
        color: #333;
        .link-text {
          flex: 1;
          padding: 0 20rpx;
        }
        .iconimg {
          width: 40rpx;
          height: 40rpx;
          background-image: url(data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABQCAYAAACK5CKQAAAAAXNSR0IArs4c6QAABUdJREFUeAHtm11oXEUUx8/kbmn64ceDpNTqi49CFW1rm48VRQ0+2JeajUXFJ60glVhpH0x315gPRYQoiEVjS1r1QfxCqxiotg01yZaqiD6I2iKC0QfRthbjR7u7x/9ke8M27O7MGu/sXDgLycyeOXdnzu+emTMzdy6RfISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAJuCCg31ZRqae3n65B7ghRtmJUwHUX6eC6rvihpxPe/M5DtQ3xbsUhjzBTMw1UE2O1HM+rZefJYfW1y1dpCgUYqQNTVNxHTcOsA797yEi9y1Z7/ux4nHtn5DC878xf9YWq8UnRkaUCbDvaq30y6vpU78cgDO9QMuu9XJuPhsTf+madjySf5apOub+VOQGqjE0z3wf2NXslEV53LUw5d/XbfYNVqjzOQE1n1JaJMBzzzx1oNOl92MdIPALPHQtcLFSdjZLmltwzxipkivYsAU5oClRdWyKOBI6tX0NaRB9W5CsXeiJyD1JbfNMrN/0zTHoyJd1uSOKyWU1fuUXXSUt+5WkNAhla2DXK6yNQP7zS2AwonKEEbc73qm/B6n1KjAVE3tn2ANxWYXkU9S411Kfodg3r3VEYdMOo6VnAWbKrZNZlR7+BudqB8uprOnJzpEkT1D1sHeeuczJNMwz0y5JAc4pV5BCGMmzeEslopGv7i4iQ9PH6zytfSc1XmDUhtsA5Cf0/TKMbMzTYA0PiDwSJKTTymTtnoR6njFcjQUHTdLDyzzyYIIUwdTwR0x0Sv+i68vhGplyA1CMBMAeQ+AF1iAgMjTrOiFHaQPjbpRlXe8GBTzbBcWr0ZMCUB6edqOqEcAehSxTSG6dRDocx16q1HhiDan+bLi2fpPXjm2lBWK8UO0guLO+gR10HIe5AaWuswL6GZ2W6eqgWxrOyj5ouoe3ybOl0mizQbC5CaADOrtgHqQzfO2hCBZ36LXeKNRzLquI3+QnViAzI0tH2Q78KyctQyCJ0E0BRWQofC66NKYwdSg2h7itdxfnbcXGkCAwPz+HtgKqv2mnQXUh5LkNpgTI9WYXq0H555vQkAvLIAQzuj9Exvpz8mOJge/XRZCyWh97ZJF7CDItG9Jr2FlMcW5EKMjuLaRBQ/6uI3ddf+9Rfaj7psu/ZrUbYrlh6pgw3Gx0+txkcdbJjuj3J81DcodsGmrumPolMwsCtqiBpkbDyyNCHnvkKRXreaQ5Ym5OtdQIyNR55fIu4FwG7daIuPLBHnQ6p30wLX72pOUo9sWpSR7OjnNZhJ652fVWXiilmMhXnVRD1TabWrokLEQm+DTdsAd2FNvQ/2G58uwgjZ2K3kKDiqksFK5A0biPpRQ5Cg9Y3cHdc2eOWRdT/8UnQIELvk4VeZO8rj2DIY/zWrz5Zjw1Yv964w/YbeyYHuNnTl5026Lssbvtau98gKxqLunBxZudBHEJl3FojegtQmMp9QAW3ASsW7cz/aqoZ4pA4qZ6dpN6Y391yItso3ReO0jO70+Vif87W2PmiKYymH64D48jUt1OkzRH37nU5/sFK5Fg9Q3scW2JVVfG9OrIMKWrcdO+HPzQk9zjjr2hoixsMJQFxuweNMUxNtntypxix0vVBxBhKe+IoNRHSR7xM4mftJr/raC0KWjXDSteWFJcu7YVKbfWGJ6IdaehgT96xuoVvj+NaXtstZ1w4C2lLtpU6Mhzuw/TWcq0Xa8zInXTtkgOctawFzEEu8NVqGyj8HxPRkWn0W6kgqBISAEBACQkAICAEhIASEgBAQAkJACAgBISAEhIAQEAK1CfwLG5qexI+nRlwAAAAASUVORK5CYII=);
        }
        &:first-child {
          padding-top: 0;
        }
        &:last-child {
          border-bottom: 0;
        }
      }
      &.item-2 {
        font-size: 28rpx;
        line-height: 40rpx;
        color: #333;
        .item-question {
          font-weight: 700;
        }
        .item-answer {
          padding-top: 16rpx;
          color: $primary;
        }
      }
      &.item-3 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid $border-color;
        font-size: 30rpx;
        line-height: 40rpx;
        padding: $spacing 20rpx;
        color: $primary;
        text-decoration: underline;
        &:first-child {
          padding-top: 0;
        }
        &:last-child {
          border-bottom: 0;
        }
      }
      &.item-4 {
        width: 486rpx;
        .item-name {
          font-size: 30rpx;
          line-height: 1.4;
          font-weight: 700;
          color: #3d424d;
        }
        .cell-wrapper {
          margin-top: 16rpx;
          padding: 26rpx 30rpx;
          background-color: #f4f8ff;
          border-radius: 8rpx;
          .cell {
            font-size: 28rpx;
            line-height: 40rpx;
            color: #666;
            margin-bottom: 26rpx;
            .value {
              color: #333;
              &.tag {
                font-size: 24rpx;
                font-weight: 500;
                padding: 6rpx 24rpx;
                line-height: 1;
                color: #ffc800;
                background-color: rgba(#ffc800, 0.16);
                border-radius: 4rpx;
                border: solid 1rpx #ffc800;
                &.ed {
                  color: #51d574;
                  border-color: #51d574;
                  background-color: rgba(#51d574, 0.16);
                }
              }
              &.amount {
                font-weight: 500;
                color: $primary;
              }
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>
