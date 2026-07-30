import '../../../style/component-deep.css'
export default {
  name: 'list-business-component',
  props: {
    componentConfig: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  data () {
    return {
      activeNames: ['0'],
      list: [],
      loading: false,
      finished: false,
    }
  },
  methods: {
    normalRadioGroup () {
      const { dataType, staticData, finishedText, } = this.$props.componentConfig
      const { $listeners, $scopedSlots, } = this
      const listProps = {
        props: {
          finishedText,
        },
        on: {
          ...$listeners,
        },
        scopedSlots: $scopedSlots,
      }
      let dataSource = []
      if (dataType === 'static') {
        dataSource = staticData || []
      }
      const children = dataSource.map((item, index) => (
        <div name={index} style={{ padding: '10px 0 0 0', }}>
          <van-collapse vModel={this.activeNames}>
            <van-collapse-item
              title={item.title}
              name={'' + index}
              key={item.title}
              style={{ padding: '10px 0', }}
            >
              <van-cell-group border={false}>
                {
                  item.children.map((column,index2) => (
                    <van-cell name={index2} title={column.label ? column.label + ':' + column.title : column.title } value={column.key ? column.key + ':' + column.value : column.value } label={column.description} border={column.border}/>
                  ))
                }
              </van-cell-group>
            </van-collapse-item>
          </van-collapse>
        </div>
      ))
      return (
        <van-list
          {...listProps}
          vModel={this.loading}
          finished={this.finished}
          finished-text="没有更多了"
        >
          {children}
        </van-list>
      )
    },
  },
  render () {
    return this.normalRadioGroup()
  },
}
