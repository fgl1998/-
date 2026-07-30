<template>
  <div class="form-page">
    <!-- 纯折叠面板（无提交按钮！） -->
    <van-collapse v-model="activeNames">
      <!-- 1. 身份信息 -->
      <van-collapse-item title="身份信息" name="1">
        <van-form ref="form1" :scroll-to-error="true">
          <template v-for="(item, index) in formConfig.fields">
            <van-form-item-map
              :key="index"
              v-if="!item.if || item.if(formData)"
              :formItemConfig.sync="item"
              :formData="formData"
            />
          </template>
        </van-form>
      </van-collapse-item>

      <!-- 2. 缴存情况 -->
      <van-collapse-item title="缴存情况" name="2">
        <van-form ref="form2" :scroll-to-error="true">
          <template v-for="(item, index) in formConfig.depositFields">
            <van-form-item-map
              :key="index"
              v-if="!item.if || item.if(formData)"
              :formItemConfig.sync="item"
              :formData="formData"
            />
          </template>
        </van-form>
      </van-collapse-item>

      <!-- 3. 银行卡信息 -->
      <van-collapse-item title="银行卡信息" name="3">
        <van-form ref="form3" :scroll-to-error="true">
          <template v-for="(item, index) in formConfig.bankFields">
            <van-form-item-map
              :key="index"
              v-if="!item.if || item.if(formData)"
              :formItemConfig.sync="item"
              :formData="formData"
            />
          </template>
        </van-form>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { BuzType } from '@osppm/common/formConfigEnum';
import { loadFormConfig } from '@osppm/utils/configLoader';
import createFormLogic from '@osppm/composables/flexmp/formLogic';

export default {
  name: "one",
  data() {
    return {
      activeNames: ['1'], // 默认展开第一个模块
      user: {},
      formConfig: { fields: [], depositFields: [], bankFields: [] },
      formData: {},
    };
  },

  async created() {
    try {
      const form = createFormLogic();
      form.state.formConfig = await loadFormConfig(BuzType.FLEXEMP_REGISTER);
      this.formConfig = form.state.formConfig;
      this.formData = form.state.formData;
      form.initForm();
    } catch (err) {
      console.error('加载表单配置失败：', err);
      this.formConfig = { fields: [], depositFields: [], bankFields: [] };
      this.formData = {};
    }
  },

  computed: {
    ...mapState('retire', ['accInfo', 'codeValues', 'bankAccList', 'fetchInfo']),
  },

  methods: {
    ...mapMutations('retire', ['setYwdjh', 'setAccInfo']),
    ...mapActions('retire', ['queryBankCardInfo', 'getFetchAmount', 'preCheck', 'fetchCommit', 'init']),

    // 给父组件调用的表单校验方法（父组件提交时用）
    async validateAll() {
      try {
        await Promise.all([
          this.$refs.form1.validate(),
          this.$refs.form2.validate(),
          this.$refs.form3.validate()
        ]);
        return true;
      } catch (error) {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.form-page {
  padding: 10px;
  background: #f5f6f7;
  min-height: 100vh;
}
</style>
