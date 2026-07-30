<template>
  <view>
    <!-- ① 贷款信息（只读反显） -->
    <box-title title="贷款信息" />
    <van-form>
      <template v-for="(item, idx) in formConfig.loanInfoFields">
        <van-form-item-map :key="'loan' + idx" :formItemConfig.sync="item" :formData="loanFormData" />
      </template>
    </van-form>

    <!-- ② 当前关联人列表 -->
    <box-title title="贷款关联人信息" />
    <view v-if="relatedPersonList.length === 0" class="empty-tip"><text>暂无关联人信息</text></view>
    <view v-for="person in relatedPersonList" :key="person.id"
      :class="['person-card', isDeleted(person) ? 'person-card--deleted' : person.isBorrower ? 'person-card--borrower' : '']">
      <view class="pc-head">
        <text class="pc-tag">{{ getCdgxLabel(person.cdgx) }}</text>
        <text class="pc-name">{{ person.xingming }}</text>
        <text class="pc-changetype">{{ isDeleted(person) ? '变更类型：删除' : '变更类型：只读' }}</text>
        <view v-if="canDelete(person)" :class="['op-btn', isDeleted(person) ? 'op-btn--undo' : 'op-btn--del']"
          @click="toggleDelete(person)">
          {{ isDeleted(person) ? '撤销' : '删除' }}
        </view>
      </view>
      <view class="pc-body">
        <view class="pc-row"><text class="pc-lbl">家庭关系：</text><text class="pc-val">{{ person.glgx }}</text></view>
        <view class="pc-row"><text class="pc-lbl">证件类型：</text><text class="pc-val">{{ person.zjlxDesc }}</text></view>
        <view class="pc-row"><text class="pc-lbl">证件号码：</text><text class="pc-val">{{ person.zjhm }}</text></view>
        <view class="pc-row"><text class="pc-lbl">手机号码：</text><text class="pc-val">{{ person.sjhm }}</text></view>
        <view class="pc-row"><text class="pc-lbl">婚姻状况：</text><text class="pc-val">{{ person.hyzkDesc }}</text></view>
        <view class="pc-row"><text class="pc-lbl">缴存类型：</text><text class="pc-val">{{ person.dkjchlxDesc }}</text></view>
      </view>
    </view>

    <!-- ③ 本次新增关联人列表 -->
    <view v-if="addPersonList.length > 0">
      <box-title title="本次新增关联人" />
      <view class="person-card person-card--add" v-for="(p, i) in addPersonList" :key="'add' + i">
        <view class="pc-head">
          <text class="pc-tag pc-tag--add">新增</text>
          <text class="pc-name">{{ p.np_xingming }}</text>
          <text class="pc-changetype">变更类型：新增</text>
          <view class="op-btn op-btn--del" @click="removeAdded(i)">移除</view>
        </view>
        <view class="pc-body">
          <view class="pc-row"><text class="pc-lbl">参贷关系：</text>
            <text class="pc-val">{{ p.np_cdgx === '03' ? '共同还款人' : '未参贷（配偶）' }}</text></view>
          <view class="pc-row"><text class="pc-lbl">证件号码：</text><text class="pc-val">{{ p.np_zjhm }}</text></view>
          <view class="pc-row"><text class="pc-lbl">手机号码：</text><text class="pc-val">{{ p.np_sjhm }}</text></view>
        </view>
      </view>
    </view>

    <!-- ④ 新增关联人按钮 & 表单 -->
    <view class="add-toggle" @click="showAddForm = !showAddForm">
      <text>{{ showAddForm ? '▲ 收起新增表单' : '▼ 展开新增关联人' }}</text>
    </view>

    <view v-if="showAddForm">
      <view v-for="(section, si) in formConfig.sections" :key="si">
        <box-title :title="section.title" />
        <van-form :ref="'npForm_' + si" :scroll-to-error="true">
          <template v-for="(item, idx) in section.fields">
            <van-form-item-map
              :key="'np' + si + idx"
              v-if="!item.if || item.if(formData)"
              :formItemConfig.sync="item"
              :formData="formData"
            />
          </template>
        </van-form>
      </view>
      <view class="add-btn-wrap">
        <van-button type="primary" block @click="addPerson">确认添加该关联人</van-button>
      </view>
    </view>
  </view>
</template>

<script>
import mixin from '@osppm/store/person/loan/relatedPersonMortgagorChange/one/mixin'

export default {
  name: 'RelatedPersonChangeOne',
  mixins: [mixin],
}
</script>

<style lang="scss" scoped>
.empty-tip { text-align: center; color: #999; font-size: 26rpx; padding: 32rpx; }
.person-card {
  background: #fff; border-radius: 12rpx; padding: 24rpx; margin-bottom: 16rpx;
  border: 2rpx solid #e5e7eb; position: relative;
  &--borrower { border-color: #1492ff; }
  &--deleted  { opacity: 0.55; border-color: #f56c6c; background: #fff5f5; }
  &--add      { border-color: #52c41a; background: #f6ffed; }
}
.pc-head { display: flex; align-items: center; margin-bottom: 16rpx; gap: 12rpx; }
.pc-tag  { font-size: 22rpx; color: #fff; background: #1492ff; padding: 4rpx 14rpx; border-radius: 20rpx; flex-shrink: 0;
  &--add { background: #52c41a; } }
.pc-name { flex: 1; font-size: 30rpx; font-weight: 600; color: #333; }
.pc-changetype { font-size: 22rpx; color: #999; flex-shrink: 0; }
.op-btn { font-size: 26rpx; padding: 4rpx 16rpx; border-radius: 8rpx; flex-shrink: 0;
  &--del  { color: #f56c6c; border: 1rpx solid #f56c6c; }
  &--undo { color: #1492ff; border: 1rpx solid #1492ff; } }
.pc-body {}
.pc-row { display: flex; margin-bottom: 10rpx; font-size: 26rpx; }
.pc-lbl { min-width: 170rpx; color: #666; }
.pc-val { flex: 1; color: #333; }
.add-toggle {
  text-align: center; padding: 20rpx; margin: 16rpx 0;
  background: #f5f7fa; border-radius: 10rpx; color: #1492ff; font-size: 28rpx;
}
.add-btn-wrap { padding: 16rpx 0; }
</style>
