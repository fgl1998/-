import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'

export default {
  name: 'steps-component-config',
  mixins: [componentConfigMixin],
  props: {
    config: {
      type: Object,
      required: true,
    },
    tabsName: {
      type: Array,
      default: () => {
        return ['static']
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
      this.config.staticData.push({ label: '', value: '', })
    },
    // static默认数据删除item
    fnOnDeleteStaticData (index) {
      this.config.staticData.splice(index, 1)
    },
  },
  render () {
    return (
      <base-config
        config={this.config}
        configNameList={this.getConfigNameList}
      >
        <ta-label-con label="当前步骤">
          <ta-input placeholder="请输入当前步骤" vModel={this.config.active}/>
        </ta-label-con>
        <ta-label-con label="显示方向">
          <ta-select vModel={this.config.direction} style={{ width: '100%', }}>
            <ta-select-option value="horizontal">水平</ta-select-option>
            <ta-select-option value="vertical">垂直</ta-select-option>
          </ta-select>
        </ta-label-con>
        {
          this.config.direction === 'vertical' && <ta-label-con label="居中对齐(垂直时有效)">
            <ta-switch vModel={this.config.center}/>
          </ta-label-con>
        }
        <ta-label-con label="激活颜色">
          <ta-input placeholder="请输入激活状态颜色" vModel={this.config.activeColor}/>
        </ta-label-con>
        <ta-label-con label="激活图标">
          <ta-input placeholder="请输入激活状态底部图标" vModel={this.config.activeIcon}/>
        </ta-label-con>
        <ta-label-con label="未激活图标">
          <ta-input placeholder="请输入未激活状态底部图标" vModel={this.config.inactiveIcon}/>
        </ta-label-con>
        <ta-label-con label="已完成图标">
          <ta-input placeholder="请输入已完成步骤对应的底部图标" vModel={this.config.finishIcon}/>
        </ta-label-con>
        <ta-tabs>
          {/* 静态数据tab页 */}
          {this.tabsName.includes('static') && <ta-tab-pane tab={'静态数据'} key={'static'}>
            <div>
              {/* 默认数据头 */}
              <ta-row gutter={16} style={{ marginBottom: '10px', }}>
                <ta-col span={10}>
                  <span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px', }}>Value</span>
                </ta-col>
                <ta-col span={10}>
                  <span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px', }}>time</span>
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
                  <ta-col span={10}>
                    <ta-input vModel_trim={item.value}/>
                  </ta-col>
                  <ta-col span={10}>
                    <ta-input vModel_trim={item.time}/>
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
