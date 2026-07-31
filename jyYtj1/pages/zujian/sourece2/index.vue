<template>
  <view>
    <div class="modal-input" @click="handleOpen">
      <div
        :class="['input-content', moduleValue ? 'input-text' : 'input-placehoder', disabled ? 'input-disabled' : '']"
        :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
      >
        <span>{{ moduleValue || placeholder }}</span>
      </div>
    </div>

    <uni-popup ref="popup" type="center">
      <div class="screen-box">
        <div class="screen-title">
          <div class="screen-title-base">
            <text style="color: #0c6af7">{{ titleHighlight }}</text
            >{{ titleText }}
            <span>{{ titleDesc }}</span>
          </div>
          <div class="screen-title-close" @click="closePopup">
            <image src="./assets/icon-close.png" mode="aspectFit"></image>
          </div>
        </div>

        <div class="screen-content">
          <div class="screen-lt">
            <div class="screen-search">
              <div class="screen-search-input">
                <uni-easyinput
                  type="text"
                  v-model="searchText"
                  :placeholder="searchPlaceholder"
                  suffixIcon="search"
                  @iconClick="handleSearch"
                />
              </div>
            </div>

            <div class="screen-tab">
              <scroll-view scroll-y="true" class="scroll-Y" style="height: 100%">
                <div
                  v-for="(item, index) in levelOneList"
                  :key="`${item._value}-${index}`"
                  :class="['tab-item', item._value === currentFirstValue ? 'actived' : '']"
                  @click="handleFirstClick(item)"
                >
                  <span class="text">{{ item._label }}</span>
                  <span class="arrow">
                    <image src="./assets/icon-arrow.png" mode="aspectFit"></image>
                  </span>
                </div>
              </scroll-view>
            </div>
          </div>

          <div class="screen-rt" v-if="searchMode">
            <template v-if="searchArray.length">
              <scroll-view scroll-y="true" style="height: 100%">
                <div class="screen-rt-tag-content-search">
                  <div
                    v-for="(item, index) in searchArray"
                    :key="`${item._value}-${index}`"
                    :class="['tab-item-tag', item._value === currentLastValue ? 'actived' : '']"
                    @click="handleLeafClick(item)"
                  >
                    <span class="text">{{ item._pathLabels.join(' / ') }}</span>
                  </div>
                </div>
              </scroll-view>
            </template>
            <template v-else>
              <div class="nodata">
                <div class="nodata-pic">
                  <div class="nodata-img"></div>
                  <div class="nodata-text">暂时检索不到你要的数据哦~</div>
                </div>
              </div>
            </template>
          </div>

          <div class="screen-rt" v-else-if="currentLevelOne && secondList.length">
            <template v-if="showSecondColumn">
              <div class="screen-rt-list">
                <scroll-view scroll-y="true" style="height: 100%">
                  <div
                    v-for="(item, index) in secondList"
                    :key="`${item._value}-${index}`"
                    :class="['tab-item', item._value === currentSecondValue ? 'actived' : '']"
                    @click="handleSecondClick(item)"
                  >
                    <span class="text">{{ item._label }}</span>
                    <span class="arrow">
                      <image v-if="item._children.length" src="./assets/icon-arrow.png" mode="aspectFit"></image>
                    </span>
                  </div>
                </scroll-view>
              </div>

              <div class="screen-rt-tag">
                <template v-if="thirdList.length">
                  <scroll-view scroll-y="true" style="height: 100%">
                    <div class="screen-rt-tag-content">
                      <div
                        v-for="(item, index) in thirdList"
                        :key="`${item._value}-${index}`"
                        :class="['tab-item-tag', item._value === currentLastValue ? 'actived' : '']"
                        @click="handleLeafClick(item)"
                      >
                        <span class="text">{{ item._label }}</span>
                      </div>
                    </div>
                  </scroll-view>
                </template>
                <template v-else>
                  <div class="screen-rt-tip">请选择二级行业</div>
                </template>
              </div>
            </template>

            <div class="screen-rt-tag" v-else>
              <scroll-view scroll-y="true" style="height: 100%">
                <div class="screen-rt-tag-content">
                  <div
                    v-for="(item, index) in secondList"
                    :key="`${item._value}-${index}`"
                    :class="['tab-item-tag', item._value === currentLastValue ? 'actived' : '']"
                    @click="handleLeafClick(item)"
                  >
                    <span class="text">{{ item._label }}</span>
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>

          <div class="screen-rt" v-else>
            <div class="nodata">
              <div class="nodata-pic">
                <div class="nodata-img"></div>
                <div class="nodata-text">请选择左侧行业分类</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'industry-popup-selector',
  props: {
    /**
     * v-model 绑定的显示值
     * @values 当前选中行业名称
     */
    value: {
      type: String,
      default: '',
    },
    /**
     * 当前选中项编码
     * @values String | Number
     */
    moduleId: {
      type: [String, Number],
      default: '',
    },
    /**
     * 行业树数据源
     * @values [{ aab022: 编码, aab022Desc: 名称, children: 子级数组 }]
     */
    dataSource: {
      type: Array,
      default() {
        return []
      },
    },
    /**
     * 输入框占位文案
     * @values 任意字符串
     */
    placeholder: {
      type: String,
      default: '选择行业',
    },
    /**
     * 搜索框占位文案
     * @values 任意字符串
     */
    searchPlaceholder: {
      type: String,
      default: '行业名称搜索',
    },
    /**
     * 是否禁用组件
     * @values true | false
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 标题高亮文案
     * @values 任意字符串
     */
    titleHighlight: {
      type: String,
      default: '行业',
    },
    /**
     * 标题普通文案
     * @values 任意字符串
     */
    titleText: {
      type: String,
      default: '选择',
    },
    /**
     * 标题说明文案
     * @values 任意字符串
     */
    titleDesc: {
      type: String,
      default: '/ 请选择或搜索相关行业',
    },
    /**
     * 节点值字段名
     * @values 数据源中的编码字段名
     */
    valueKey: {
      type: String,
      default: 'aab022',
    },
    /**
     * 节点显示字段名
     * @values 数据源中的名称字段名
     */
    labelKey: {
      type: String,
      default: 'aab022Desc',
    },
    /**
     * 子节点字段名
     * @values 数据源中的 children 字段名
     */
    childrenKey: {
      type: String,
      default: 'children',
    },
    /**
     * 最大展示层级
     * @values 1 ~ 3
     */
    maxLevel: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      moduleValue: '',
      searchText: '',
      searchMode: false,
      searchArray: [],
      sourceTree: [],
      selectableList: [],
      currentFirstValue: '',
      currentSecondValue: '',
      currentLastValue: '',
      selectedNode: null,
    }
  },
  computed: {
    innerMaxLevel() {
      const level = Number(this.maxLevel) || 1
      return Math.max(1, Math.min(level, 3))
    },
    levelOneList() {
      return this.sourceTree
    },
    currentLevelOne() {
      return this.levelOneList.find((item) => item._value === this.currentFirstValue)
    },
    secondList() {
      return this.currentLevelOne ? this.currentLevelOne._children : []
    },
    currentLevelTwo() {
      return this.secondList.find((item) => item._value === this.currentSecondValue)
    },
    thirdList() {
      return this.currentLevelTwo ? this.currentLevelTwo._children : []
    },
    showSecondColumn() {
      return this.secondList.some((item) => item._children && item._children.length)
    },
  },
  watch: {
    value: {
      handler(val) {
        this.moduleValue = val || ''
        if (!this.moduleId && val) {
          this.syncSelection()
        }
      },
      immediate: true,
    },
    moduleId: {
      handler() {
        this.syncSelection()
      },
      immediate: true,
    },
    dataSource: {
      handler() {
        this.rebuildSource()
      },
      immediate: true,
      deep: true,
    },
    searchText(val) {
      if (!val) {
        this.searchMode = false
        this.searchArray = []
      }
    },
  },
  methods: {
    /**
     * 打开弹窗
     * @values 调用 handleOpen
     */
    open() {
      this.handleOpen()
    },
    /**
     * 关闭弹窗
     * @values 调用 closePopup
     */
    close() {
      this.closePopup()
    },
    /**
     * 输入框点击事件
     * @values disabled 为 true 时不执行
     */
    handleOpen() {
      if (this.disabled) {
        return
      }
      this.$refs.popup.open()
      this.syncSelection()
    },
    /**
     * 弹窗关闭事件
     * @values 调用 uni-popup 关闭弹窗
     */
    closePopup() {
      this.$refs.popup.close()
    },
    /**
     * 搜索按钮点击事件
     * @values 根据关键字筛选叶子节点
     */
    handleSearch() {
      const keyword = (this.searchText || '').trim()
      if (!keyword) {
        this.searchMode = false
        this.searchArray = []
        return
      }
      this.searchMode = true
      this.searchArray = this.selectableList.filter((item) => item._label.indexOf(keyword) > -1)
    },
    /**
     * 一级节点点击事件
     * @values 无子节点时直接完成选择
     */
    handleFirstClick(item) {
      this.searchMode = false
      this.currentFirstValue = item._value
      this.currentSecondValue = ''
      this.currentLastValue = ''
      if (!item._children.length) {
        this.handleLeafClick(item)
      }
    },
    /**
     * 二级节点点击事件
     * @values 无子节点时直接完成选择
     */
    handleSecondClick(item) {
      this.currentSecondValue = item._value
      this.currentLastValue = ''
      if (!item._children.length) {
        this.handleLeafClick(item)
      }
    },
    /**
     * 叶子节点点击事件
     * @values 更新选中状态并抛出结果
     */
    handleLeafClick(item) {
      this.applySelectionState(item)
      this.emitSelection(item)
    },
    /**
     * 重建树结构
     * @values 初始化平铺节点并同步回显
     */
    rebuildSource() {
      this.sourceTree = this.normalizeTree(this.dataSource, 1, [])
      this.selectableList = this.collectSelectableNodes(this.sourceTree, [])
      this.syncSelection()
    },
    /**
     * 标准化树节点
     * @values 生成层级、路径等内部字段
     */
    normalizeTree(list, level, parents) {
      if (!Array.isArray(list)) {
        return []
      }
      return list.map((item) => {
        const label = item[this.labelKey] || ''
        const value = item[this.valueKey]
        const node = {
          ...item,
          _label: label,
          _value: value,
          _level: level,
          _parents: parents,
          _pathLabels: parents.map((parent) => parent._label).concat(label),
          _pathValues: parents.map((parent) => parent._value).concat(value),
          _children: [],
        }
        if (level < this.innerMaxLevel) {
          node._children = this.normalizeTree(item[this.childrenKey] || [], level + 1, parents.concat(node))
        }
        return node
      })
    },
    /**
     * 收集叶子节点
     * @values 生成可搜索和可回显的数据列表
     */
    collectSelectableNodes(list, result) {
      list.forEach((item) => {
        if (item._children && item._children.length) {
          this.collectSelectableNodes(item._children, result)
        } else {
          result.push(item)
        }
      })
      return result
    },
    /**
     * 同步选中状态
     * @values 根据 moduleId 或 value 回显面板
     */
    syncSelection() {
      if (!this.sourceTree.length) {
        return
      }
      const node = this.findSelectedNode()
      if (!node) {
        if (!this.moduleId) {
          this.resetPanelState()
          this.moduleValue = this.value || ''
        }
        return
      }
      this.applySelectionState(node)
      this.moduleValue = node._label
    },
    /**
     * 查找选中节点
     * @values 优先按编码匹配，未传编码时按名称匹配
     */
    findSelectedNode() {
      if (this.moduleId !== '' && this.moduleId !== null && this.moduleId !== undefined) {
        return this.selectableList.find((item) => `${item._value}` === `${this.moduleId}`)
      }
      if (this.value) {
        return this.selectableList.find((item) => item._label === this.value)
      }
      return null
    },
    /**
     * 应用选中状态
     * @values 同步一级、二级和最终选中值
     */
    applySelectionState(node) {
      this.selectedNode = node
      this.currentFirstValue = node._pathValues[0] || ''
      this.currentSecondValue = node._pathValues[1] || ''
      this.currentLastValue = node._value
    },
    /**
     * 抛出选中结果
     * @values emit('input'|'change'|'setModalValue', payload)
     */
    emitSelection(node) {
      const payload = this.createPayload(node)
      this.moduleValue = payload.label
      this.$emit('input', payload.label)
      this.$emit('change', payload)
      this.$emit('setModalValue', payload)
      this.closePopup()
    },
    /**
     * 生成返回结构
     * @values 返回 label、value、level、pathLabels、pathValues 等字段
     */
    createPayload(node) {
      const payload = { ...node }
      delete payload._label
      delete payload._value
      delete payload._level
      delete payload._parents
      delete payload._pathLabels
      delete payload._pathValues
      delete payload._children
      payload.label = node._label
      payload.value = node._value
      payload.level = node._level
      payload.pathLabels = node._pathLabels
      payload.pathValues = node._pathValues
      payload[this.labelKey] = node._label
      payload[this.valueKey] = node._value
      return payload
    },
    /**
     * 重置面板状态
     * @values 清空搜索和层级选中值
     */
    resetPanelState() {
      this.searchText = ''
      this.searchMode = false
      this.searchArray = []
      this.currentFirstValue = ''
      this.currentSecondValue = ''
      this.currentLastValue = ''
      this.selectedNode = null
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-input {
  width: 100%;
}

.input-content {
  width: 100%;
  height: 48px;
  line-height: 48px;
  padding: 0 16px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #ffffff;
}

.input-text {
  color: rgba(0, 0, 0, 0.9);
}

.input-placehoder {
  color: rgba(0, 0, 0, 0.4);
}

.input-disabled {
  background: #f5f7fa;
}

.screen-box {
  width: 1440px;
  height: 800px;
  background: #fdfdfd;
  border-radius: 20px 20px 20px 20px;
}

.screen-title {
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  padding: 0 30px;
  border-bottom: 1px solid #dddddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.screen-title-base {
  width: 100%;
  height: 70px;
  line-height: 70px;
  font-weight: 600;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.9);
  position: relative;
  padding-left: 15px;
}

.screen-title-base:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 8px;
  height: 23px;
  background: #0c6af7;
  border-radius: 2px;
}

.screen-title-base span {
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 21px;
  margin-left: 5px;
}

.screen-title-close {
  width: 34px;
  height: 34px;
  cursor: pointer;
}

.screen-title-close image {
  width: 100%;
  height: 100%;
}

.screen-content {
  height: calc(100% - 71px);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background: #fff;
  background-size: 20px 12px;
}

.screen-lt {
  width: 320px;
  height: 100%;
  border-right: 1px solid #ddd;
}

.screen-search {
  width: 100%;
  height: 99px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen-search-input {
  width: 260px;
  height: 48px;
}

.screen-tab {
  width: 100%;
  height: calc(100% - 100px);
}

.screen-rt {
  width: calc(100% - 321px);
  height: 100%;
  display: flex;
  justify-content: space-between;
  background: #fbfcfd;
}

.screen-rt-list {
  width: 320px;
  height: 100%;
  border-right: 1px solid #ddd;
}

.screen-rt-tag {
  width: calc(100% - 321px);
  height: 100%;
}

.screen-rt-tag-content,
.screen-rt-tag-content-search {
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
}

.tab-item {
  width: 320px;
  height: 55px;
  line-height: 55px;
  text-align: center;
  border-radius: 0px 0px 0px 0px;
  padding: 0 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.tab-item .text {
  display: block;
  width: 235px;
  height: 35px;
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 35px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-item .arrow {
  display: block;
  width: 18px;
  height: 35px;
  text-align: center;
  color: rgba(0, 0, 0, 0.35);
}

.tab-item .arrow image {
  width: 100%;
  height: 100%;
}

.tab-item.actived {
  background: rgba(39, 164, 255, 0.15);
}

.tab-item.actived .text {
  color: #0c6af7;
}

.tab-item-tag {
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
  height: 48px;
  background: #f3f3f3;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #f3f3f3;
  cursor: pointer;
}

.tab-item-tag .text {
  display: block;
  width: 100%;
  padding: 0 15px;
  height: 48px;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 48px;
  text-align: center;
}

.tab-item-tag.actived {
  background: rgba(39, 164, 255, 0.15);
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #0c6af7;
}

.tab-item-tag.actived .text {
  color: #0c6af7;
  background: url('./assets/icon-check.png') right top no-repeat;
}

.screen-rt-tip,
.nodata {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.4);
  font-size: 16px;
}

.nodata-pic {
  text-align: center;
}

.nodata-img {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #f5f7fa;
}

.nodata-text {
  color: rgba(0, 0, 0, 0.45);
}

.screen-search-input .content-clear-icon {
  padding: 0 5px;
  height: 100%;
  width: 50px;
  background: #0c6af7;
  line-height: 48px;
  font-size: 26px !important;
  color: #fff !important;
  cursor: pointer;
}
</style>
