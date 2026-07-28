<template>
  <div class="query-criteria">
    <ComponentPanel title="查询登记信息">
      <div class="panel-content">
        <div class="input-wrapper">
          <label for="" class="label">登记时间</label>
          <ComponentPicker
            placeholder="请选择登记时间"
            idName="registime"
            mode="date"
            :endTime="today"
            v-model="formData.registime"
            @change="handlePickerChange"
          ></ComponentPicker>
        </div>

        <div class="input-wrapper">
          <label for="" class="label">人员类别</label>
          <ComponentPicker
            idName="aka131"
            placeholder="请选择人员类别"
            :range="aka131Range"
            rangeKey="aaa103"
            valueKey="aaa102"
            v-model="formData.aka131"
            @change="handlePickerChange"
          ></ComponentPicker>
        </div>

        <div class="button-wrapper">
          <ComponentButton
            type="primary"
            height="80rpx"
            @click="handleQueryData"
            name="查询"
          ></ComponentButton>
        </div>
      </div>
    </ComponentPanel>
  </div>
</template>
<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'
import ComponentPicker from '@/components/project/ez-picker/ez-picker.vue'

import { getDate } from '@/utils/get'

export default {
  name: 'pageEPRQueryCriteria',
  props: {
    aka131Range: {
      type: [Array],
      required: true,
    },
  },
  data() {
    return {
      formData: {
        registime: '',
        aka131: '',
      },
      toDay: getDate(),
    }
  },
  components: {
    ComponentPanel,
    ComponentButton,
    ComponentPicker,
  },
  mounted() {},
  methods: {
    handlePickerChange(id, valueDesc, value) {},
    // 查询
    handleQueryData() {
      this.$emit('query', this.formData)
    },
  },
  computed: {},
  watch: {},
}
</script>
<style lang="scss" scoped>
.query-criteria {
  width: 100%;
  .button-wrapper {
    padding: 20rpx 0;
  }
}
</style>
