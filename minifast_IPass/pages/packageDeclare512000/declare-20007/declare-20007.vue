<!-- 公祖房租赁补贴（住建局） -->
<template>
  <view class="declare">
    <div class="progress-wrapper">
      <ComponentDeclareStep :current="2"></ComponentDeclareStep>
    </div>

    <div class="basic-info-wrapper">
      <ComponentDeclare
        :declareType="declareType"
        :fixedDeclareType="fixedDeclareType"
        :renderObj="renderObj"
        :projectNumber="chi031"
        :projectName="chi031_desc"
        @changeDeclareType="handleChangeDeclareType"
        @changeBasicInfo="handleChangeBasicInfo"
        @changeCodeMap="handleChangeCodeMap"
        @changeAgentInfo="handleChangeAgentInfo"
        @changeDataByIdCard="handleChangeDataByIdCard"
      >
      </ComponentDeclare>
    </div>

    <!-- start 需要修改的地方开始 在以下代码中根据项目需求更改 上面代码勿动 -->
    <div class="personnel-type-wrapper space-top-wrapper">
      <ComponentDeclarePersonnel
        :renderData="personnelList"
        :isOpenCategoryNotes="true"
        @change="handleChangePersonnelInfo"
      ></ComponentDeclarePersonnel>
    </div>

    <!-- 申报信息 -->
    <div class="space-top-wrapper">
      <ComponentPanel title="申报信息">
        <div class="panel-content">
          <div class="cell-items">
            <!--            <ComponentDeclarePicker
              label="户籍类型"
              idName="permanentType"
              :range="permanentTypeRange"
              placeholder="请选择是否是外地户籍"
              v-model="permanentType"
            ></ComponentDeclarePicker> -->
            <!--            <block v-if="permanentType === '1'">
              <ComponentSelectPermanentAddress
                label="户籍地址"
                placeholder="请选择户籍地址"
                :isShowBtn="false"
                v-model="projectDeclareInfo.z00018"
                @change="handlePermanentAdressChange"
              >
              </ComponentSelectPermanentAddress>
              <div class="cell-item required">
                <div class="key">户籍详细地址</div>
                <div class="value">
                  <input
                    type="text"
                    v-model="projectDeclareInfo.AddressDetail"
                    placeholder="请补全户籍地址到门牌号"
                  />
                </div>
              </div>
            </block> -->
            <ComponentSelectPermanentAddress
              label="申请社区"
              placeholder="请选择申请社区"
              :isShowBtn="false"
              v-model="projectDeclareInfo.z00064"
              @change="handlePermanentAdressChange"
            >
            </ComponentSelectPermanentAddress>
            <block>
              <div class="cell-item required textarea">
                <div class="key">户籍地址</div>
                <div class="value">
                  <textarea
                    maxlength="100"
                    v-model="projectDeclareInfo.z00018"
                    placeholder="请输入户籍详细地址（补全户籍地址到门牌号）"
                  >
                  </textarea>
                </div>
              </div>
            </block>
			<ComponentSelectPermanentAddress
			  label="现工作地址"
			  placeholder="请输入现工作地址"
			  :isShowBtn="false"
			  v-model="projectDeclareInfo.z00019"
			>
			</ComponentSelectPermanentAddress>
			<div class="cell-item required">
			  <div class="key">现工作详细地址</div>
			  <div class="value">
			    <input
			      type="text"
			      v-model="projectDeclareInfo.wordAddressDetail"
			      placeholder="请补全地址到门牌号"
			    />
			  </div>
			</div>
			<div
			  class="cell-item"
			  :class="[z00025Value === '1' ? 'required' : '']"
			>
			  <div class="key">房屋坐落位置</div>
			  <div class="value" @click="showmap">
			    <div>
			      {{ projectDeclareInfo.houseDetail || '暂无' }}
			    </div>
			  </div>
			</div>
			<div
			  class="cell-item"
			  :class="[z00025Value === '1' ? 'required' : '']"
			>
			  <div class="key">房屋坐落详细位置</div>
			  <div class="value">
			    <input
			      type="text"
			      v-model="projectDeclareInfo.z00023"
			      placeholder="请补全位置到门牌号"
			    />
			  </div>
			</div>

            <ComponentDeclarePicker
              label="婚姻状况"
              idName="z00015"
              :range="codeMap.aac017"
              placeholder="请选择婚姻状况"
              v-model="projectDeclareInfo.z00015"
            ></ComponentDeclarePicker>
            <ComponentDeclareRadio
              label="是否有车"
              type="radio"
              idName="z00024"
              :range="codeMap.yesorno"
              v-model="projectDeclareInfo.z00024"
            ></ComponentDeclareRadio>
            <block v-if="isStudent">
              <ComponentDeclarePicker
                label="申请人当前学历"
                idName="z00016"
                :range="codeMap.w00016"
                placeholder="请选择申请人当前学历"
                v-model="projectDeclareInfo.z00016"
              ></ComponentDeclarePicker>
              <ComponentDeclarePicker
                label="毕业时间"
                idName="z00017"
                mode="date"
                fields="day"
                :endTime="today_d"
                placeholder="请选择毕业时间"
                v-model="projectDeclareInfo.z00017"
              ></ComponentDeclarePicker>
            </block>
			<ComponentDeclarePicker
			  label="产权性质"
			  idName="z00025"
			  :range="codeMap.z00025"
			  placeholder="请选择产权性质"
			  v-model="projectDeclareInfo.z00025"
			></ComponentDeclarePicker>
            <div class="cell-item required">
              <div class="key">家庭人数</div>
              <div class="value">
                <input
                  type="number"
                  maxlength="3"
                  v-model="projectDeclareInfo.z56203"
                  placeholder="请输入申报人的家庭人数"
                />
              </div>
            </div>
			<div class="cell-item required">
			  <div class="key">保障人数</div>
			  <div class="value">
			    <input
			      type="number"
			      maxlength="6"
			      v-model="projectDeclareInfo.z00005"
			      placeholder="请输入保障人数"
			    />
			  </div>
			</div>
			<block v-if="personnelInfo.cac102 === '563'">
			  <div class="cell-item required">
			    <div class="key">最低收入保障人数</div>
			    <div class="value">
			      <input
			        type="number"
			        maxlength="4"
			        v-model="projectDeclareInfo.z00077"
			        placeholder="请输入人数"
			      />
			    </div>
			  </div>
			  <div class="cell-item required">
			    <div class="key">低收入保障人数</div>
			    <div class="value">
			      <input
			        type="number"
			        maxlength="4"
			        v-model="projectDeclareInfo.z00078"
			        placeholder="请输入人数"
			      />
			    </div>
			  </div>
			</block>
			<block v-if="z00025Value === '1'">
			  <div class="cell-item required">
			    <div class="key">建筑面积</div>
			    <div class="value">
			      <input
			        type="number"
			        maxlength="6"
			        v-model="projectDeclareInfo.z00020"
			        placeholder="请输入建筑面积"
			      />
			    </div>
			  </div>
			</block>
			<block v-else>
			  <div class="cell-item required disabled">
			    <div class="key">建筑面积</div>
			    <div class="value">0</div>
			  </div>
			</block>
            <div class="cell-item required disabled">
              <div class="key">保障面积</div>
              <div class="value">
                {{ getZ00021 }}
              </div>
            </div>
            <div class="cell-item required disabled">
              <div class="key">人均补贴面积</div>
              <div class="value">{{ getZ00022 || 0 }}</div>
            </div>
            <ComponentDeclarePicker
              v-if="declareType == '02'"
              label="与申报人关系"
              idName="chb00u"
              :range="codeMap.chb00u"
              placeholder="请选择与申报人关系"
              v-model="projectDeclareInfo.chb00u"
            ></ComponentDeclarePicker>
            <div class="cell-item required disabled">
              <div class="key">家庭类别</div>
              <div class="value long_over">
                {{ projectDeclareInfo.z00027_desc || '暂无' }}
              </div>
            </div>

          </div>
        </div>
      </ComponentPanel>
    </div>

    <!-- 家庭成员信息 -->
    <div class="space-top-wrapper" v-if="isShowCard">
      <ComponentPanel title="家庭成员信息">
        <ComponentDeclareCard
          :renderData="familyMemberList"
          type="20007"
          addButtonName="添加家庭成员"
          @change="handleChangeCardList"
        ></ComponentDeclareCard>
      </ComponentPanel>
    </div>

    <!-- end  需要修改的地方结束 在以下代码中根据项目需求更改 下面代码勿动-->
    <div class="button-wrapper">
      <ComponentButton
        @click="handleJumpNextStep"
        name="下一步"
        type="primary"
      ></ComponentButton>
    </div>
  </view>
</template>

<script>
import ComponentButton from '@/components/common/ez-button/ez-button.vue'
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

import ComponentDeclareStep from '@/components/project/ez-declare-step/ez-declare-step.vue'
import ComponentDeclare from '@/components/project/ez-declare/ez-declare.vue'
import ComponentSelectPermanentAddress from '@/components/project/ez-select-permanent-address/ez-select-permanent-address.vue'
import ComponentSelectCurrentAddress from '@/components/project/ez-select-current-address/ez-select-current-address.vue'
import ComponentDeclareCard from '@/components/project/ez-declare-card/ez-declare-card.vue'
import ComponentDeclarePersonnel from '@/components/project/ez-declare-personnel/ez-declare-personnel.vue'
import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
import ComponentSelectAddressMultitype from '@/components/project/ez-select-address-multitype/ez-select-address-multitype.vue'

import Big from '@/utils/big'
import { useDeclare } from '@/mixins'
import { getIsDev } from '@/utils/get'
import { useGetCurrentDate } from '@/hooks/common'
import { getCodeListByCodeName } from '@/utils/custom-api'
import { showModal } from '@/utils/uni-api'
export default {
  name: 'pageDeclare20007',
  data() {
    return {
      // 基本信息 渲染配置
      renderObj: {
        idCard: true, // 身份证
        userName: true, // 姓名
        tel: true, // 联系电话
        age: true, // 年龄
        gender: true, // 性别
      },
      today_d: useGetCurrentDate(),
      // 是否是外籍户籍
      // permanentType: "",
      // permanentTypeRange: [
      //   {
      //     aaa102: "1",
      //     aaa103: "本地",
      //   },
      //   {
      //     aaa102: "2",
      //     aaa103: "外地",
      //   },
      // ],
      // 自定义添加一些属性 防止双向绑定失败 例如 picker组件之类
      projectDeclareInfo: {
        z56203: '', // 家庭人数
        z00020: '', // 建筑面积
        z00021: '', // 保障面积
        z00022: '', // 人均建筑面积
        z00019: '', // 现工作单位
        z00023: '', // 房屋坐落位置
        z00025: '', // 产权性质
        z00077: '', // 最低收入保障人数
        z00078: '', // 低收入保障人数
        houseDetail: '',
      },
      familyMemberList: [],
      wordAddress: {},
      // 申报地址编码信息
      addressInfo: {},
    }
  },
  components: {
    ComponentButton,
    ComponentPanel,
    ComponentDeclare,
    ComponentDeclareStep,
    ComponentSelectPermanentAddress,
    ComponentSelectCurrentAddress,
    ComponentDeclareCard,
    ComponentDeclareRadio,
    ComponentDeclarePersonnel,
    ComponentDeclarePicker,
    ComponentSelectAddressMultitype,
  },
  mixins: [useDeclare],
  // 监听页面加载，其参数为上个页面传递的数据，参数类型为Object（用于页面传参）
  onLoad(e) {
    this.handleOnLoad(e)
  },

  // 监听页面初次渲染完成
  onReady() {},
  // 监听页面显示
  onShow() {},
  // 监听页面隐藏
  onHide() {},
  methods: {
    // 获取该申报项目的所需要的码表数据
    // aaz502、aac011、dac009、aac004、aac005、aae008、yesorno 不用再次获取
    // 编写格式参考达州20033项目
    async getCodeTableCacheData() {
      const isDev = getIsDev() // 当前环境是否是开发环境
      let w00016 = [] // 申请人当前学历
      let aac017 = [] // 婚姻状况
      let z00025 = [] // 产权性质
      let z00027 = [] // 家庭类别
      let chb00u = [] // 与申请人关系
      try {
        w00016 = await getCodeListByCodeName('w00016')
        aac017 = await getCodeListByCodeName('aac017')
        z00025 = await getCodeListByCodeName('z00025')
        chb00u = await getCodeListByCodeName('chb00u')
      } catch (err) {
        if (isDev) {
          console.log('code table w00016,aac017,z00025,chb00u error：', err)
        }
      }

      this.codeMap = {
        ...this.codeMap,
        aac017,
        w00016,
        z00025,
        chb00u,
      }
    },
    // 捕获 familyMemberList 不用修改
    handleChangeCardList(type, data) {
      this.familyMemberList = [...data]
    },
    // 申请地区改变
    handlePermanentAdressChange(e) {
      this.addressInfo = {
        chb015: e[0].orgid,
        chb017: e[1].orgid,
        chb018: e[2].orgid,
      }
    },
    // // 工作地址改变
    // handleChangeWorkAdress(e) {
    //   this.wordAddress = {
    //     chb015: e[0].orgid,
    //     chb017: e[1].orgid,
    //     chb018: e[2].orgid,
    //   };
    // },
    showmap() {
      uni.chooseLocation({
        success: (res) => {
          this.projectDeclareInfo.houseDetail = res.address
          // console.log('位置名称：' + res.name);
          // console.log('详细地址：' + res.address);
          // console.log('纬度：' + res.latitude);
          // console.log('经度：' + res.longitude);
          // uni.getLocation({
          // 	type: 'gcj02',
          // 	altitude:true,
          // 	geocode:true,
          // 	success: function(res) {
          // 		console.log('当前位置的经度：' + res.longitude);
          // 		console.log('当前位置的纬度：' + res.latitude);
          // 	}
          // });
          // console.log('省：' + res.address.slice(0, res.address.indexOf('省') + 1));
          // console.log('市：' + res.address.slice(res.address.indexOf('省') + 1, res.address.indexOf('市') + 1));
          // console.log('区：' + res.address.slice(res.address.indexOf('市') + 1, res.address.indexOf('区') + 1));
        },
      })
    },
    // 检测用户是否是中心
    checkIsCenter() {
      let { z00018 } = this.projectDeclareInfo
      if (
        z00018.match(RegExp(/雁江区-三贤祠街道/)) ||
        z00018.match(RegExp(/雁江区-宝莲街道/)) ||
        z00018.match(RegExp(/雁江区-莲花街道/)) ||
        z00018.match(RegExp(/雁江区-资溪街道/)) ||
        z00018.match(RegExp(/高新区-松涛镇/)) ||
        z00018.match(RegExp(/高新区-狮子山街道/)) ||
        z00018.match(RegExp(/临空经济区-雁江镇/))
      ) {
        return true
      }

      return false
    },
    // 检测数据输入格式是否正确 须根据项目需求更改
    handleCheckInput() {
      // const permanentType = this.permanentType;
      const isStudent = this.isStudent
      const isShowCard = this.isShowCard
      const { cac102 } = this.personnelInfo

      const {
        aac004, // 性别
        chb00l, // 年齡
        z56203, // 家庭人数
        z00015, // 婚姻状况
        z00016, // 学历
        z00017, // 毕业时间
        z00018, // 户籍地址
        z00019, // 现工作地址
        z00020, // 建筑面积
        z00021, // 保障面积
        z00022, // 人均建筑面积
        z00023, // 房屋坐落位置
        z00024, // 是否有车
        z00025, // 产权性质
        z00027, // 家庭类别
        z00005, // 保障人数
        chb00u, // 与申报人关系

        z00064, // 申请社区
        z00077, // 最低收入保障人数
        z00078, // 低收入保障人数
        wordAddressDetail, // 现工作详细地址
        AddressDetail, // 户籍地址详细
        houseDetail,
      } = this.projectDeclareInfo
      // if (!permanentType) {
      //   showModal("请选择户籍类型");
      //   return false;
      // }
      // if (permanentType === "1") {
      //   if (!z00018) {
      //     showModal("请选择户籍地址");
      //     return false;
      //   }
      //   if (!AddressDetail) {
      //     showModal("请补全户籍地址到门牌号");
      //     return false;
      //   }
      // }
      if (!z00064) {
        showModal('请选择申请社区')
        return false
      }
      if (!z00018) {
        showModal('请输入户籍详细地址（补全户籍地址到门牌号）')
        return false
      }

      if (!z56203) {
        showModal('请输入家庭人数')
        return false
      }
      if (!z00015) {
        showModal('请选择婚姻状况')
        return false
      }
      if (isStudent) {
        if (!z00016) {
          showModal('请选择学历')
          return false
        }
        if (!z00017) {
          showModal('请选择毕业时间')
          return false
        }
      }

      if (!z00019) {
        showModal('请选择现工作地址')
        return false
      }
      if (!wordAddressDetail) {
        showModal('请输入现工作详细地址')
        return false
      }
      if (!z00025) {
        showModal('请选择产权性质')
        return false
      }

      if (z00025 === '1') {
        if (!z00020) {
          showModal('请输入建筑面积')
          return false
        }
        if (!houseDetail) {
          showModal('请选择房屋坐落位置')
          return false
        }
        if (!z00023) {
          showModal('请输入房屋坐落详细位置')
          return false
        }
      }

      if (!z00024) {
        showModal('请选择是否有车')
        return false
      }
      if (!chb00u && this.declareType == '02') {
        showModal('请输入与申报人关系')
        return false
      }

      if (!z00005) {
        showModal('请输入保障人数')
        return false
      }

      if (cac102 === '563') {
        if (!z00077) {
          showModal('请输入最低收入保障人数')
          return false
        }
        if (!z00078) {
          showModal('请输入低收入保障人数')
          return false
        }
      }

      if (isShowCard) {
        if (this.familyMemberList.length == 0) {
          showModal('请添加家庭成员')
          return false
        } else if (this.familyMemberList.length < z56203 - 1) {
          showModal('添加的家庭成员数与家庭人数不符，请添加其他家庭成员')
          return false
        }
      }

      return true
    },
    // 下一步
    handleJumpNextStep() {
      if (!this.handleCheckComponentInput()) {
        return
      }
      if (!this.handleCheckInput()) {
        return
      }
      // const isNow = this.checkIsCenter();
      // let wordAddress = this.wordAddress;
      let getZ00022 = this.getZ00022
      let getZ00021 = this.getZ00021
      let familyMemberList = this.familyMemberList

      let addressInfo = this.addressInfo
      // if (!isNow) {
      //   addressInfo = {
      //     chb015: wordAddress.chb015,
      //     chb017: wordAddress.chb017,
      //     chb018: wordAddress.chb018,
      //   };
      // }

      const {
        age, // 年龄
        gender, // 性别
      } = this.basicInfo

      const {
        aac004, // 性别
        chb00l, // 年齡
        z56203, // 家庭人数
        z00015, // 婚姻状况
        z00016, // 学历
        z00017, // 毕业时间
        z00018, // 户籍地址
        z00019, // 现工作地址
        z00020, // 建筑面积
        z00021, // 保障面积
        z00022, // 建筑面积
        z00023, // 房屋坐落位置
        z00024, // 是否有车
        z00025, // 产权性质
        z00027, // 家庭类别
        chb00u, // 与申报人关系
        z00005, // 保障人数
        z00064, // 申请社区
        z00077, // 最低收入保障人数
        z00078, // 低收入保障人数
        houseDetail,
        AddressDetail,
        wordAddressDetail, // 现工作详细地址
      } = this.projectDeclareInfo
      // 扩展字段
      const hb00BizMap = {
        aac004: gender, // 性别
        chb00l: age, // 年齡
        z56203, // 家庭人数
        z00015, // 婚姻状况
        z00016, // 学历
        z00017, // 毕业时间
        z00018: z00018.replace(/-/g, ''), // 户籍地址
        z00019: z00019.replace(/-/g, '') + wordAddressDetail, // 现工作地址
        z00020: z00025 !== '1' ? 0 : z00020, // 建筑面积
        z00021: getZ00021, // 保障面积
        z00022: getZ00022, // 建筑面积
        z00023: houseDetail + z00023, // 房屋坐落位置
        z00024, // 是否有车
        z00025, // 产权性质
        z00027, // 家庭类别
        chb00u, // 与申报人关系
        z00005, // 保障人数
        z00064, // 申请社区
        z00077, // 最低收入保障人数
        z00078, // 低收入保障人数
      }
      // 家庭成员
      let familyMember = []
      let arr = []
      familyMemberList.map((item) => {
        arr.push({
          aac002: item.idCard, // 姓名
          aac003: item.name, // 姓名
          chp031: item.relationship_desc, // 关系
        })
      })
      familyMember = [...arr]
      this.handleDeclareData(hb00BizMap, '0', null, familyMember, addressInfo)
    },
  },
  computed: {
    // 获取保障面积
    getZ00021() {
      let { z00005 } = this.projectDeclareInfo
      let result = 0

      if (z00005) {
        result = new Big(z00005).times(15)
      }
      return result
    },
    // 获取人均补贴面积
    getZ00022() {
      let { cac102 } = this.personnelInfo
      let z00021 = this.getZ00021
      let { z00020, z00005 } = this.projectDeclareInfo
      let result = 0

      let res = new Big(z00021).minus(new Big(z00020 || 0)) // 保障面积 - 建筑面积
      res = parseFloat(res)

      // 外来务工人员  新就业无房职工
      if (
        cac102 === '569' ||
        cac102 === '568' ||
        cac102 === '570' ||
        cac102 === '829'
      ) {
        if (res >= 30) {
          res = 30
        }
      } else {
        if (res >= 60) {
          res = 60
        }
      }

      if (res > 0) {
        result = new Big(res).div(z00005).toFixed(2)
      }
      return result
    },
    isStudent() {
      let { cac100 } = this.personnelInfo
      let result = false
      if (cac100 == '568' || cac100 == '570') {
        result = true
      }
      return result
    },
    // 家庭组件
    isShowCard() {
      let { z56203 } = this.projectDeclareInfo
      let result = true

      if (z56203 == 1) {
        result = false
      }
      return result
    },
    // 是否为 私有住房
    z00025Value() {
      let { z00025 } = this.projectDeclareInfo
      let result = '0'

      if (z00025 === '1') {
        result = '1'
      }
      return result
    },
  },
  watch: {
    'personnelInfo.cac100': {
      handler(val) {
        if (val) {
          this.projectDeclareInfo = {
            ...this.projectDeclareInfo,
            z00027: val,
            z00027_desc: this.personnelInfo.cac10a,
          }
          if (val == '570') {
            this.projectDeclareInfo.z00027_desc = '新就业无房职工(上班地点在...'
          }
        }
      },
      immediate: true,
    },
  },
}
</script>

<style scoped lang="scss"></style>
