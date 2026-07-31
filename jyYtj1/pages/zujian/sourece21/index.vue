<template>
  <div class="industry-popup-selector">
    <popup-panel ref="popup" :title-highlight="titleHighlight" :title-text="titleText" :title-desc="titleDesc">
      <div class="screen-content">
        <div class="screen-lt">
          <div class="screen-search">
            <div class="screen-search-form">
              <div class="screen-search-input">
                <input
                  :value="searchText"
                  type="text"
                  class="screen-search-native"
                  :placeholder="searchPlaceholder"
                  autocomplete="off"
                  spellcheck="false"
                  @input="handleSearchInput($event.target.value)"
                  @keydown.enter.prevent="handleSearch"
                />
                <button type="button" class="screen-search-button" aria-label="搜索" @click="handleSearch">
                  <span class="screen-search-button-icon" aria-hidden="true"></span>
                </button>
              </div>
            </div>
          </div>

          <div class="screen-tab">
            <div class="panel-scroll">
              <div
                v-for="(item, index) in levelOneList"
                :key="`${item._value}-${index}`"
                :class="['tab-item', item._value === currentFirstValue ? 'actived' : '']"
                @click="handleFirstClick(item)"
              >
                <span class="text" :title="item._label">{{ item._label }}</span>
                <span class="arrow">
                  <img v-if="item._children.length" class="arrow-icon" src="./assets/icon-arrow.png" alt="" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="screen-rt" v-if="searchMode">
          <template v-if="searchArray.length">
            <div class="panel-scroll">
              <div class="screen-rt-tag-content-search">
                <div
                  v-for="(item, index) in searchArray"
                  :key="`${item._value}-${index}`"
                  :class="['tab-item-tag', item._value === currentLastValue ? 'actived' : '']"
                  @click="handleLeafClick(item)"
                >
                  <span class="text" :title="item._pathLabels.join(' / ')">{{ item._pathLabels.join(' / ') }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="nodata">
              <div class="nodata-pic">
                <div class="nodata-img2"></div>
                <div class="nodata-text">暂时检索不到你要的数据哦</div>
              </div>
            </div>
          </template>
        </div>

        <div class="screen-rt" v-else-if="currentLevelOne && secondList.length">
          <template v-if="showSecondColumn">
            <div class="screen-rt-list">
              <div class="panel-scroll">
                <div
                  v-for="(item, index) in secondList"
                  :key="`${item._value}-${index}`"
                  :class="['tab-item', item._value === currentSecondValue ? 'actived' : '']"
                  @click="handleSecondClick(item)"
                >
                  <span class="text" :title="item._label">{{ item._label }}</span>
                  <span class="arrow">
                    <img v-if="item._children.length" class="arrow-icon" src="./assets/icon-arrow.png" alt="" />
                  </span>
                </div>
              </div>
            </div>

            <div class="screen-rt-tag">
              <template v-if="thirdList.length">
                <div class="panel-scroll">
                  <div class="screen-rt-tag-content">
                    <div
                      v-for="(item, index) in thirdList"
                      :key="`${item._value}-${index}`"
                      :class="['tab-item-tag', item._value === currentLastValue ? 'actived' : '']"
                      @click="handleLeafClick(item)"
                    >
                      <span class="text" :title="item._label">{{ item._label }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="screen-rt-tip">请选择二级行业</div>
              </template>
            </div>
          </template>

          <div class="screen-rt-tag" v-else>
            <div class="panel-scroll">
              <div class="screen-rt-tag-content">
                <div
                  v-for="(item, index) in secondList"
                  :key="`${item._value}-${index}`"
                  :class="['tab-item-tag', item._value === currentLastValue ? 'actived' : '']"
                  @click="handleLeafClick(item)"
                >
                  <span class="text" :title="item._label">{{ item._label }}</span>
                </div>
              </div>
            </div>
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
    </popup-panel>
  </div>
</template>

<script>
import PopupPanel from './part/Popup.vue'

export default {
  name: 'industry-popup-selector',
  components: {
    PopupPanel,
  },
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
      searchKeyword: '',
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
        this.resetSearchState()
      }
    },
  },
  methods: {
    open() {
      this.handleOpen()
    },
    close() {
      this.closePopup()
    },
    handleOpen() {
      if (this.disabled) {
        return
      }
      this.searchText = ''
      this.resetSearchState()
      if (this.$refs.popup) {
        this.$refs.popup.open()
      }
      this.syncSelection()
    },
    closePopup() {
      if (this.$refs.popup) {
        this.$refs.popup.close()
      }
    },
    handleSearchInput(value) {
      this.searchText = value
      if (!value || !value.trim()) {
        this.resetSearchState()
        return
      }
      if (this.searchMode || this.searchKeyword) {
        this.resetSearchState()
      }
    },
    handleSearch(keywordText) {
      this.runSearch(keywordText)
    },
    runSearch(keywordText) {
      const keyword = typeof keywordText === 'string' ? keywordText.trim() : (this.searchText || '').trim()
      if (!keyword) {
        this.resetSearchState()
        return
      }
      const normalizedKeyword = keyword.toLowerCase()
      this.searchKeyword = keyword
      this.searchMode = true
      this.searchArray = this.selectableList.filter((item) => this.matchSearchItem(item, normalizedKeyword))
    },
    matchSearchItem(item, keyword) {
      const labelText = `${item._label || ''}`.toLowerCase()
      const pathText = (item._pathLabels || []).join(' / ').toLowerCase()
      const valueText = `${item._value || ''}`.toLowerCase()
      return labelText.indexOf(keyword) > -1 || pathText.indexOf(keyword) > -1 || valueText.indexOf(keyword) > -1
    },
    handleFirstClick(item) {
      this.searchMode = false
      this.currentFirstValue = item._value
      this.currentSecondValue = ''
      this.currentLastValue = ''
      if (!item._children.length) {
        this.handleLeafClick(item)
      }
    },
    handleSecondClick(item) {
      this.currentSecondValue = item._value
      this.currentLastValue = ''
      if (!item._children.length) {
        this.handleLeafClick(item)
      }
    },
    handleLeafClick(item) {
      this.applySelectionState(item)
      this.emitSelection(item)
    },
    rebuildSource() {
      this.sourceTree = this.normalizeTree(this.dataSource, 1, [])
      this.selectableList = this.collectSelectableNodes(this.sourceTree, [])
      this.syncSelection()
    },
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
    findSelectedNode() {
      if (this.moduleId !== '' && this.moduleId !== null && this.moduleId !== undefined) {
        return this.selectableList.find((item) => `${item._value}` === `${this.moduleId}`)
      }
      if (this.value) {
        return this.selectableList.find((item) => item._label === this.value)
      }
      return null
    },
    applySelectionState(node) {
      this.selectedNode = node
      this.currentFirstValue = node._pathValues[0] || ''
      this.currentSecondValue = node._pathValues[1] || ''
      this.currentLastValue = node._value
    },
    emitSelection(node) {
      const payload = this.createPayload(node)
      this.moduleValue = payload.label
      this.$emit('input', payload.label)
      this.$emit('change', payload)
      this.$emit('setModalValue', payload)
      this.closePopup()
    },
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
    resetSearchState() {
      this.searchKeyword = ''
      this.searchMode = false
      this.searchArray = []
    },
    resetPanelState() {
      this.searchText = ''
      this.resetSearchState()
      this.currentFirstValue = ''
      this.currentSecondValue = ''
      this.currentLastValue = ''
      this.selectedNode = null
    },
  },
}
</script>

<style lang="scss" scoped>
.industry-popup-selector,
.modal-input {
  width: 100%;
}

.input-content {
  width: 100%;
  min-height: 48px;
  padding: 0 16px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #ffffff;
  display: flex;
  align-items: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.modal-input:hover .input-content {
  border-color: #bfc5d2;
}

.input-text {
  color: rgba(0, 0, 0, 0.9);
}

.input-placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.input-disabled {
  background: #f5f7fa;
}

.screen-content {
  height: calc(100% - 71px);
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
  background: #fff;
  min-height: 0;
}

.screen-lt,
.screen-rt,
.screen-rt-list,
.screen-rt-tag,
.screen-tab {
  min-height: 0;
}

.screen-lt {
  width: 30%;
  max-width: 320px;
  min-width: 180px;
  height: 100%;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.screen-search {
  width: 100%;
  height: 99px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
  box-sizing: border-box;
}

.screen-search-form {
  width: 260px;
  max-width: 100%;
}

.screen-search-input {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: stretch;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.screen-search-input:focus-within {
  border-color: #0c6af7;
  box-shadow: 0 0 0 2px rgba(12, 106, 247, 0.12);
}

.screen-search-native {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 14px;
  border: none;
  box-sizing: border-box;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.88);
  background: transparent;
}

.screen-search-native:focus {
  outline: none;
}

.screen-search-native::placeholder {
  color: rgba(0, 0, 0, 0.35);
}

.screen-search-button {
  width: 50px;
  height: 100%;
  padding: 0;
  border: none;
  flex-shrink: 0;
  background: #0c6af7;
  cursor: pointer;
  transition: background 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.screen-search-button:hover {
  background: #0759d6;
}

.screen-search-button-icon {
  position: relative;
  width: 14px;
  height: 14px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  box-sizing: border-box;
}
.screen-search-button {
  border-radius: 0px;
}

.screen-search-button-icon::after {
  content: '';
  position: absolute;
  right: -5px;
  bottom: -3px;
  width: 7px;
  height: 2px;
  background: #ffffff;
  border-radius: 999px;
  transform: rotate(45deg);
}

.screen-tab {
  flex: 1;
}

.panel-scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.screen-tab > .panel-scroll,
.screen-rt > .panel-scroll,
.screen-rt-list > .panel-scroll,
.screen-rt-tag > .panel-scroll {
  width: 100%;
}

.panel-scroll::-webkit-scrollbar {
  width: 6px;
}

.panel-scroll::-webkit-scrollbar-thumb {
  background: rgba(12, 106, 247, 0.2);
  border-radius: 999px;
}

.screen-rt {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background: #fbfcfd;
}

.screen-rt-list {
  width: 40%;
  max-width: 320px;
  min-width: 180px;
  height: 100%;
  border-right: 1px solid #ddd;
  background: #ffffff;
}

.screen-rt-tag {
  flex: 1;
  min-width: 0;
  height: 100%;
}

.screen-rt-tag-content,
.screen-rt-tag-content-search {
  width: 100%;
  min-height: 100%;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.tab-item {
  width: 100%;
  min-height: 55px;
  padding: 10px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.tab-item .text {
  display: block;
  flex: 1;
  min-width: 0;
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 1.5;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-item .arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-left: 12px;
  flex-shrink: 0;
}

.arrow-icon {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.tab-item.actived {
  background: rgba(39, 164, 255, 0.15);
}

.tab-item.actived .text {
  color: #0c6af7;
}

.tab-item-tag {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  margin-right: 20px;
  margin-bottom: 20px;
  min-height: 48px;
  background: #f3f3f3;
  border-radius: 4px;
  border: 1px solid #f3f3f3;
  cursor: pointer;
}

.tab-item-tag .text {
  display: block;
  max-width: 100%;
  padding: 12px 15px;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 24px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-item-tag.actived {
  background: rgba(39, 164, 255, 0.15);
  border: 1px solid #0c6af7;
}

.tab-item-tag.actived .text {
  color: #0c6af7;
  padding-right: 36px;
  background: url('./assets/icon-check.png') right 12px center / 16px 16px no-repeat;
}

.screen-rt-tip,
.nodata {
  width: 100%;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.4);
  font-size: 16px;
  text-align: center;
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

@media (max-width: 1024px) {
  .screen-search {
    padding: 0 16px;
  }

  .screen-lt,
  .screen-rt-list {
    min-width: 150px;
  }

  .screen-rt-tag-content,
  .screen-rt-tag-content-search {
    padding: 24px 20px;
  }

  .tab-item .text,
  .tab-item-tag .text {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .input-content {
    min-height: 44px;
    padding: 0 12px;
  }

  .screen-content {
    flex-direction: column;
  }

  .screen-lt {
    width: 100%;
    max-width: none;
    min-width: 0;
    height: 240px;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }

  .screen-search {
    height: 76px;
    padding: 16px 12px;
  }

  .screen-search-form {
    max-width: none;
  }

  .screen-search-input,
  .screen-search-native,
  .screen-search-button {
    height: 40px;
  }

  .screen-search-native {
    font-size: 14px;
  }

  .screen-search-button {
    width: 44px;
  }

  .screen-search-button-icon {
    width: 12px;
    height: 12px;
  }

  .screen-search-button-icon::after {
    right: -4px;
    bottom: -3px;
    width: 6px;
  }

  .screen-tab {
    height: calc(100% - 77px);
  }

  .screen-rt {
    width: 100%;
    flex: 1;
  }

  .screen-rt-list {
    width: 42%;
    max-width: none;
    min-width: 110px;
  }

  .screen-rt-tag-content,
  .screen-rt-tag-content-search {
    padding: 16px 12px;
  }

  .tab-item {
    min-height: 48px;
    padding: 8px 12px;
  }

  .tab-item .text {
    font-size: 14px;
  }

  .tab-item-tag {
    margin-right: 12px;
    margin-bottom: 12px;
    min-height: 40px;
  }

  .tab-item-tag .text {
    padding: 8px 12px;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    white-space: normal;
  }

  .tab-item-tag.actived .text {
    padding-right: 28px;
    background-position: right 8px top 8px;
    background-size: 14px 14px;
  }

  .screen-rt-tip,
  .nodata {
    padding: 16px;
    font-size: 14px;
  }
}
</style>
