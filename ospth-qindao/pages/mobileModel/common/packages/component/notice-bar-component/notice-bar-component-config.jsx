import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'

export default {
  name: 'notice-bar-component-config',
  mixins: [componentConfigMixin],
  props: {
    config: {
      type: Object,
      required: true,
    },
    tabsName: {
      type: Array,
      default: () => {
        return ['static', 'scroll']
      },
    },
  },
  components: { baseConfig, },
  model: {
    prop: 'config',
    event: 'click',
  },
  methods: {
    // static默认数据添加item
    fnOnAddStaticData () {
      this.config.staticData.push({ value: '', })
    },
    // static默认数据删除item
    fnOnDeleteStaticData (index) {
      this.config.staticData.splice(index, 1)
    },
    callback (key) {
      this.config.dataType = key
    },
  },
  render () {
    return (
      <base-config
        config={this.config}
        configNameList={this.getConfigNameList}
      >
        <ta-label-con label="通知栏模式">
          <ta-select vModel={this.config.mode} style={{ width: '100%', }}>
            <ta-select-option value="closeable">closeable</ta-select-option>
            <ta-select-option value="link">link</ta-select-option>
            <ta-select-option value="">default</ta-select-option>
          </ta-select>
        </ta-label-con>
        <ta-label-con label="文本颜色">
          <ta-input placeholder="如：#f60" vModel={this.config.color}/>
        </ta-label-con>
        <ta-label-con label="滚动条背景">
          <ta-input placeholder="如：#fff7cc" vModel={this.config.background}/>
        </ta-label-con>
        <ta-label-con label="图标">
          <ta-input placeholder="左侧图标名称或图片链接,如：info-o" vModel={this.config.leftIcon}/>
        </ta-label-con>
        <ta-tabs onchange={this.callback}>
          {/* 静态数据tab页 */}
          {this.tabsName.includes('scroll') && <ta-tab-pane tab={'滚动模式'} key={'scroll'}>
            <div>
              <ta-label-con label="文本内容">
                <ta-input placeholder="请输入通知文本内容" vModel={this.config.text}/>
              </ta-label-con>
              <ta-label-con label="动画延迟(s)">
                <ta-input placeholder="如：1" vModel={this.config.delay}/>
              </ta-label-con>
              <ta-label-con label="滚动速率(px/s)">
                <ta-input placeholder="如：60" vModel={this.config.speed}/>
              </ta-label-con>
              <ta-label-con label="滚动播放">
                <ta-switch vModel={this.config.scrollable}/>
                <ta-popover
                    width="300"
                    placement="top"
                    trigger="hover"
                    content="内容长度溢出时默认开启">
                  <ta-icon slot="reference" type="question-circle" style="cursor: pointer;margin-left: 10px;"/>
                </ta-popover>
              </ta-label-con>
              {
                this.config.scrollable === false && <ta-label-con label="文本换行">
                  <ta-switch vModel={this.config.wrapable}/>
                  <ta-popover
                      width="300"
                      placement="top"
                      trigger="hover"
                      content="只在禁用滚动时生效">
                    <ta-icon slot="reference" type="question-circle" style="cursor: pointer;margin-left: 10px;"/>
                  </ta-popover>
                </ta-label-con>
              }
            </div>
          </ta-tab-pane>}
          {this.tabsName.includes('static') && <ta-tab-pane tab={'垂直切换'} key={'static'}>
            <div>
              {/* 默认数据头 */}
              <ta-row gutter={16} style={{ marginBottom: '10px', }}>
                <ta-col span={20}>
                  <span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px', }}>Value</span>
                </ta-col>
                <ta-col span={4}>
                  <ta-button
                      type={'primary'}
                      shape={'circle'}
                      icon={'plus'}
                      onclick={this.fnOnAddStaticData}/>
                </ta-col>
              </ta-row>
              {/* 默认数据List */}
              {this.config.staticData.map((item, index) =>
                  <ta-row key={index} gutter={16} style={{ marginBottom: '10px', }}>
                    <ta-col span={20}>
                      <ta-input vModel_trim={item.value}/>
                    </ta-col>
                    <ta-col span={4}>
                      <ta-button type={'danger'} shape={'circle'} icon={'minus'}
                                 onclick={this.fnOnDeleteStaticData.bind(this, index)}/>
                    </ta-col>
                  </ta-row>
              )}
            </div>
          </ta-tab-pane>}
        </ta-tabs>
      </base-config>
    )
  },
}
