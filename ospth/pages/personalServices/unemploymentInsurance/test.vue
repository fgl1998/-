    <!-- 新增代缴企业职工养老保险 -->
    <ta-modal v-model="visible5" :destroy-on-close="true" :draggable="true" :footer="null" height="700px" maskClosable
      title="代缴企业职工养老保险" width="1200px" :zIndex="zIndex">
      <div class="modal-btn">
        <ta-button type="primary" @click="handleConfirmYlbx()" :disabled="showYlbxSubmitBtn">提交申请</ta-button>
        <ta-button @click="handleRefresh()">刷新页面</ta-button>
      </div>
      <div class="content-box">
        <ta-form :autoFormCreate="
            (form) => {
              this.ylbxForm = form
            }
          " :formLayout="true" label-width="165px" layout="inline">
          <div class="sub-title">基本信息</div>
          <div class="form-box">
            <ta-form-item fieldDecoratorId="syy001" label="失业申请编号" v-show="false" />
            <ta-form-item fieldDecoratorId="aac001" label="个人编号" v-show="false" />
            <ta-form-item fieldDecoratorId="aac003" label="姓名">
              <ta-input :disabled="true" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="yac002" label="身份证">
              <ta-input :disabled="true" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="aac004" label="性别">
              <ta-select :disabled="true" collection-type="AAC004" style="width: 182px" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="aac005" label="民族">
              <ta-select :disabled="true" collection-type="AAC005" style="width: 182px" />
            </ta-form-item>
            <ta-form-item :require="{ message: '请输入联系电话!' }" fieldDecoratorId="aae005" label="联系电话">
              <ta-input placeholder="" />
            </ta-form-item>
            <ta-form-item :require="{ message: '请选择发放方式!' }" fieldDecoratorId="syy002" label="发放方式">
              <ta-select style="width: 182px">
                <ta-select-option value="1">社保卡</ta-select-option>
                <ta-select-option value="2">银行卡</ta-select-option>
              </ta-select>
            </ta-form-item>
            <ta-form-item :require="{ message: '请选择银行类别!' }" fieldDecoratorId="yhk031" label="银行类别">
              <ta-input placeholder="" @click="visibleBank = true; formBankType = 'ylbxForm'" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="yhk030" label="银行卡号" required>
              <ta-input disabled placeholder="" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="yhk032" label="开户名称" required>
              <ta-input disabled placeholder="" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="yhk033" label="银行号">
              <ta-input disabled />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="betweens" label="领金后距离退休月数">
              <ta-input :disabled="true" placeholder="" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="txshij" label="退休时间" v-show="false" />
          </div>
          <div class="sub-title">申请信息</div>
          <div class="form-box">
            <ta-form-item fieldDecoratorId="yac60a" label="领取失业保险金状态">
              <ta-select style="width: 182px">
                <ta-select-option value="0">正常发放</ta-select-option>
                <ta-select-option value="1">待遇暂停</ta-select-option>
                <ta-select-option value="2">待遇终止</ta-select-option>
                <ta-select-option value="3">待遇到期</ta-select-option>
              </ta-select>
            </ta-form-item>
            <ta-form-item fieldDecoratorId="yac607" label="已享受失业金月数">
              <ta-input :disabled="true" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="ajc151" label="每月拟发失业金金额">
              <ta-input :disabled="true" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="ylb006" label="是否大龄领金人员">
              <ta-select style="width: 182px" :disabled="true">
                <ta-select-option value="1">是</ta-select-option>
                <ta-select-option value="2">否</ta-select-option>
              </ta-select>
            </ta-form-item>
            <ta-form-item fieldDecoratorId="ylb007" label="可享受大龄养老保险金月份" label-width="175px">
              <ta-input :disabled="true" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="ylb008" label="每月金额">
              <ta-input :disabled="true" />
            </ta-form-item>
            <ta-form-item fieldDecoratorId="aae017" label="社保缴纳地(审核机构)">
              <ta-select style="width: 182px" :disabled="true">
                <ta-select-option value="5499000000">西藏自治区</ta-select-option>
                <ta-select-option value="5401000000">拉萨市</ta-select-option>
                <ta-select-option value="5421000000">昌都市</ta-select-option>
                <ta-select-option value="5422000000">山南市</ta-select-option>
                <ta-select-option value="5423000000">日喀则市</ta-select-option>
                <ta-select-option value="5424000000">那曲市</ta-select-option>
                <ta-select-option value="5425000000">阿里地区</ta-select-option>
                <ta-select-option value="5426000000">林芝市</ta-select-option>
                <ta-select-option value="5427990000">格尔木办事处</ta-select-option>
                <ta-select-option value="5428990000">成都办事处</ta-select-option>
              </ta-select>
            </ta-form-item>
          </div>
        </ta-form>
        <div class="sub-title">企业职工基本养老保险缴费信息</div>
        <ta-big-table :data="ylbxTableData" align border height="200px" show-overflow>
          <ta-big-table-column field="ylb001" show-overflow title="养老保险人员实收明细id" v-if="false" />
          <ta-big-table-column field="ylb002" show-overflow title="人员编号" v-if="false" />
          <ta-big-table-column field="ylb003" show-overflow title="单位编号" v-if="false" />
          <ta-big-table-column field="ylb004" show-overflow title="参保单位" />
          <ta-big-table-column field="ylb005" show-overflow title="身份证" />
          <ta-big-table-column field="ylb006" show-overflow title="缴费所属期 " />
          <ta-big-table-column field="ylb007" show-overflow title="对应缴费所属期" />
          <ta-big-table-column field="ylb008" show-overflow title="缴费年度" />
          <ta-big-table-column field="ylb009" show-overflow title="单位缴费基数" v-if="false" />
          <ta-big-table-column field="ylb010" show-overflow title="单位应缴金额" />
          <ta-big-table-column field="ylb011" show-overflow title="单位实缴金额" />
          <ta-big-table-column field="ylb012" show-overflow title="人员缴费基数" v-if="false" />
          <ta-big-table-column field="ylb013" show-overflow title="个人应缴金额" />
          <ta-big-table-column field="ylb014" show-overflow title="个人实缴金额" />
          <ta-big-table-column field="ylb015" show-overflow title="地方应缴类型名称" />
          <ta-big-table-column field="ylb017" show-overflow title="社会保险经办机构编号" />
          <ta-big-table-column field="ylb016" show-overflow title="经办时间" />
        </ta-big-table>
        <div class="sub-title">材料上传</div>
        <materialUploadTable ref="materialUploadTable" yda020="268" />
      </div>
    </ta-modal>