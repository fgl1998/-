<!-- 提取人身份 -->
<template>
  <view>
    <van-form ref="form" :scroll-to-error="true">
      <box-title title="提取类型"/>
      <van-form-item-map
          v-for="(item, index) in formConfig.fields"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
      <box-title title="产权人信息" v-if="formConfig.isNotMyself(formData)"/>
      <van-form-item-map
          v-for="(item, index) in formConfig.fields2"
          :key="index"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
      />
    </van-form>

    <van-popup v-if="showFilePopup" v-model="showFilePopup" class="file-popup" position="bottom"
               :style="{height: '50%', display: 'flex', flexDirection: 'column'}" round>
      <box-title title="根据购房材料进行选择"/>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell v-for="(item,index) in radioLabel" :title="item.name" :key="index"
                    @click="()=>{radio = item.value;}">
          <template #right-icon>
              <van-radio :name="item.value"/>
            </template>
          </van-cell>
        </van-cell-group>

      </van-radio-group>

      <van-button class="file-popup-button" type="info" block @click="filePopupConfirm">确定</van-button>
    </van-popup>
  </view>
</template>
<script>
import mixin from '@osppm/store/person/fetch/housePurchase/one/mixin'

export default {
  name: 'one',
  mixins: [mixin],

}
</script>
<style scoped lang="scss">
.file-popup-button {
  margin-top: auto;
}
</style>
