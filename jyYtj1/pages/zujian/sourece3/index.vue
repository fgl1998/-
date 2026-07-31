<template>
  <view>
    <div class="modal-input" @click="clickAddressModal">
      <div
        :class="
          !disabled
            ? displayText
              ? 'input-content input-text'
              : 'input-content input-placehoder'
            : 'input-content input-placehoder input-disabled'
        "
        :style="{ cursor: disabled ? 'not-allowed' : 'pointer' }"
      >
        <span>{{ displayText || placeholder }}</span>
      </div>
    </div>

    <uni-popup ref="popup" type="center">
      <div class="screen-box">
        <div class="screen-title">
          <div class="screen-title-base">
            <text style="color: #0c6af7">{{ titleHighlight }}</text>{{ titleText }}
            <span>{{ titleDesc }}</span>
          </div>
          <div class="screen-title-close" @click="close">
            <image src="./assets/icon-close.png" mode="aspectFit"></image>
          </div>
        </div>

        <div class="screen-search">
          <div class="screen-search-input">
            <uni-row class="search-row">
              <uni-col :span="4" :offset="1">
                <div class="input-text">已选择的{{ titleHighlight }}：</div>
              </uni-col>
              <uni-col :span="15">
                <div class="input-content current-value">{{ checkText || selectionPlaceholder }}</div>
              </uni-col>
              <uni-col :span="3">
                <button class="input-btn" type="primary" @click="selectValue">{{ confirmText }}</button>
              </uni-col>
            </uni-row>
          </div>
        </div>

        <div class="screen-content">
          <div class="screen-lt">
            <div class="screen-tab">
              <scroll-view scroll-y="true" class="scroll-Y" style="height: 100%">
                <div
                  v-for="(item, index) in firstColumn"
                  :key="`${item._value}-${index}`"
                  :class="['tab-item', isActived(item, 0) ? 'actived' : '']"
                  @click="handleItemClick(item)"
                >
                  <span class="text">{{ item._label }}</span>
                  <span class="arrow">
                    <image
                      v-if="item._children.length"
                      src="./assets/icon-arrow.png"
                      mode="aspectFit"
                    ></image>
                  </span>
                </div>
              </scroll-view>
            </div>
          </div>

          <div class="screen-rt">
            <div
              v-for="(column, columnIndex) in visibleListColumns"
              :key="`column-${columnIndex}`"
              class="screen-rt-list"
            >
              <scroll-view scroll-y="true" style="height: 100%">
                <div
                  v-for="(item, index) in column"
                  :key="`${item._value}-${index}`"
                  :class="['tab-item', isActived(item, columnIndex + 1) ? 'actived' : '']"
                  @click="handleItemClick(item)"
                >
                  <span class="text">{{ item._label }}</span>
                  <span class="arrow">
                    <image
                      v-if="item._children.length"
                      src="./assets/icon-arrow.png"
                      mode="aspectFit"
                    ></image>
                  </span>
                </div>
              </scroll-view>
            </div>

            <div class="screen-rt-tag">
              <template v-if="tagList.length">
                <scroll-view scroll-y="true" style="height: 100%">
                  <div class="screen-rt-tag-content">
                    <div
                      v-for="(item, index) in tagList"
                      :key="`${item._value}-${index}`"
                      :class="['tab-item-tag', isActived(item, lastColumnIndex) ? 'actived' : '']"
                      @click="handleItemClick(item)"
                    >
                      <span class="text">{{ item._label }}</span>
                    </div>
                  </div>
                </scroll-view>
              </template>
              <template v-else>
                <div class="nodata">
                  <div class="nodata-pic">
                    <div class="nodata-img"></div>
                    <div class="nodata-text">{{ emptyTipText }}</div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'modal-address-selector',
  props: {
    /**
     * v-model 绑定的显示值
     * @values 当前选中的完整行政区划名称
     */
    value: {
      type: String,
      default: '',
    },
    /**
     * 当前选中项编码
     * @values String | Number
     */
    areaCode: {
      type: [String, Number],
      default: '',
    },
    /**
     * 一次性传入的树形数据源
     * @values [{ areaid: 编码, areaname: 名称, children: 子级数组 }]
     */
    dataSource: {
      type: Array,
      default() {
        return []
      },
    },
    /**
     * 层级标题数组
     * @values ['省','市','县','乡镇街道']、['省','市','县']、['市','县']
     */
    levelLabels: {
      type: Array,
      default() {
        return ['省', '市', '县', '乡镇街道']
      },
    },
    /**
     * 输入框占位文案
     * @values 任意字符串
     */
    placeholder: {
      type: String,
      default: '选择行政区划',
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
      default: '行政区划',
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
      default: '/ 请选择相关行政区划',
    },
    /**
     * 确认按钮文案
     * @values 任意字符串
     */
    confirmText: {
      type: String,
      default: '确定',
    },
    /**
     * 节点值字段名
     * @values 数据源中的编码字段名
     */
    valueKey: {
      type: String,
      default: 'areaid',
    },
    /**
     * 节点显示字段名
     * @values 数据源中的名称字段名
     */
    labelKey: {
      type: String,
      default: 'areaname',
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
     * 路径拼接分隔符
     * @values '/'、'-' 等任意字符串
     */
    pathSeparator: {
      type: String,
      default: '/',
    },
  },
  data() {
    return {
      displayText: '',
      checkText: '',
      sourceTree: [],
      activeValues: [],
      pendingSelection: null,
      confirmedSelection: null,
      flatNodes: [],
    }
  },
  computed: {
    /**
     * 处理层级标签数组
     * @values 过滤空值，未传时返回默认层级名称
     */
    resolvedLevelLabels() {
      if (Array.isArray(this.levelLabels) && this.levelLabels.length) {
        return this.levelLabels.filter((item) => item)
      }
      return ['省', '市', '县', '乡镇街道']
    },
    /**
     * 一级列表数据
     * @values 返回第一列展示的节点数组
     */
    firstColumn() {
      return this.columnLists[0] || []
    },
    /**
     * 当前已选层级深度
     * @values 返回 activeValues 中有效值的数量
     */
    selectedDepth() {
      return this.activeValues.filter((item) => item !== '' && item !== null && item !== undefined).length
    },
    /**
     * 所有列数据集合
     * @values 根据当前选中路径逐级生成每一列的数据
     */
    columnLists() {
      const levelCount = this.resolvedLevelLabels.length
      if (!levelCount) {
        return []
      }
      const columns = [this.sourceTree]
      for (let index = 1; index < levelCount; index++) {
        const parentValue = this.activeValues[index - 1]
        const parent = (columns[index - 1] || []).find((item) => `${item._value}` === `${parentValue}`)
        columns.push(parent && parent._children ? parent._children : [])
      }
      return columns
    },
    /**
     * 中间列表列数据
     * @values 返回除首列和末列标签区外的中间列数组
     */
    visibleListColumns() {
      const total = this.resolvedLevelLabels.length
      if (total <= 2) {
        return []
      }
      const count = Math.min(this.selectedDepth, total - 2)
      return this.columnLists.slice(1, 1 + count)
    },
    /**
     * 末列标签数据
     * @values 返回最后一级可选择的节点数组
     */
    tagList() {
      const total = this.resolvedLevelLabels.length
      if (!total) {
        return []
      }
      if (total === 1) {
        return this.columnLists[0] || []
      }
      if (total === 2) {
        return this.selectedDepth >= 1 ? this.columnLists[1] || [] : []
      }
      return this.selectedDepth >= total - 1 ? this.columnLists[total - 1] || [] : []
    },
    /**
     * 最后一列索引
     * @values 返回末级标签列对应的层级索引
     */
    lastColumnIndex() {
      return Math.max(this.resolvedLevelLabels.length - 1, 0)
    },
    /**
     * 顶部已选占位文案
     * @values 返回未选择时的提示文本
     */
    selectionPlaceholder() {
      return `请选择${this.titleHighlight}`
    },
    /**
     * 空数据提示文案
     * @values 根据当前数据状态返回对应提示文本
     */
    emptyTipText() {
      if (!this.sourceTree.length) {
        return '暂无可选数据'
      }
      if (!this.selectedDepth) {
        return `请选择${this.resolvedLevelLabels[0] || this.titleHighlight}`
      }
      return '请继续选择行政区划'
    },
  },
  watch: {
    value: {
      handler(val) {
        this.displayText = val || ''
        if (!this.areaCode && val) {
          this.syncSelection()
        }
      },
      immediate: true,
    },
    areaCode: {
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
  },
  methods: {
    /**
     * 打开弹窗
     * @values 调用 clickAddressModal
     */
    open() {
      this.clickAddressModal()
    },
    /**
     * 关闭弹窗
     * @values 恢复已确认的选中状态并关闭弹窗
     */
    close() {
      this.restoreConfirmedState()
      this.$refs.popup.close()
    },
    /**
     * 输入框点击事件
     * @values 禁用时不执行，打开弹窗后同步当前选中项
     */
    clickAddressModal() {
      if (this.disabled) {
        return
      }
      this.$refs.popup.open()
      this.syncSelection()
    },
    /**
     * 重建树结构
     * @values 标准化数据源并生成平铺节点列表
     */
    rebuildSource() {
      this.sourceTree = this.normalizeTree(this.dataSource, 1, [])
      this.flatNodes = this.collectNodes(this.sourceTree, [])
      this.syncSelection()
    },
    /**
     * 标准化树节点
     * @values 为节点补充层级、路径和值等内部字段
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
        if (level < this.resolvedLevelLabels.length) {
          node._children = this.normalizeTree(item[this.childrenKey] || [], level + 1, parents.concat(node))
        }
        return node
      })
    },
    /**
     * 收集全部节点
     * @values 生成便于回显查询的平铺数组
     */
    collectNodes(list, result) {
      list.forEach((item) => {
        result.push(item)
        if (item._children && item._children.length) {
          this.collectNodes(item._children, result)
        }
      })
      return result
    },
    /**
     * 同步当前选中状态
     * @values 根据 areaCode 或 value 回显面板选中项
     */
    syncSelection() {
      if (!this.sourceTree.length) {
        return
      }
      const node = this.findSelectedNode()
      if (!node) {
        this.confirmedSelection = null
        this.resetPanelState()
        this.displayText = this.value || ''
        this.checkText = this.value || ''
        return
      }
      this.confirmedSelection = node
      this.applySelection(node)
      this.displayText = this.createPathText(node)
    },
    /**
     * 查找当前选中节点
     * @values 优先按编码匹配，未传编码时按名称匹配
     */
    findSelectedNode() {
      if (this.areaCode !== '' && this.areaCode !== null && this.areaCode !== undefined) {
        return this.flatNodes.find((item) => `${item._value}` === `${this.areaCode}`) || null
      }
      if (this.value) {
        return (
          this.flatNodes.find((item) => this.createPathText(item) === this.value || item._label === this.value) || null
        )
      }
      return null
    },
    /**
     * 节点点击事件
     * @values 更新当前待确认的选中状态
     */
    handleItemClick(item) {
      this.applySelection(item)
    },
    /**
     * 应用选中状态
     * @values 同步路径值和顶部已选文本
     */
    applySelection(node) {
      this.pendingSelection = node
      this.activeValues = node._pathValues.slice()
      this.checkText = this.createPathText(node)
    },
    /**
     * 生成路径文本
     * @values 按 pathSeparator 拼接完整名称路径
     */
    createPathText(node) {
      return node._pathLabels.join(this.pathSeparator)
    },
    /**
     * 判断节点是否高亮
     * @values 返回当前列的选中状态
     */
    isActived(item, columnIndex) {
      return `${item._value}` === `${this.activeValues[columnIndex] || ''}`
    },
    /**
     * 生成返回结构
     * @values 返回 areaCode、areaname、pathLabels、pathValues 等字段
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
      payload.areaCode = node._value
      payload.areaname = this.createPathText(node)
      payload[this.labelKey] = node._label
      payload[this.valueKey] = node._value
      return payload
    },
    /**
     * 确认选择事件
     * @values 抛出 input、change、setAreaValue 事件并关闭弹窗
     */
    selectValue() {
      if (!this.pendingSelection) {
        return
      }
      const payload = this.createPayload(this.pendingSelection)
      this.confirmedSelection = this.pendingSelection
      this.displayText = payload.areaname
      this.$emit('input', payload.areaname)
      this.$emit('change', payload)
      this.$emit('setAreaValue', payload)
      this.$refs.popup.close()
    },
    /**
     * 恢复已确认状态
     * @values 关闭未确认弹窗时回退到上一次确认值
     */
    restoreConfirmedState() {
      if (this.confirmedSelection) {
        this.applySelection(this.confirmedSelection)
        this.displayText = this.createPathText(this.confirmedSelection)
      } else {
        this.resetPanelState()
        this.displayText = this.value || ''
      }
    },
    /**
     * 重置面板状态
     * @values 清空顶部已选文本和层级选中值
     */
    resetPanelState() {
      this.checkText = ''
      this.activeValues = []
      this.pendingSelection = null
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
  width: 1600px;
  height: 800px;
  background: #fdfdfd;
  border-radius: 20px;
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
  text-align: left;
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

.screen-search {
  width: 100%;
  height: 98px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
}

.screen-search-input {
  width: 100%;
  height: 48px;
  margin: 24px 0;
}

.search-row {
  width: 100%;
  height: 100%;
}

.search-row .input-text {
  height: 46px;
  line-height: 48px;
  width: 100%;
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.25);
  text-align: left;
}

.search-row .input-content {
  width: 100%;
  height: 48px;
  background: #ffffff;
  border-radius: 4px 0 0 4px;
  border: 1px solid #a2a7a9;
  padding: 0 2%;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 18px;
  color: #0c6af7;
  line-height: 48px;
  text-align: left;
}

.current-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.input-btn {
  width: 90px;
  height: 48px;
  background: #0c6af7;
  border-radius: 0 4px 4px 0;
  margin: 0 !important;
}

.screen-content {
  height: calc(100% - 71px - 98px);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  background: #fff;
}

.screen-lt {
  width: 320px;
  height: 100%;
  border-right: 1px solid #ddd;
}

.screen-tab {
  width: 100%;
  height: 100%;
}

.screen-rt {
  width: calc(100% - 321px);
  height: 100%;
  background: #fbfcfd;
  display: flex;
  justify-content: space-between;
}

.screen-rt-list {
  width: 320px;
  height: 100%;
  border-right: 1px solid #ddd;
}

.screen-rt-tag {
  flex: 1;
  height: 100%;
}

.tab-item {
  width: 320px;
  height: 55px;
  line-height: 55px;
  display: flex;
  box-sizing: border-box;
  padding: 0 24px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.tab-item.actived {
  background: rgba(39, 164, 255, 0.15);
}

.tab-item.actived .text {
  color: #0c6af7;
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
}

.tab-item .arrow image {
  width: 100%;
  height: 100%;
}

.screen-rt-tag-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 30px;
}

.tab-item-tag {
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
  height: 48px;
  background: #f3f3f3;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #f3f3f3;
}

.tab-item-tag.actived {
  background: rgba(39, 164, 255, 0.15);
  border: 1px solid #0c6af7;
}

.tab-item-tag.actived .text {
  color: #0c6af7;
  background: url('./assets/icon-check.png') right top no-repeat;
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

.nodata {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  font-size: 16px;
}
</style>
