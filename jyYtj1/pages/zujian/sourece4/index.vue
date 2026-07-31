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
                      v-if="shouldLoadChildren(item)"
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
              <template v-if="column.length">
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
                        v-if="shouldLoadChildren(item)"
                        src="./assets/icon-arrow.png"
                        mode="aspectFit"
                      ></image>
                    </span>
                  </div>
                </scroll-view>
              </template>
              <template v-else>
                <div class="column-empty">{{ getColumnTip(columnIndex + 1) }}</div>
              </template>
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
  name: 'modal-address-remote-selector',
  props: {
    value: {
      type: String,
      default: '',
    },
    areaCode: {
      type: [String, Number],
      default: '',
    },
    rootData: {
      type: Array,
      default() {
        return []
      },
    },
    fetchChildren: {
      type: Function,
      default() {
        return Promise.resolve([])
      },
    },
    levelLabels: {
      type: Array,
      default() {
        return ['省', '市', '县', '乡镇街道']
      },
    },
    placeholder: {
      type: String,
      default: '选择行政区划',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    titleHighlight: {
      type: String,
      default: '行政区划',
    },
    titleText: {
      type: String,
      default: '选择',
    },
    titleDesc: {
      type: String,
      default: '/ 请选择相关行政区划',
    },
    confirmText: {
      type: String,
      default: '确定',
    },
    valueKey: {
      type: String,
      default: 'areaid',
    },
    labelKey: {
      type: String,
      default: 'areaname',
    },
    childrenKey: {
      type: String,
      default: 'children',
    },
    leafKey: {
      type: String,
      default: 'leaf',
    },
    childNumKey: {
      type: String,
      default: 'childNum',
    },
    pathLabelKey: {
      type: String,
      default: 'namepath',
    },
    pathValueKey: {
      type: String,
      default: 'idpath',
    },
    pathSeparator: {
      type: String,
      default: '/',
    },
  },
  data() {
    return {
      displayText: '',
      checkText: '',
      firstColumnData: [],
      columnsData: [],
      activeValues: [],
      pendingSelection: null,
      confirmedSelection: null,
      loadingLevels: [],
      nodeMap: {},
      childrenCache: {},
    }
  },
  computed: {
    resolvedLevelLabels() {
      if (Array.isArray(this.levelLabels) && this.levelLabels.length) {
        return this.levelLabels.filter((item) => item)
      }
      return ['省', '市', '县', '乡镇街道']
    },
    firstColumn() {
      return this.firstColumnData
    },
    selectedDepth() {
      return this.activeValues.filter((item) => item !== '' && item !== null && item !== undefined).length
    },
    visibleListColumns() {
      const total = this.resolvedLevelLabels.length
      if (total <= 2) {
        return []
      }
      const count = Math.min(this.selectedDepth, total - 2)
      return this.columnsData.slice(1, 1 + count)
    },
    tagList() {
      const total = this.resolvedLevelLabels.length
      if (!total) {
        return []
      }
      if (total === 1) {
        return this.firstColumnData
      }
      if (total === 2) {
        return this.selectedDepth >= 1 ? this.columnsData[1] || [] : []
      }
      return this.selectedDepth >= total - 1 ? this.columnsData[total - 1] || [] : []
    },
    lastColumnIndex() {
      return Math.max(this.resolvedLevelLabels.length - 1, 0)
    },
    selectionPlaceholder() {
      return `请选择${this.titleHighlight}`
    },
    emptyTipText() {
      if (!this.firstColumnData.length) {
        return '暂无可选数据'
      }
      if (this.isLevelLoading(this.lastColumnIndex)) {
        return '正在加载数据...'
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
      },
      immediate: true,
    },
    areaCode: {
      handler(val) {
        if (!val) {
          this.displayText = this.value || ''
        }
      },
      immediate: true,
    },
    rootData: {
      handler() {
        this.rebuildRoot()
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    open() {
      this.clickAddressModal()
    },
    close() {
      this.restoreConfirmedState()
      this.$refs.popup.close()
    },
    clickAddressModal() {
      if (this.disabled) {
        return
      }
      this.$refs.popup.open()
      this.restoreConfirmedState()
    },
    rebuildRoot() {
      this.nodeMap = {}
      this.childrenCache = {}
      this.firstColumnData = this.normalizeList(this.rootData, 1, [], [])
      this.columnsData = this.createEmptyColumns()
      this.columnsData[0] = this.firstColumnData
      this.resetPanelState()
    },
    createEmptyColumns() {
      return this.resolvedLevelLabels.map(() => [])
    },
    normalizeList(list, level, pathLabels, pathValues) {
      if (!Array.isArray(list)) {
        return []
      }
      return list.map((item) => {
        const value = item[this.valueKey]
        const label = item[this.labelKey] || ''
        const rawPathLabels = typeof item[this.pathLabelKey] === 'string' && item[this.pathLabelKey]
          ? item[this.pathLabelKey].split(this.pathSeparator)
          : pathLabels.concat(label)
        const rawPathValues = typeof item[this.pathValueKey] === 'string' && item[this.pathValueKey]
          ? item[this.pathValueKey].split(this.pathSeparator)
          : pathValues.concat(value)
        const hasInlineChildren = Array.isArray(item[this.childrenKey]) && item[this.childrenKey].length > 0
        const hasChildren = hasInlineChildren || item[this.leafKey] === false || Number(item[this.childNumKey]) > 0
        const node = {
          ...item,
          _label: label,
          _value: value,
          _level: level,
          _pathLabels: rawPathLabels,
          _pathValues: rawPathValues,
          _children: [],
          _hasChildren: hasChildren,
          _loaded: false,
        }
        this.nodeMap[`${value}`] = node
        if (hasInlineChildren && level < this.resolvedLevelLabels.length) {
          node._children = this.normalizeList(item[this.childrenKey], level + 1, rawPathLabels, rawPathValues)
          node._loaded = true
          this.childrenCache[`${value}`] = node._children
        }
        return node
      })
    },
    shouldLoadChildren(node) {
      return node && node._level < this.resolvedLevelLabels.length && node._hasChildren
    },
    isActived(item, columnIndex) {
      return `${item._value}` === `${this.activeValues[columnIndex] || ''}`
    },
    isLevelLoading(columnIndex) {
      return this.loadingLevels.includes(columnIndex)
    },
    getColumnTip(columnIndex) {
      if (this.isLevelLoading(columnIndex)) {
        return '正在加载数据...'
      }
      return `请选择${this.resolvedLevelLabels[columnIndex] || this.titleHighlight}`
    },
    async handleItemClick(item) {
      this.applySelection(item)
      this.clearAfterLevel(item._level - 1)
      if (this.shouldLoadChildren(item)) {
        await this.ensureChildrenLoaded(item)
      }
    },
    applySelection(node) {
      this.pendingSelection = node
      this.activeValues = node._pathValues.slice()
      this.checkText = this.createPathText(node)
    },
    clearAfterLevel(levelIndex) {
      this.activeValues = this.activeValues.slice(0, levelIndex + 1)
      for (let index = levelIndex + 1; index < this.columnsData.length; index++) {
        this.$set(this.columnsData, index, [])
      }
    },
    async ensureChildrenLoaded(node) {
      const nextIndex = node._level
      const cacheKey = `${node._value}`
      if (this.childrenCache[cacheKey]) {
        node._children = this.childrenCache[cacheKey]
        node._loaded = true
        this.$set(this.columnsData, nextIndex, node._children)
        return
      }
      this.loadingLevels = this.loadingLevels.concat(nextIndex)
      try {
        const list = await this.fetchChildren({ ...node })
        const children = this.normalizeList(list, node._level + 1, node._pathLabels, node._pathValues)
        node._children = children
        node._loaded = true
        this.childrenCache[cacheKey] = children
        this.$set(this.columnsData, nextIndex, children)
      } finally {
        this.loadingLevels = this.loadingLevels.filter((item) => item !== nextIndex)
      }
    },
    createPathText(node) {
      return node._pathLabels.join(this.pathSeparator)
    },
    createPayload(node) {
      const payload = { ...node }
      delete payload._label
      delete payload._value
      delete payload._level
      delete payload._children
      delete payload._hasChildren
      delete payload._loaded
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
    restoreConfirmedState() {
      if (this.confirmedSelection) {
        this.applySelection(this.confirmedSelection)
        this.displayText = this.createPathText(this.confirmedSelection)
      } else {
        this.resetPanelState()
        this.displayText = this.value || ''
      }
    },
    resetPanelState() {
      this.checkText = ''
      this.activeValues = []
      this.pendingSelection = null
      this.columnsData = this.createEmptyColumns()
      this.columnsData[0] = this.firstColumnData
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

.column-empty,
.nodata {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
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
</style>
