import baseConfig from '../../commonComponentConfig/base-config'
import componentConfigMixin from '../../../mixin/componentConfigMixin'
import dataTabs from '../../commonComponentConfig/dataTabs'

export default {
  name: 'list-business-component-config',
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
  components: { baseConfig, dataTabs},
  model: {
    prop: 'config',
    event: 'change',
  },
  data () {
    return {
      editModalVisible: false, // 添加或编辑node的model的visible
      operateType: 'add', // 当前操作
      nodeData: {}, // 操作的当前节点数据
      form: {}, // 表单
      treeProps: {
        id: 'value',
        label: 'text',
        children: 'children'
      }, // 树节点属性配置
      treeAllKeys: [], //树的所有key
      defaultConfigNameList: [
        'name',
        "label",
      ],
    }
  },
  created () {
    // 递归遍历所有节点，将所有key添加到treeAllKeys数组
    const initNodeKeys = function (tempArr, operate) {
      let res = undefined
      for (let i = 0; !res && i < tempArr.length; i++) {
        operate(tempArr[i])
      }
      for (const element of tempArr) {
        if (element.children) initNodeKeys(element.children, operate)
      }
    }
    initNodeKeys(this.config.staticData, (obj) => {
      this.treeAllKeys.push(obj.value)
    })
  },
  computed: {
    // 静态数据tab渲染etree
    staticTab () {
      const eTreeProps = {
        props: {
          draggable: true,
          data: this.config.staticData,
          props: this.treeProps,
          nodeKey: 'value',
        },
        scopedSlots: this.eTreeNodeSlot
      }
      return {
        static: (scope) => {
          return (
            <ta-e-tree {...eTreeProps} ref="cascaderETree"/>
          )
        }
      }
    },
    // eTree节点slot
    eTreeNodeSlot () {
      return {
        default: ({ node, data }) => {
          return (
            <div style="width: 100%">
              <span>{data.title}</span>
              <span style="float: right">
                {
                  data.children && <a style="margin-right: 4px" vOn:click_stop={this.fnPreAddOrEdit.bind(this, data, 'add')}><ta-icon
                    type="plus-circle-o"/></a>
                }
                <a style="margin-right: 4px" vOn:click_stop={this.fnPreAddOrEdit.bind(this, data, 'edit')}><ta-icon
                  type="edit"/></a>
                <span vOn:click_stop={''}>
                  <ta-popconfirm title="确定删除该节点么？" vOn:confirm={this.fnDelete.bind(this, data)}>
                    <a style="margin-right: 4px"><ta-icon type="delete"/></a>
                  </ta-popconfirm>
                </span>
              </span>
            </div>
          )
        }
      }
    },
    // 根据操作类型返回drawer的title
    modalTitle () {
      if (this.operateType === 'add') return '新增节点'
      if (this.operateType === 'addRoot') return '新增根节点'
      if (this.operateType === 'edit') return '编辑节点'
    },
  },
  methods: {
    // 添加根节点，设置操作类型，展开drawer
    fnOnAddRootNode () {
      this.operateType = 'addRoot'
      this.editModalVisible = true
    },
    // 添加或编辑，设置操作类型，展开drawer
    fnPreAddOrEdit (data, operateType) {
      this.operateType = operateType
      this.nodeData = data
      this.editModalVisible = true
    },
    // 添加或编辑，校验key是否重复，保存数据
    fnOnAddOrEdit () {
      this.form.validateFieldsAndScroll((error) => {
        if (!error) {
          const formData = this.form.getFieldsValue()
          if (this.operateType === 'add') {
            // if (this.treeAllKeys.includes(formData.value)) {
            //   this.$message.error('节点value重复')
            //   return
            // }
            this.treeAllKeys.push(formData.title)
            this.$refs.cascaderETree.append(formData, this.nodeData)
            const index = this.config.staticData.indexOf(this.nodeData)
            this.config.staticData[index].children.push(formData)
          } else if (this.operateType === 'edit') {
            this.$set(this.nodeData, 'title', formData.title)
            this.$set(this.nodeData, 'label', formData.label)
            this.$set(this.nodeData, 'value', formData.value)
            this.$set(this.nodeData, 'key', formData.key)
            this.$set(this.nodeData, 'description', formData.description)
            this.$set(this.nodeData, 'border', formData.border)
          } else if (this.operateType === 'addRoot') {
            // if (this.treeAllKeys.includes(formData.value)) {
            //   this.$message.error('节点value重复')
            //   return
            // }
            this.treeAllKeys.push(formData.value)
            formData.children = []
            this.config.staticData.push(formData)
          }
          this.editModalVisible = false
        }
      })
    },
    // 删除node
    fnDelete (data) {
      this.$refs.cascaderETree.remove(data.value)
    }
  },
  render () {
    return (
      <base-config
        config={this.config}
        configNameList={this.getConfigNameList}
      >
        <ta-label-con label="加载完成提示文字">
          <ta-input placeholder="如：没有更多了" vModel={this.config.finished}/>
        </ta-label-con>
        <div style={{marginBottom: '24px'}}>
          <data-tabs vModel={this.config} tabsName={['static', 'remote']} scopedSlots={this.staticTab}/>
          {this.config.dataType === 'static' && (
            <div style="font-size:12px;margin-left:20px">
              <a onClick={this.fnOnAddRootNode}>添加根节点</a>
            </div>
          )}
          <ta-modal
            visible={this.editModalVisible}
            title={this.modalTitle}
            height={(this.nodeData.label || ['add'].includes(this.operateType)) ? '210px' : '80px'}
            vOn:ok={this.fnOnAddOrEdit}
            vOn:cancel={() => this.editModalVisible = false}
            destroyOnClose={true}
            maskClosable={false}
            closable={false}>
            <ta-form autoFormCreate={(form) => {
              this.form = form
            }}>
              {(this.nodeData.label || ['add'].includes(this.operateType)) && <ta-form-item
                label="左侧key"
                fieldDecoratorId="label"
                initValue={this.operateType === 'edit' ? this.nodeData.label : ''}>
                <ta-input/>
              </ta-form-item>}
              <ta-form-item
                label="左侧value"
                fieldDecoratorId="title"
                require={{message: '请输入节点value'}}
                initValue={this.operateType === 'edit' ? this.nodeData.title : ''}>
                <ta-input/>
              </ta-form-item>
              {(this.nodeData.label || ['add'].includes(this.operateType)) && <ta-form-item
                label="右侧key"
                fieldDecoratorId="key"
                initValue={this.operateType === 'edit' ? this.nodeData.key : ''}>
                <ta-input/>
              </ta-form-item>}
              {(this.nodeData.label || ['add'].includes(this.operateType)) && <ta-form-item
                label="右侧value"
                fieldDecoratorId="value"
                initValue={this.operateType === 'edit' ? this.nodeData.value : ''}>
                <ta-input/>
              </ta-form-item>}
              <ta-form-item
                label="左侧描述信息"
                fieldDecoratorId="description"
                initValue={this.operateType === 'edit' ? this.nodeData.description : ''}>
                <ta-input/>
              </ta-form-item>
              <ta-form-item
                label="是否有边框"
                fieldDecoratorId="border"
                initValue={this.operateType === 'edit' ? this.nodeData.border : ''}>
                <ta-switch />
              </ta-form-item>
            </ta-form>
          </ta-modal>
        </div>
      </base-config>
    )
  },
}
