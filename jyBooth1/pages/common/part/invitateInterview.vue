<!-- 面试邀请 -->
<template>
  <div class="invitateInterview">
    <ta-form
      :autoFormCreate="
        (form) => {
          this.form = form;
        }
      "
      layout="vertical"
      :col="2"
      :form-layout="true"
      id="invitateInterview"
    >
      <!-- <ta-form-item label="选择模板" fieldDecoratorId="acb220">
        <ta-select
          placeholder="请选择"
          :getPopupContainer="getPopupContainer"
          @change="getContactsMsg"
        >
          <ta-select-option
            v-for="(item, index) in cb22Vos"
            :value="item.acb220"
            :key="index"
          >
            {{ item.acb227 }}
          </ta-select-option>
        </ta-select>
      </ta-form-item> -->

      <ta-form-item
        label="面试职位"
        fieldDecoratorId="acb210"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: '请选择面试职位' }],
        }"
      >
        <ta-select
          placeholder="请选择"
          :getPopupContainer="getPopupContainer"
          @select="cb21Select"
        >
          <ta-select-option
            v-for="(item, index) in cb21Vos"
            :value="item.acb210"
            :key="index"
          >
            {{ item.acb213 }}
          </ta-select-option>
        </ta-select>
      </ta-form-item>

      <ta-form-item
        label="被邀请人"
        fieldDecoratorId="aac003"
        disabled
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: '请填写被邀请人' }],
        }"
        :initValue="aac003"
      >
        <ta-input placeholder="请输入" />
      </ta-form-item>

      <ta-form-item
        label="面试方式"
        fieldDecoratorId="acc315"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: '请选择面试方式' }],
        }"
      >
        <ta-radio-group @change="changeRadio">
          <ta-radio :value="0">线下面试</ta-radio>
          <ta-radio :value="1">线上面试</ta-radio>
        </ta-radio-group>
      </ta-form-item>

      <ta-form-item
        label="面试时间"
        fieldDecoratorId="acb222"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: '请选择面试时间' }],
        }"
      >
        <ta-date-picker
          showTime
          placeholder="选择面试时间"
          :getCalendarContainer="getPopupContainer"
          :disabledDate="disabledDate"
          :disabledTime="disabledDateTime"
          v-model="faceTime"
        />
      </ta-form-item>

      <ta-form-item
        label="面试地址"
        fieldDecoratorId="acb223"
        v-if="adressFlag"
      >
<!--        <region-area @getValue="getWorkArea" class="special"></region-area>-->
        <ta-input placeholder="请输入面试地址"></ta-input>
      </ta-form-item>

      <ta-form-item
        label="联系人"
        fieldDecoratorId="acb224"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: '请选择联系人' }],
        }"
      >
        <ta-input placeholder="请输入" />
      </ta-form-item>

      <ta-form-item
        label="联系电话"
        fieldDecoratorId="acb225"
        :fieldDecoratorOptions="{
          rules: [
            { required: true, message: '请填写联系电话' },
            { phone: 'mobile', message: '输入的手机号码不合法' },
          ],
        }"
      >
        <ta-input placeholder="请输入" />
      </ta-form-item>

      <ta-form-item
        label="邀请说明"
        fieldDecoratorId="acb221"
        :fieldDecoratorOptions="{
          rules: [{ required: true, message: '请填写邀请说明' }],
        }"
        :span="24"
        class="textArea"
      >
        <ta-textarea
          placeholder="请填写邀请说明"
          :rows="4"
          :show-length="true"
          width="100%"
        />
      </ta-form-item>
    </ta-form>
    <div>
      <ta-button style="margin-right: 16px" @click="handleCancel"
        >取消</ta-button
      >
      <ta-button type="primary" @click="fnSubmit" :disabled="submitDisabled"
        >确定</ta-button
      >
    </div>
  </div>
</template>

<script>
import moment from "moment";
import regionArea from "../../common/part/regionArea.vue";

export default {
  name: "invitateInterview",
  props: {
    aac001: {
      type: Number,
    },
    aac003: {
      type: String,
    },
    acc200: {
      type: Number,
    },
    acc300: {
      type: Number,
    },
    acb210: {
      type: Number,
    },
    showInvitate: {
      type: Boolean,
    },
  },
  components: {
    regionArea,
  },
  data() {
    return {
      isShow: this.showInvitate,
      adressFlag: true,
      userInfo: {},
      //职位
      cb21Vos: [],
      //模板
      cb22Vos: [],
      faceTime: "",
      submitDisabled: false,
    };
  },

  watch: {
    showInvitate: {
      handler(val) {
        //console.log('val', val)
        if (val) {
          //console.log('进入')
          this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
          this.searchEvent();
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    moment,
    //查询职位信息
    searchEvent() {
      let params = {};
      params.aab001 = this.userInfo.aab001;
      params.aac001 = this.userInfo.aac001;
      params.acb228 = "0";
      params.apiCode = "jy201_hrm119";
      params.method = "jy201_hrm119";
      this.$http.request('/api/business/getData.do','post',params,true).then((data)=>{
        let resultData = data.data;
        this.cb21Vos = resultData.cb21Vos;
        this.cb22Vos = resultData.cb22Vos;
        if(this.acb210){
          this.cb21Select(this.acb210)
        }
      })
    },
    //职位选择
    cb21Select(value) {
      //console.log('cb21Vos',this.cb21Vos)
      //console.log('传入的值',value)
      let cb21Obj = this.cb21Vos.find((item) => {return item.acb210 == value+''});
      //console.log('获取的对象',cb21Obj)
      if(cb21Obj){
        this.form.setFieldsValue({acb210: cb21Obj.acb210});
        this.form.setFieldsValue({acb224: cb21Obj.aac003});
        this.form.setFieldsValue({acb225: cb21Obj.aac307});
        this.form.setFieldsValue({acb223: cb21Obj.acb261});
      }
    },
    // 获取说明
    getContactsMsg(value) {
      let record=this.form.getFieldsValue()
      let cb22Obj = this.cb22Vos.find((item) => item.acb220 == value);
      this.form.setFieldsValue({
        acb221: cb22Obj.acb221,
        acb224: cb22Obj.acb224,
        acb225: cb22Obj.acb225,
      });
      if(record){
        this.form.setFieldsValue({acb210: record.acb210});
        this.form.setFieldsValue({acb224: record.acb224});
        this.form.setFieldsValue({acb225: record.acb225});
        this.form.setFieldsValue({acb223: record.acb223});
      }
    },
    // 确定
    //单位面试邀请(企业自己查询人才进行面试邀请)必传字:aab095: 是否人力资源机构(1是，0否); aab001; 单位或机构编号aab004: 单位或机构名称; aac001:个人编号， aCC200简历编号
    fnSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.acb222 = values.acb222.format("YYYY-MM-DD HH:mm");
          let params = { ...values };
          params.aab095 = this.userInfo.aab095;
          params.aab001 = this.userInfo.aab001;
          params.aab004 = this.userInfo.aab004;
          params.acc300 = this.acc300
          params.hrAac001 = this.userInfo.aac001
          params.hrAac003 = this.userInfo.aac003

          params.aac001 = this.aac001;
          params.acc200 = this.acc200;
          params.acc04v = "0";
          params.yae100 = "25";
          params.apiCode = "jy201_hrm101";
          params.method = "jy201_hrm101";
          this.$http.request('/api/business/getData.do','post',params,true).then((data)=>{
            if (data.errors.length > 0) {
              uni.showToast({
                title: data.errors[0].msg,
                icon: 'error',
              })
            } else {
              this.$utils.showMessageModal('面试邀请提示','面试邀请成功')
              this.submitDisabled = true;
              let invitateMesg = data.data.data;
              invitateMesg.state = true;
              this.$emit("getInvitateMesg", invitateMesg);
              this.$eventBus.$emit('statistic')
            }
          })
        }
      });
    },
    // 取消
    handleCancel() {
      this.isShow = false;
      this.submitDisabled = false;
      this.form.resetFields()
      this.$emit("colseInvitate", this.isShow);
    },
    changeRadio(event) {
      if (event.target.value === 1) {
        this.adressFlag = false;
        this.form.setFieldsValue({ acb223: "" });
      } else {
        this.adressFlag = true;
      }
    },
    // 获取工作区域
    getWorkArea(value) {
      this.form.setFieldsValue({
        acb223: value.label,
      });
    },
    // 下拉框定位
    getPopupContainer() {
      return document.getElementById("invitateInterview");
    },
    // 限定面试时间
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    disabledDate(current) {
      return current < moment().startOf("day");
    },
    disabledDateTime() {
      let chooseTime = moment(this.faceTime).format("YYYYMMDD");
      let nowDay = moment(new Date()).format("YYYYMMDD");
      let nowHour = moment(new Date()).format("HH");
      if (nowDay == chooseTime) {
        return {
          disabledHours: () => this.range(0, Number(nowHour) + 1),
        };
      } else {
        return;
      }
    },
  },
};
</script>

<style scoped>
/* @import "../../common/css/reset.css"; */
</style>

<style lang="less" scoped>
// @import "../../common/css/common.less";
// @import "../css/recruitTalents.less";
.invitateInterview {
  width: 100%;
  height: 100%;
  //padding: 50px;
  box-sizing: border-box;
  background-color: #fff;
  > form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .ant-row::before {
    display: none;
  }
  > div {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    > button {
      width: 100px;
      height: 40px;
      font-size: 16px;
    }
  }
}
/deep/.ant-form-item:not(.textArea) {
  width: 47%;
}
/deep/ .ant-form label,
/deep/.ant-form-item-info {
  font-size: 16px;
}
/deep/.ant-form-item:nth-of-type(2n) {
  // margin-left: 14px;
}
/deep/.ant-radio-wrapper-checked {
  > .ant-radio-checked {
    > .ant-radio-inner {
      background-color: #007dee;
    }
    .ant-radio-inner::after {
      top: 4px;
      left: 4px;
      width: 6px;
      height: 6px;
      background-color: #fff;
    }
  }
  > span:nth-of-type(2) {
    color: #007dee;
  }
}
/deep/.ant-calendar-picker {
  width: 100%;
}
</style>
