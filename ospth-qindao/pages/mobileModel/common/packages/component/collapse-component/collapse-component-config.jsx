import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'

export default {
  name: 'collapse-component-config',
  mixins: [componentConfigMixin],
  props: {
    // 要渲染的tab页
    tabsName: {
      type: Array,
      default: () => {
        return ['static']
      },
    },
    config: {
      type: Object,
      required: true,
    },
  },
  components: { baseConfig, },
  model: {
    prop: 'config',
    event: 'change',
  },
  data () {
    return {
    }
  },
  methods: {
    // static默认数据添加item
    fnOnAddStaticData () {
      this.config.staticData.push({ title: '', name: '', })
    },
    // static默认数据删除item
    fnOnDeleteStaticData (index) {
      this.config.staticData.splice(index, 1)
    },
    changeName(){
      if (this.config.accordion){
        this.config.activeNames = this.config.staticData[0].name
        this.config.active = this.config.staticData[0].name
      }else {
        this.config.activeNames = [this.config.staticData[0].name]
        this.config.active = [this.config.staticData[0].name]
      }
    },
    changeAccordion(value){
      if (value){
        this.config.activeNames = this.config.staticData[0].name
        this.config.active = this.config.staticData[0].name
      }else {
        this.config.activeNames = [this.config.staticData[0].name]
        this.config.active = [this.config.staticData[0].name]
      }
    }
  },
  render () {
    return (
      <base-config
        config={this.config}
        configNameList={this.getConfigNameList}
      >
        <ta-label-con label="标题栏大小">
          <ta-select vModel={this.config.size} style={{ width: '100%', }}>
            <ta-select-option value="large">large</ta-select-option>
            <ta-select-option value="normal">normal</ta-select-option>
          </ta-select>
        </ta-label-con>
        <ta-label-con label="手风琴模式">
          <ta-switch vModel={this.config.accordion} vOn:change={this.changeAccordion}/>
        </ta-label-con>
        <ta-tabs>
          {/* 静态数据tab页 */}
          {this.tabsName.includes('static') && <ta-tab-pane tab={'静态数据'} key={'static'}>
            <div>
              {/* 默认数据头 */}
              <ta-row gutter={16} style={{ marginBottom: '10px', }}>
                <ta-col span={10}>
                  <span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px', }}>标题</span>
                </ta-col>
                <ta-col span={10}>
                  <span style={{ fontWeight: 800, marginLeft: '5px', lineHeight: '32px', }}>编号</span>
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
                    <ta-input vModel_trim={item.title}/>
                  </ta-col>
                  <ta-col span={10}>
                    {index==0 && <ta-input vModel_trim={item.name} vOn:change={this.changeName}/>}
                    {index!=0 && <ta-input vModel_trim={item.name}/>}
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
