import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'
import dataTabs from '../../commonComponentConfig/dataTabs'
import moment from "moment";

export default {
  name: 'calendar-component-config',
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
      dateRange: [],
      defaultConfigNameList: [
        'name',
        'label',
        'display',
        'css',
        'required',
        'title',
        'placeholder',
        'disabled'
      ],
    }
  },
  created() {
    let dateRange = this.config.dateRange
    if(dateRange.length > 0) {
      this.dateRange[0] = moment(dateRange[0], 'YYYY-MM-DD')
      this.dateRange[1] = moment(dateRange[1], 'YYYY-MM-DD')
    }
  },
  watch:{
    dateRange(val){
      this.config.dateRange = val.map(item => {
        return item.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      })
    }
  },
  render () {
    return (
        <base-config
            config={this.config}
            configNameList={this.getConfigNameList}
        >
          <ta-label-con label="选择类型">
            <ta-select vModel={this.config.calendarType} style={{width:'100%'}}>
              <ta-select-option value="single">single</ta-select-option>
              <ta-select-option value="multiple">multiple</ta-select-option>
              <ta-select-option value="range">range</ta-select-option>
            </ta-select>
          </ta-label-con>
          {
            ['range', 'multiple'].includes(this.config.calendarType) &&
            <div>
              <ta-label-con label="最多可选天数">
                <ta-input-number placeholder="请输入最多可选天数" vModel={this.config.maxRange}/>
              </ta-label-con>
              <ta-label-con label="提示文案">
                <ta-input placeholder="请输入提示文案" vModel={this.config.rangePrompt}/>
              </ta-label-con>
            </div>
          }
          <ta-label-con label="选择区间">
            <ta-range-picker placeholder={['最小日期', '最大日期']} vModel={this.dateRange}/>
          </ta-label-con>
          <ta-label-con label="选择类型">
            <ta-select vModel={this.config.position} style={{width:'100%'}}>
              <ta-select-option value="bottom">bottom</ta-select-option>
              <ta-select-option value="top">top</ta-select-option>
              <ta-select-option value="right">right</ta-select-option>
              <ta-select-option value="left">left</ta-select-option>
            </ta-select>
          </ta-label-con>
          <ta-label-con label="确认按钮">
            <ta-switch vModel={this.config.showConfirm}  />
          </ta-label-con>
        </base-config>
    )
  },
}
