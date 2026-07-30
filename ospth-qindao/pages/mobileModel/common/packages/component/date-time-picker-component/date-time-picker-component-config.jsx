import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'
import dataTabs from '../../commonComponentConfig/dataTabs'
import moment from "moment";

export default {
  name: 'date-time-picker-component-config',
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
      dateRange:[],
      defaultConfigNameList: [
          'name',
          'css',
          'required',
          'label',
          'display',
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
        <ta-label-con label="时间类型">
          <ta-select vModel={this.config.timeType} style={{width:'100%'}}>
            <ta-select-option value="datetime">datetime</ta-select-option>
            <ta-select-option value="date">date</ta-select-option>
            <ta-select-option value="time">time</ta-select-option>
            <ta-select-option value="year-month">year-month</ta-select-option>
            <ta-select-option value="month-day">month-day</ta-select-option>
            <ta-select-option value="datehour">datehour</ta-select-option>
          </ta-select>
        </ta-label-con>
        {
          ['date', 'datetime'].includes(this.config.timeType) &&
          <ta-label-con label="选择区间">
            <ta-range-picker placeholder={['最小日期', '最大日期']} vModel={this.dateRange}/>
          </ta-label-con>
        }
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
      </base-config>
    )
  },
}
