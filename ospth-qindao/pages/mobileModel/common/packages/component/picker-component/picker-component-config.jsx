import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'
import dataTabs from '../../commonComponentConfig/dataTabs'

export default {
  name: 'picker-component-config',
  mixins: [componentConfigMixin],
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  components: { baseConfig, dataTabs},
  model: {
    prop: 'config',
    event: 'change',
  },
  data () {
    return {
      defaultConfigNameList: [
          'name',
          'label',
          'css',
          'display',
          'required',
          'disabled'
      ],
    }
  },
  computed: {
    // 静态数据tab渲染
    staticTab() {
      return {
        static: (scope) => {
          return (
              <div>
                {/* 默认数据头 */}
                <ta-row gutter={16} style={{ marginBottom: '10px' }}>
                  <ta-col span={10}>
                    <span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px' }}>Value</span>
                  </ta-col>
                  <ta-col span={10}>
                    <span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px' }}>Label</span>
                  </ta-col>
                  <ta-col span={4}>
                    <ta-button type={'primary'} shape={'circle'} icon={'plus'}
                               onclick={this.fnOnAddStaticData}/>
                  </ta-col>
                </ta-row>
                {/* 默认数据List */}
                {this.config.staticData.map((item, index) =>
                    <ta-row key={index} gutter={16} style={{ marginBottom: '10px' }}>
                      <ta-col span={10}>
                        <ta-input vModel_trim={item.name}/>
                      </ta-col>
                      <ta-col span={10}>
                        <ta-input vModel_trim={item.label}/>
                      </ta-col>
                      <ta-col span={4}>
                        <ta-button type={'danger'} shape={'circle'} icon={'minus'}
                                   onclick={this.fnOnDeleteStaticData.bind(this, index)}/>
                      </ta-col>
                    </ta-row>
                )}
              </div>
          )
        }
      }
    },
  },
  methods: {
    // static默认数据添加item
    fnOnAddStaticData () {
      this.config.staticData.push({ name: '', label: '' })
    },
    // static默认数据删除item
    fnOnDeleteStaticData (index) {
      this.config.staticData.splice(index, 1)
    }
  },
  render () {
    return (
      <base-config
        config={this.config}
        configNameList={this.getConfigNameList}
      >
        <ta-label-con label="顶部栏">
          <ta-switch vModel={this.config.showToolbar}/>
        </ta-label-con>
        {
          this.config.showToolbar === true &&
          <div>
            <ta-label-con label="标题">
              <ta-input placeholder="请输入Title" vModel={this.config.title}/>
            </ta-label-con>
          </div>
        }
        <ta-label-con label="默认选中">
          <ta-input-number placeholder="请输入默认选中的索引" vModel={this.config.defaultIndex}
                           max={this.config.staticData.length-1} min={0}/>
        </ta-label-con>
        <div style={{ marginBottom: '24px' }}>
          <data-tabs tabsName={['static', 'remote', 'dict']} vModel={this.config} scopedSlots={this.staticTab}/>
        </div>
      </base-config>
    )
  },
}
