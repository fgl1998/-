<template>
  <view>
    <!-- ① 抵押人列表（特别说明5：新增=追加行，删除=移除行） -->
    <box-title title="抵押人信息" />

    <!-- 现有抵押人行 -->
    <view v-for="item in mortgagorList" :key="item.id"
      :class="['mort-card', item._deleted ? 'mort-card--deleted' : item.isBorrower ? 'mort-card--borrower' : '']">
      <view class="mc-head">
        <text v-if="item.isBorrower" class="mc-tag mc-tag--borrower">借款人</text>
        <text class="mc-name">{{ item.xingming }}</text>
        <text class="mc-changetype">{{ item._deleted ? '变更类型：删除' : '变更类型：只读' }}</text>
        <view v-if="!item.isBorrower" :class="['op-btn', item._deleted ? 'op-btn--undo' : 'op-btn--del']"
          @click="toggleDeleteMortgagor(item)">
          {{ item._deleted ? '撤销' : '删除' }}
        </view>
      </view>
      <view class="mc-body">
        <view class="mc-row"><text class="mc-lbl">证件类型：</text><text class="mc-val">{{ item.zjlxDesc }}</text></view>
        <view class="mc-row"><text class="mc-lbl">证件号码：</text><text class="mc-val">{{ item.zjhm }}</text></view>
        <view class="mc-row"><text class="mc-lbl">共有方式：</text><text class="mc-val">{{ item.gyfsDesc }}</text></view>
        <view class="mc-row"><text class="mc-lbl">共有比例：</text><text class="mc-val">{{ item.gydbl }}%</text></view>
        <view class="mc-row"><text class="mc-lbl">登记时间：</text><text class="mc-val">{{ item.djsj }}</text></view>
        <view class="mc-row"><text class="mc-lbl">手机号码：</text><text class="mc-val">{{ item.sjhm }}</text></view>
      </view>
    </view>

    <!-- 新增抵押人内联编辑行（特别说明5） -->
    <view v-for="(row, i) in editingMortgagors" :key="'edit' + i" class="mort-card mort-card--add">
      <view class="mc-head">
        <text class="mc-tag mc-tag--add">新增</text>
        <text class="mc-name">{{ row.add_xingming || '（录入中）' }}</text>
        <text class="mc-changetype">变更类型：新增</text>
        <view class="op-btn op-btn--del" @click="removeEditingRow(i)">删除</view>
      </view>
      <view class="mc-body">
        <van-cell-group inset>
          <van-field v-model="row.add_zjhm"     label="证件号码"    :required="true"  input-align="right" placeholder="请输入" />
          <van-field v-model="row.add_xingming" label="姓名"        :required="true"  input-align="right" placeholder="请输入" />
          <van-field v-model="row.add_csrq"     label="出生日期"    :required="false" input-align="right" placeholder="YYYY-MM-DD" />
          <van-field v-model="row.add_sjhm"     label="手机号码"    :required="false" input-align="right" placeholder="请输入" />
          <van-field v-model="row.add_gydbl"    label="共有比例(%)" :required="false" input-align="right" placeholder="请输入" type="number" />
          <van-field v-model="row.add_dywfwzl"  label="抵押物坐落" :required="true"  input-align="right" placeholder="请输入" />
          <van-field v-model="row.add_fwjzmj"   label="建筑面积(㎡)" :required="false" input-align="right" placeholder="请输入" type="number" />
          <van-field v-model="row.add_fwtnmj"   label="套内面积(㎡)" :required="false" input-align="right" placeholder="请输入" type="number" />
        </van-cell-group>
      </view>
    </view>

    <!-- 新增按钮 -->
    <view class="add-row-btn" @click="addNewMortgagorRow">
      <text>+ 新增抵押人</text>
    </view>

    <!-- ② 变更信息（含条件字段：变更抵押/变更还款卡） -->
    <box-title title="变更信息" />
    <van-form ref="changeForm" :scroll-to-error="true">
      <template v-for="(item, idx) in formConfig.fields">
        <van-form-item-map
          :key="'ci' + idx"
          v-if="!item.if || item.if(formData)"
          :formItemConfig.sync="item"
          :formData="formData"
        />
      </template>
    </van-form>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/loan/relatedPersonMortgagorChange/two/mixin'

export default {
  name: 'MortgagorChangeTwo',
  mixins: [mixin],
}
</script>

<style lang="scss" scoped>
.mort-card {
  background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx;
  border: 2rpx solid #e5e7eb;
  &--borrower { border-color: #1492ff; }
  &--deleted  { opacity: 0.55; border-color: #f56c6c; background: #fff5f5; }
  &--add      { border-color: #52c41a; background: #f6ffed; }
}
.mc-head { display: flex; align-items: center; margin-bottom: 16rpx; gap: 12rpx; }
.mc-tag  { font-size: 22rpx; color: #fff; padding: 4rpx 14rpx; border-radius: 20rpx; flex-shrink: 0;
  &--borrower { background: #1492ff; }
  &--add      { background: #52c41a; } }
.mc-name       { flex: 1; font-size: 30rpx; font-weight: 600; color: #333; }
.mc-changetype { font-size: 22rpx; color: #999; flex-shrink: 0; }
.op-btn { font-size: 26rpx; padding: 4rpx 16rpx; border-radius: 8rpx; flex-shrink: 0;
  &--del  { color: #f56c6c; border: 1rpx solid #f56c6c; }
  &--undo { color: #1492ff; border: 1rpx solid #1492ff; } }
.mc-body {}
.mc-row { display: flex; margin-bottom: 10rpx; font-size: 26rpx; }
.mc-lbl { min-width: 170rpx; color: #666; }
.mc-val { flex: 1; color: #333; }
.add-row-btn {
  text-align: center; padding: 20rpx; margin: 16rpx 0;
  background: #f5f7fa; border-radius: 10rpx; color: #52c41a; font-size: 28rpx; font-weight: 600;
  border: 1rpx dashed #52c41a;
}
</style>
