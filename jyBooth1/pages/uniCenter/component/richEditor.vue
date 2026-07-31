<template>
  <view class="editor-container">
    <view class="page-body">
      <view class="wrapper">
        <!-- 工具栏 -->
        <view class="toolbar" @tap="format" style="height: fit-content; overflow-y: auto">
          <view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold"></view>
          <view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic"></view>
          <view
            :class="formats.underline ? 'ql-active' : ''"
            class="iconfont icon-zitixiahuaxian"
            data-name="underline"
          ></view>
          <view
            :class="formats.strike ? 'ql-active' : ''"
            class="iconfont icon-zitishanchuxian"
            data-name="strike"
          ></view>
          <view
            :class="formats.align === 'left' ? 'ql-active' : ''"
            class="iconfont icon-zuoduiqi"
            data-name="align"
            data-value="left"
          ></view>
          <view
            :class="formats.align === 'center' ? 'ql-active' : ''"
            class="iconfont icon-juzhongduiqi"
            data-name="align"
            data-value="center"
          ></view>
          <view
            :class="formats.align === 'right' ? 'ql-active' : ''"
            class="iconfont icon-youduiqi"
            data-name="align"
            data-value="right"
          ></view>
          <view
            :class="formats.align === 'justify' ? 'ql-active' : ''"
            class="iconfont icon-zuoyouduiqi"
            data-name="align"
            data-value="justify"
          ></view>
          <view
            :class="formats.lineHeight ? 'ql-active' : ''"
            class="iconfont icon-line-height"
            data-name="lineHeight"
            data-value="2"
          ></view>
          <view
            :class="formats.fontFamily ? 'ql-active' : ''"
            class="iconfont icon-font"
            data-name="fontFamily"
            data-value="Pacifico"
          ></view>
          <view
            :class="formats.color === '#2979ff' ? 'ql-active' : ''"
            class="iconfont icon-text_color"
            data-name="color"
            data-value="#2979ff"
          ></view>
          <view
            :class="formats.backgroundColor === '#81abf5' ? 'ql-active' : ''"
            class="iconfont icon-fontbgcolor"
            data-name="backgroundColor"
            data-value="#81abf5"
          ></view>
          <view class="iconfont icon&#45;&#45;checklist" data-name="list" data-value="check"></view>
          <view
            :class="formats.list === 'ordered' ? 'ql-active' : ''"
            class="iconfont icon-youxupailie"
            data-name="list"
            data-value="ordered"
          ></view>
          <view
            :class="formats.list === 'bullet' ? 'ql-active' : ''"
            class="iconfont icon-wuxupailie"
            data-name="list"
            data-value="bullet"
          ></view>
          <view class="iconfont icon-fengexian" @tap="insertDivider"></view>
          <view
            :class="formats.header === 1 ? 'ql-active' : ''"
            class="iconfont icon-format-header-1"
            data-name="header"
            :data-value="1"
          ></view>
          <view
            :class="formats.script === 'sub' ? 'ql-active' : ''"
            class="iconfont icon-zitixiabiao"
            data-name="script"
            data-value="sub"
          ></view>
          <view
            :class="formats.script === 'super' ? 'ql-active' : ''"
            class="iconfont icon-zitishangbiao"
            data-name="script"
            data-value="super"
          ></view>
          <view class="iconfont icon-undo" @tap="undo"></view>
          <view class="iconfont icon-redo" @tap="redo"></view>
          <view class="iconfont icon-shanchu" @tap="clear"></view>
        </view>

        <view class="editor-wrapper">
          <editor
            id="editor"
            v-show="showEdit"
            class="ql-container"
            :placeholder="placeholder"
            show-img-size
            show-img-toolbar
            show-img-resize
            @statuschange="onStatusChange"
            :read-only="readOnly"
            @ready="onEditorReady"
            @input="handleInput"
          >
          </editor>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'richEditor',
  props: {
    placeholder: {
      type: String,
      default: '请输入描述信息…',
    },
    maxLength: {
      type: Number,
      default: 400,
    },
    bindValue: {
      type: String,
      default: '',
    },
  },
  watch: {
    bindValue: function (newVal, oldVal) {
      if (newVal) {
        console.log(newVal, 'newVal')
      }
    },
    immediate: true,
  },
  data() {
    return {
      readOnly: false,
      formats: {},
      showEdit: false,
      htmlOld: '',
    }
  },
  onLoad() {
    uni.loadFontFace({
      family: 'Pacifico',
      source: 'url("https://sungd.github.io/Pacifico.ttf")',
    })
  },

  methods: {
    readOnlyChange() {
      this.readOnly = !this.readOnly
    },

    onEditorReady() {
      // #ifdef APP-PLUS || H5
      this.$nextTick(() => {
        this.$nextTick(() => {
          uni
            .createSelectorQuery()
            .in(this)
            .select('#editor')
            .context((res) => {
              this.editorCtx = res.context
              this.editorCtx.setContents({
                html: this.bindValue,
              })
              this.showEdit = true
            })
            .exec()
        })
      })
      // #endif
    },
    undo() {
      this.editorCtx.undo()
    },
    redo() {
      this.editorCtx.redo()
    },
    format(e) {
      let { name, value } = e.target.dataset
      if (!name) return
      this.editorCtx.format(name, value)
    },
    onStatusChange(e) {
      const formats = e.detail
      this.formats = formats
    },
    handleInput(e) {
      let text = e.detail.text
      let html = e.detail.html

      text = text.replaceAll(/(\r\n+|\s+|　+)/g, '')
      if (text && text.length > this.maxLength) {
        this.$utils.showToast('字数超出限制')
        this.editorCtx.setContents({
          html: this.htmlOld,
        })
        this.$emit('input', this.htmlOld)
      } else {
        this.htmlOld = html
        this.$emit('input', html)
      }
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        },
      })
    },
    clear() {
      uni.showModal({
        title: '清空编辑器',
        content: '确定清空编辑器全部内容？',
        success: (res) => {
          if (res.confirm) {
            this.editorCtx.clear({
              success: function (res) {
                console.log('clear success')
              },
            })
          }
        },
      })
    },
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate,
      })
    },
    insertImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.editorCtx.insertImage({
            src: res.tempFilePaths[0],
            alt: '图像',
            success: function () {
              console.log('insert image success')
            },
          })
        },
      })
    },
  },
}
</script>

<style>
@import './editor-icon.css';

.wrapper {
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
}

.editor-wrapper {
  background: #fff;
}

.iconfont {
  display: inline-block;
  margin: 4px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 20px;
}

.toolbar {
  box-sizing: border-box;
  border-bottom: 0;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
}

.ql-container {
  box-sizing: border-box;
  width: 100%;
  min-height: 100px;
  padding: 6px 7px;
  margin-top: 10px;
  font-size: 10px;
  line-height: 20px;
}

.ql-active {
  color: #06c;
}
</style>
