<template>
  <view class="ez-declare-card-wrapper">
    <block v-for="(item, index) in renderData" :key="item.id">
      <div class="card">
        <div class="operating">
          <div class="iconfont iconfont-edit" @click.stop="handleEdit(index)"></div>
          <div class="iconfont iconfont-delete" @click.stop="handleDelete(index)"></div>
        </div>
        <!-- 凉山 公共租赁住房实物配租 添加共同申请人 -->
        <block v-if="type === '200001'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
          <div class="cell">
            <div class="key">联系电话：</div>
            <div class="value">{{ item.tel }}</div>
          </div>
          <div class="cell">
            <div class="key">月收入：</div>
            <div class="value">{{ item.income }}</div>
          </div>
          <div class="cell">
            <div class="key">工作单位：</div>
            <div class="value">{{ item.unit }}</div>
          </div>
          <div class="cell">
            <div class="key">所属群体：</div>
            <div class="value">{{ item.group }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾类别：</div>
            <div class="value">{{ item.categories }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾等级：</div>
            <div class="value">{{ item.grade }}</div>
          </div>
        </block>
        <!-- 广安 县级大学生创业指导补贴 添加指导对象 -->
        <block v-if="type === '20970'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
        </block>
        <!-- 达州 地质灾害避险搬迁安置 添加家庭成员 -->
        <block v-if="type === '20044'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
          <div class="cell">
            <div class="key">与户主关系：</div>
            <div class="value">{{ item.relationship_desc }}</div>
          </div>
        </block>
        <!-- 资阳 公祖房租赁补贴 添加家庭成员 -->
        <block v-if="type === '20007'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
          <div class="cell">
            <div class="key">与申请人关系：</div>
            <div class="value">{{ item.relationship_desc }}</div>
          </div>
        </block>
        <!-- 资阳  残疾人就业创业扶持（残保金项目） 添加安置残疾人 -->
        <block v-if="type === '20640'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">性别：</div>
            <div class="value">{{ item.sex }}</div>
          </div>
          <div class="cell">
            <div class="key">年龄：</div>
            <div class="value">{{ item.age }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾等级：</div>
            <div class="value">{{ item.level }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾类别：</div>
            <div class="value">{{ item.style }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾证号：</div>
            <div class="value">{{ item.number }}</div>
          </div>
          <div class="cell">
            <div class="key">联系电话：</div>
            <div class="value">{{ item.phone }}</div>
          </div>
          <div class="cell">
            <div class="key">户籍地址：</div>
            <div class="value">{{ item.address }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾人聘用时间：</div>
            <div class="value">{{ item.time }}</div>
          </div>
        </block>
        <!-- 资阳 公祖房租赁补贴 添加家庭成员 -->
        <block v-if="type === '20639'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
          <div class="cell">
            <div class="key">与申请人关系：</div>
            <div class="value">{{ item.relationship_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">工作单位：</div>
            <div class="value">{{ item.work }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾类别：</div>
            <div class="value">{{ item.style }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾等级：</div>
            <div class="value">{{ item.level }}</div>
          </div>
          <div class="cell">
            <div class="key">残疾证号：</div>
            <div class="value">{{ item.number }}</div>
          </div>
        </block>
        <!-- 泸州 家庭保障成员信息 添加家庭成员 -->
        <block v-if="type === '20072'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
          <div class="cell">
            <div class="key">与申请人关系：</div>
            <div class="value">{{ item.relationship_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">工作单位：</div>
            <div class="value">{{ item.work }}</div>
          </div>
        </block>
        <!-- 攀枝花 育儿补贴金 其他子女-->
        <block v-if="type === '20407'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
        </block>
        <!-- 广安 生猪无害化处理补助资金 动物标识号码-->
        <block v-if="type === '20173'">
          <div class="cell">
            <div class="key">动物标识号码：</div>
            <div class="value">{{ item.number }}</div>
          </div>
        </block>
        <!-- 成都 送温暖工程及帮困扶贫 添加家庭其他成员 -->
        <block v-if="type === '20093'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">性别：</div>
            <div class="value">{{ item.gender_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">与申请人关系：</div>
            <div class="value">{{ item.relationship_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">出生年月：</div>
            <div class="value">{{ item.birthday }}</div>
          </div>
          <div class="cell">
            <div class="key">民族：</div>
            <div class="value">{{ item.nation }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
          <div class="cell">
            <div class="key">联系方式</div>
            <div class="value">{{ item.tel }}</div>
          </div>
          <div class="cell">
            <div class="key">政治面貌</div>
            <div class="value">{{ item.political_climate }}</div>
          </div>
          <div class="cell">
            <div class="key">婚姻状况</div>
            <div class="value">{{ item.marrige }}</div>
          </div>
          <div class="cell">
            <div class="key">健康状况</div>
            <div class="value">{{ item.healthy }}</div>
          </div>
          <div class="cell">
            <div class="key">单位或学校</div>
            <div class="value">{{ item.workorschool }}</div>
          </div>
          <div class="cell">
            <div class="key">备注</div>
            <div class="value">{{ item.remark }}</div>
          </div>
          <div class="cell">
            <div class="key">人员身份</div>
            <div class="value">{{ item.people_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">当前学历</div>
            <div class="value">{{ item.education }}</div>
          </div>
          <div class="cell">
            <div class="key">入学年份</div>
            <div class="value">{{ item.year }}</div>
          </div>
          <div class="cell">
            <div class="key">学习年制</div>
            <div class="value">{{ item.study }}</div>
          </div>
        </block>
        <!-- 新型职业农民参加城镇职工养老保险补助 添加农产品 -->
        <block v-if="type === '20106'">
          <div class="cell">
            <div class="key">类型：</div>
            <div class="value">{{ item.type_desc }}</div>
          </div>
          <div class="cell" v-if="item.type_desc !== '种养结合类'">
            <div class="key">{{ item.type_desc }}：</div>
            <div class="value">{{ item.botany_desc || item.breed_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">{{ item | findName(unit) }}：</div>
            <div class="value">{{ item | findNum(unit) }}</div>
          </div>
        </block>
        <!-- 攀枝花 育儿补贴金 其他子女-->
        <block v-if="type === '20300'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
          <div class="cell">
            <div class="key">年龄：</div>
            <div class="value">{{ item.age }}</div>
          </div>
          <div class="cell">
            <div class="key">与申请人关系：</div>
            <div class="value">{{ item.relationship_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">职业：</div>
            <div class="value">{{ item.job }}</div>
          </div>
        </block>
        <!-- 成都 独生子女四级伤残计划生育家庭补助 添加子女-->
        <block v-if="type === '20518_1'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">性别：</div>
            <div class="value">{{ item.gender_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">出生年月：</div>
            <div class="value">{{ item.birth }}</div>
          </div>
          <div class="cell">
            <div class="key">是否亲生：</div>
            <div class="value">{{ item.own_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">死残日期：</div>
            <div class="value">{{ item.die }}</div>
          </div>
        </block>
        <block v-if="type === '20518_2'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">性别：</div>
            <div class="value">{{ item.gender_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">出生年月：</div>
            <div class="value">{{ item.birth }}</div>
          </div>
          <div class="cell">
            <div class="key">收养年月：</div>
            <div class="value">{{ item.adoption }}</div>
          </div>
          <div class="cell">
            <div class="key">死残日期：</div>
            <div class="value">{{ item.die }}</div>
          </div>
          <div class="cell">
            <div class="key">是否具有法律手续：</div>
            <div class="value">{{ item.proce_desc }}</div>
          </div>
        </block>
        <!-- 市本级高中国家助学金 添加家庭成员 -->
        <block v-if="type === '20014'">
          <div class="cell" style="align-items: center">
            <div class="name">{{ item.name }}</div>
            <div class="ml-10">
              <span
                :class="{
                  relationship_man: item.gender_desc === '男',
                  relationship_woman: item.gender_desc === '女'
                }"
                >{{ item.relationship_desc }}</span
              >
            </div>
          </div>
          <div class="cell">
            <div>{{ item.gender_desc }}</div>
            <span class="interval"> | </span>
            <div>{{ item.age }}</div>
            <span class="interval"> | </span>
            <div>{{ item.job }}</div>
            <span class="interval"> | </span>
            <div>{{ item.healthy_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">工作学习单位：</div>
            <div class="value">{{ item.workAdress }}</div>
          </div>
          <div class="cell">
            <div class="key">年收入：</div>
            <div class="value">{{ item.wages }}</div>
          </div>
        </block>
        <!-- 地方政府济困助学 添加家庭成员 -->
        <block v-if="type === '20607'">
          <div class="cell">
            <div class="key">姓名：</div>
            <div class="value">{{ item.name }}</div>
          </div>
          <div class="cell">
            <div class="key">身份证号：</div>
            <div class="value">{{ item.idCard }}</div>
          </div>
          <div class="cell">
            <div class="key">年龄：</div>
            <div class="value">{{ item.age }}</div>
          </div>
          <div class="cell">
            <div class="key">工作状态：</div>
            <div class="value">{{ item.work_desc }}</div>
          </div>
          <div class="cell">
            <div class="key">与申请人关系：</div>
            <div class="value">{{ item.relationship_desc }}</div>
          </div>
        </block>
        <block v-if="type === '20457_o'">
          <div class="cell">
            <div class="key">工作起止时间：</div>
            <div class="value">{{ item.start }}至{{ item.end }}</div>
          </div>
          <div class="cell">
            <div class="key">执业地点(村卫生室名称)：</div>
            <div class="value">{{ item.address }}</div>
          </div>
          <div class="cell">
            <div class="key">证明人：</div>
            <div class="value">{{ item.person }}</div>
          </div>
        </block>
        <block v-if="type === '20457_l'">
          <div class="cell">
            <div class="key">工作起止时间：</div>
            <div class="value">{{ item.start }}至{{ item.end }}</div>
          </div>
          <div class="cell">
            <div class="key">累计工作时间：</div>
            <div class="value">{{ item.totalTime }}</div>
          </div>
          <div class="cell">
            <div class="key">工作地点(村)：</div>
            <div class="value">{{ item.address }}</div>
          </div>
          <div class="cell">
            <div class="key">证明人：</div>
            <div class="value">{{ item.person }}</div>
          </div>
        </block>
      </div>
    </block>

    <div class="card add" @click="handleAdd">
      <div class="iconfont iconfont-add"></div>
      <div class="">{{ addButtonName }}</div>
    </div>

    <ComponentPopup ref="popup" type="center" style="max-height: 100px">
      <div class="popup-con">
        <!-- 凉山 公共租赁住房实物配租 添加共同申请人 -->
        <block v-if="type === '200001'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">身份证号：</div>
            <div class="value">
              <input
                class="input"
                type="idcard"
                maxlength="18"
                placeholder="请输入身份证号"
                v-model="selectInfo.idCard"
                @blur="handleBlurIdCard" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">联系方式：</div>
            <div class="value">
              <input
                class="input"
                type="number"
                maxlength="11"
                placeholder="请输入联系方式"
                v-model="selectInfo.tel"
                @blur="handleTelBlur" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">月收入：</div>
            <div class="value">
              <input class="input" type="digit" maxlength="30" placeholder="请输入月收入" v-model="selectInfo.income" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">工作单位：</div>
            <div class="value">
              <input class="input" type="text" placeholder="请输入工作单位" v-model="selectInfo.unit" />
            </div>
          </div>
          <ComponentDeclarePicker
            :range="codeMap.z00065"
            label="所属群体"
            placeholder="请选择所属群体"
            idName="group"
            align="right"
            v-model="selectInfo.group"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            :range="codeMap.z00066"
            label="残疾类别"
            placeholder="请选择残疾类别"
            idName="categories"
            align="right"
            :required="false"
            v-model="selectInfo.categories"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            :range="codeMap.chb0h2"
            label="残疾等级"
            placeholder="请选择残疾等级"
            idName="grade"
            :required="false"
            align="right"
            v-model="selectInfo.grade"
            @change="handlePickerChange"></ComponentDeclarePicker>
        </block>

        <block v-if="type === '20970'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">身份证号：</div>
            <div class="value">
              <input
                class="input"
                type="idcard"
                maxlength="18"
                placeholder="请输入身份证号"
                v-model="selectInfo.idCard"
                @blur="handleBlurIdCard" />
            </div>
          </div>
        </block>
        <block v-if="type === '20044'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">身份证号：</div>
            <div class="value">
              <input
                class="input"
                type="idcard"
                maxlength="18"
                placeholder="请输入身份证号"
                v-model="selectInfo.idCard"
                @blur="handleBlurIdCard" />
            </div>
          </div>
          <ComponentDeclarePicker
            :range="relationshipRange"
            label="与户主关系："
            placeholder="请选择与户主关系"
            idName="relationship"
            rangeKey="name"
            valueKey="value"
            align="right"
            v-model="selectInfo.relationship"
            @change="handlePickerChange"></ComponentDeclarePicker>
        </block>
        <!-- 新型职业农民参加城镇职工养老保险补助 添加农产品 -->
        <block v-if="type === '20106'">
          <ComponentDeclarePicker
            :range="codeMap.n00065"
            label="类型"
            placeholder="请选择类型"
            idName="type"
            align="right"
            v-model="selectInfo.type"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            v-if="selectInfo.type_desc == '种植业类'"
            :range="codeMap.n00066"
            label="种植业类"
            placeholder="请选择种植业类"
            idName="botany"
            align="right"
            v-model="selectInfo.botany"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            v-if="selectInfo.type_desc == '养殖业类'"
            :range="codeMap.n00067"
            label="养殖业类"
            placeholder="请选择养殖业类"
            idName="breed"
            align="right"
            v-model="selectInfo.breed"
            @change="handlePickerChange"></ComponentDeclarePicker>

          <div class="input-cell" v-for="item in showunit" :key="item.id">
            <div class="key">{{ item.name }}：</div>
            <div class="value">
              <input
                class="input numInput"
                type="digit"
                maxlength="11"
                placeholder="请输入数量"
                v-model="selectInfo[item.id]" />
            </div>
          </div>
        </block>
        <!-- 攀枝花 育儿奖励金 添加其他子女 -->
        <block v-if="type === '20407'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">身份证号：</div>
            <div class="value">
              <input
                class="input"
                type="idcard"
                maxlength="18"
                placeholder="请输入身份证号"
                v-model="selectInfo.idCard"
                @blur="handleBlurIdCard" />
            </div>
          </div>
        </block>
        <!-- 广安 生猪无害化处理补助资金 添加动物标识号码 -->
        <block v-if="type === '20173'">
          <div class="input-cell">
            <div class="key">动物标识号码：</div>
            <div class="value">
              <input class="input" type="number" placeholder="请输入动物标识号码" v-model="selectInfo.number" />
            </div>
          </div>
        </block>
        <!-- 成都 送温暖工程及帮困扶贫 添加其他家庭成员 -->
        <block v-if="type === '20093'">
          <scroll-view class="scroll-view_H"  scroll-y="true">
            <div class="input-cell">
              <div class="key">姓名：</div>
              <div class="value">
                <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
              </div>
            </div>
            <ComponentDeclareRadio
              label="性别"
              type="radio"
              :range="genderRange"
              :value="selectInfo.gender"
              idName="gender"
              @change="handleRadioChange"></ComponentDeclareRadio>
            <div class="input-cell">
              <div class="key">身份证号：</div>
              <div class="value">
                <input
                  class="input"
                  type="number"
                  maxlength="18"
                  placeholder="请输入身份证号"
                  v-model="selectInfo.idCard"
                  @blur="handleBlurIdCard" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">与申请人关系：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入与申请人关系"
                  v-model="selectInfo.relationship_desc" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">出生年月：</div>
              <div class="value">
                <input
                  class="input"
                  type="number"
                  maxlength="18"
                  placeholder="请输入出生年月"
                  v-model="selectInfo.birthday" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">民族：</div>
              <div class="value">
                <input class="input" type="text" maxlength="18" placeholder="请输入民族" v-model="selectInfo.nation" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">联系方式：</div>
              <div class="value">
                <input
                  class="input"
                  type="number"
                  maxlength="11"
                  placeholder="请输入联系方式"
                  v-model="selectInfo.tel" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">政治面貌：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入政治面貌"
                  v-model="selectInfo.political_climate" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">婚姻状况：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入婚姻状况"
                  v-model="selectInfo.marrige" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">健康状况：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入健康状况"
                  v-model="selectInfo.healthy" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">单位或学校：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入单位或学校"
                  v-model="selectInfo.workorschool" />
              </div>
            </div>
            <ComponentDeclarePicker
              :range="codeMap.s00032"
              label="人员身份："
              placeholder="请选择人员身份"
              idName="people"
              align="right"
              v-model="selectInfo.people"
              @change="handlePickerChange"></ComponentDeclarePicker>
            <div class="input-cell" v-if="selectInfo.people == '3'">
              <div class="key">当前学历：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入当前学历"
                  v-model="selectInfo.education" />
              </div>
            </div>
            <div class="input-cell" v-if="selectInfo.people == '3'">
              <div class="key">入学年份：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入入学年份"
                  v-model="selectInfo.year" />
              </div>
            </div>
            <div class="input-cell" v-if="selectInfo.people == '3'">
              <div class="key">学习年制：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入学习年制"
                  v-model="selectInfo.study" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">备注：</div>
              <div class="value">
                <input class="input" type="text" maxlength="18" placeholder="请输入备注" v-model="selectInfo.remark" />
              </div>
            </div>
          </scroll-view>
        </block>
        <!-- 非义务教育阶段贫困学生资助 添加主要家庭成员 -->
        <block v-if="type === '20300'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">身份证号：</div>
            <div class="value">
              <input
                class="input"
                type="idcard"
                maxlength="18"
                placeholder="请输入身份证号"
                v-model="selectInfo.idCard"
                @blur="handleBlurIdCard" />
            </div>
          </div>
          <div class="input-cell disabled">
            <div class="key">年龄：</div>
            <div class="value">
              {{ selectInfo.age || '暂无' }}
            </div>
          </div>
          <ComponentDeclarePicker
            :range="relationshipStudentRange"
            label="与申请人关系："
            placeholder="请选择与申请人关系"
            rangeKey="name"
            valueKey="value"
            idName="relationship"
            align="right"
            v-model="selectInfo.relationship"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <div class="input-cell">
            <div class="key">职业：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入职业" v-model="selectInfo.job" />
            </div>
          </div>
        </block>
        <!-- 独生子女四级伤残计划生育家庭补助 添加子女 -->
        <block v-if="type === '20518_1'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <ComponentDeclareRadio
            label="性别"
            type="radio"
            :range="genderRange"
            :value="selectInfo.gender"
            idName="gender"
            @change="handleRadioChange"></ComponentDeclareRadio>
          <ComponentDeclarePicker
            mode="date"
            label="出生年月："
            placeholder="请选择出生年月"
            fields="month"
            :endTime="today"
            v-model="selectInfo.birth"
            @change="hanldeChangeStartTime"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            :range="codeMap.yesorno"
            label="是否亲生："
            placeholder="请选择是否亲生"
            idName="own"
            align="right"
            v-model="selectInfo.own"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            v-if="selectInfo.birth"
            mode="date"
            label="死残日期："
            placeholder="请选择死残日期"
            fields="day"
            :startTime="selectInfo.birth"
            :endTime="today"
            v-model="selectInfo.die"
            @change="hanldeChangeStartTime"></ComponentDeclarePicker>
        </block>
        <block v-if="type === '20518_2'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <ComponentDeclareRadio
            label="性别"
            type="radio"
            :range="genderRange"
            :value="selectInfo.gender"
            idName="gender"
            @change="handleRadioChange"></ComponentDeclareRadio>
          <ComponentDeclarePicker
            mode="date"
            label="出生年月："
            placeholder="请选择出生年月"
            fields="month"
            :endTime="today"
            v-model="selectInfo.birth"
            @change="hanldeChangeStartTime"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            v-if="selectInfo.birth"
            mode="date"
            label="收养年月："
            placeholder="请选择收养年月"
            fields="month"
            :startTime="selectInfo.birth"
            :endTime="today"
            v-model="selectInfo.adoption"
            @change="hanldeChangeStartTime"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            v-if="selectInfo.adoption"
            mode="date"
            label="死残日期："
            placeholder="请选择死残日期"
            fields="day"
            :startTime="selectInfo.adoption"
            :endTime="today"
            v-model="selectInfo.die"
            @change="hanldeChangeStartTime"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            :range="codeMap.yesorno"
            label="是否具有法律手续："
            placeholder="请选择具有法律手续"
            idName="proce"
            align="right"
            v-model="selectInfo.proce"
            @change="handlePickerChange"></ComponentDeclarePicker>
        </block>
        <!-- 市本级高中国家助学金 添加家庭成员 -->
        <block v-if="type === '20014'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <ComponentDeclareRadio
            label="性别"
            type="radio"
            :range="genderRange"
            :value="selectInfo.gender"
            idName="gender"
            @change="handleRadioChange"></ComponentDeclareRadio>
          <div class="input-cell">
            <div class="key">年龄：</div>
            <div class="value">
              <input class="input" type="number" maxlength="3" placeholder="请输入年龄" v-model="selectInfo.age" />
            </div>
          </div>
          <ComponentDeclarePicker
            :range="relationshipStudentRange"
            label="与学生关系："
            placeholder="请选择与学生关系"
            rangeKey="name"
            valueKey="value"
            idName="relationship"
            align="right"
            v-model="selectInfo.relationship"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <div class="input-cell">
            <div class="key">工作学习单位：</div>
            <div class="value">
              <input
                class="input"
                type="text"
                maxlength="12"
                placeholder="请输入工作(学习)单位"
                v-model="selectInfo.workAdress" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">职业：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入职业" v-model="selectInfo.job" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">年收入（元）：</div>
            <div class="value">
              <input class="input" type="digit" maxlength="12" placeholder="请输入年收入" v-model="selectInfo.wages" />
            </div>
          </div>
          <ComponentDeclarePicker
            :range="healthyRange"
            label="健康状况："
            placeholder="请选择健康状况"
            idName="healthy"
            rangeKey="name"
            valueKey="value"
            align="right"
            v-model="selectInfo.healthy"
            @change="handlePickerChange"></ComponentDeclarePicker>
        </block>
        <!-- 地方政府济困助学 添加家庭成员 -->
        <block v-if="type === '20607'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">身份证号：</div>
            <div class="value">
              <input
                class="input"
                type="idcard"
                maxlength="18"
                placeholder="请输入身份证号"
                v-model="selectInfo.idCard"
                @blur="handleBlurIdCard" />
            </div>
          </div>
          <div class="input-cell disabled">
            <div class="key">年龄：</div>
            <div class="value">
              {{ selectInfo.age || '暂无' }}
            </div>
          </div>
          <ComponentDeclarePicker
            :range="codeMap.aac016"
            label="工作状态："
            placeholder="请选择工作状态"
            idName="work"
            align="right"
            v-model="selectInfo.work"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <ComponentDeclarePicker
            :range="relationshipRange"
            label="与申请人关系："
            placeholder="请选择与申请人关系"
            rangeKey="name"
            valueKey="value"
            idName="relationship"
            align="right"
            v-model="selectInfo.relationship"
            @change="handlePickerChange"></ComponentDeclarePicker>
        </block>
        <!-- 公祖房租赁补贴 添加家庭成员 -->
        <block v-if="type === '20007'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">身份证号：</div>
            <div class="value">
              <input
                class="input"
                type="idcard"
                maxlength="18"
                placeholder="请输入身份证号"
                v-model="selectInfo.idCard"
                @blur="handleBlurIdCard" />
            </div>
          </div>
          <ComponentDeclarePicker
            :range="relationshipRange"
            label="与申请人关系："
            placeholder="请选择与申请人关系"
            rangeKey="name"
            valueKey="value"
            idName="relationship"
            align="right"
            v-model="selectInfo.relationship"
            @change="handlePickerChange"></ComponentDeclarePicker>
        </block>
        <!-- 残疾人就业创业扶持（残保金项目） 添加家庭成员 -->
        <block v-if="type === '20640'">
          <div class="box-over">
            <div class="input-cell">
              <div class="key">姓名：</div>
              <div class="value">
                <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
              </div>
            </div>
            <ComponentDeclareRadio
              label="性别"
              type="radio"
              :range="genderRange"
              :value="selectInfo.sex"
              idName="sex"
              @change="handleRadioChange"></ComponentDeclareRadio>
            <div class="input-cell">
              <div class="key">年龄：</div>
              <div class="value">
                <input class="input" type="number" maxlength="18" placeholder="请输入年龄" v-model="selectInfo.age" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">残疾等级：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入残疾等级"
                  v-model="selectInfo.level" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">残疾类别：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入残疾类别"
                  v-model="selectInfo.style" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">残疾证号：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入残疾证号"
                  v-model="selectInfo.number" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">联系电话：</div>
              <div class="value">
                <input
                  class="input"
                  type="text"
                  maxlength="18"
                  placeholder="请输入联系电话"
                  v-model="selectInfo.phone" />
              </div>
            </div>
            <div class="input-cell">
              <div class="key">户籍地址：</div>
              <div class="value">
                <input class="input" type="text" placeholder="请输入户籍地址" v-model="selectInfo.address" />
              </div>
            </div>
            <ComponentDeclarePicker
              mode="date"
              fields="day"
              label="聘用时间："
              align="right"
              :endTime="today"
              placeholder="请选择聘用时间"
              v-model="selectInfo.time"></ComponentDeclarePicker>
          </div>
        </block>
        <!-- 残疾人及贫困残疾人家庭子女教育资助  添加家庭成员 -->
        <block v-if="type === '20639'">
          <div class="input-cell">
            <div class="key">残疾人姓名：</div>
            <div class="value">
              <input
                class="input"
                type="text"
                maxlength="12"
                placeholder="请输入残疾人姓名"
                v-model="selectInfo.name" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">身份证号：</div>
            <div class="value">
              <input
                class="input"
                type="idcard"
                maxlength="18"
                placeholder="请输入身份证号"
                v-model="selectInfo.idCard"
                @blur="getDataByIdCard(selectInfo.idCard)" />
            </div>
          </div>
          <ComponentDeclarePicker
            :range="relation_shipRange"
            label="与申请人关系："
            placeholder="请选择与申请人关系"
            rangeKey="name"
            valueKey="value"
            idName="relationship"
            align="right"
            v-model="selectInfo.relationship_desc"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <div class="input-cell">
            <div class="key">工作单位：</div>
            <div class="value">
              <input class="input" type="text" placeholder="请输入工作单位" v-model="selectInfo.work" />
            </div>
          </div>
          <div class="input-cell disabled">
            <div class="key">残疾类别：</div>
            <div class="value">
              {{ selectInfo.style_desc || '暂无' }}
            </div>
          </div>
          <div class="input-cell disabled">
            <div class="key">残疾等级：</div>
            <div class="value">
              {{ selectInfo.level_desc || '暂无' }}
            </div>
          </div>
          <div class="input-cell disabled">
            <div class="key">残疾证号：</div>
            <div class="value">
              {{ selectInfo.number || '暂无' }}
            </div>
          </div>
        </block>
        <!-- 残疾人及贫困残疾人家庭子女教育资助  添加家庭成员 -->
        <block v-if="type === '20072'">
          <div class="input-cell">
            <div class="key">姓名：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入姓名" v-model="selectInfo.name" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">身份证号：</div>
            <div class="value">
              <input
                class="input"
                type="idcard"
                maxlength="18"
                placeholder="请输入身份证号"
                v-model="selectInfo.idCard"
                @blur="handleBlurIdCard" />
            </div>
          </div>
          <ComponentDeclarePicker
            :range="relation"
            label="与申请人关系："
            placeholder="请选择与申请人关系"
            rangeKey="name"
            valueKey="value"
            idName="relation"
            align="right"
            v-model="selectInfo.relationship_desc"
            @change="handlePickerChange"></ComponentDeclarePicker>
          <div class="input-cell">
            <div class="key">工作单位：</div>
            <div class="value">
              <input class="input" type="text" placeholder="请输入工作单位" v-model="selectInfo.work" />
            </div>
          </div>
        </block>
        <!-- 乡村医生 在岗 -->
        <block v-if="type === '20457_o'">
          <ComponentDeclarePicker
            mode="date"
            label="工作开始时间："
            placeholder="请选择工作开始时间"
            fields="month"
            :endTime="today"
            v-model="selectInfo.start"
            @change="hanldeChangeStartTime"></ComponentDeclarePicker>

          <ComponentDeclarePicker
            mode="date"
            fields="month"
            label="工作结束时间："
            align="right"
            :startTime="selectInfo.start"
            :endTime="today"
            placeholder="请选择工作结束时间"
            v-model="selectInfo.end"></ComponentDeclarePicker>

          <div class="input-cell">
            <div class="key">执业地点：</div>
            <div class="value">
              <input
                class="input"
                type="text"
                maxlength="12"
                placeholder="请输入执业地点"
                v-model="selectInfo.address" />
            </div>
          </div>
          <div class="input-cell">
            <div class="key">证明人：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入证明人" v-model="selectInfo.person" />
            </div>
          </div>
        </block>
        <!-- 乡村医生 离岗 -->
        <block v-if="type === '20457_l'">
          <ComponentDeclarePicker
            mode="date"
            label="工作开始时间："
            placeholder="请选择工作开始时间"
            fields="month"
            :endTime="today"
            v-model="selectInfo.start"
            @change="hanldeChangeStartTime"></ComponentDeclarePicker>

          <ComponentDeclarePicker
            mode="date"
            fields="month"
            label="工作结束时间："
            align="right"
            :startTime="selectInfo.start"
            :endTime="today"
            placeholder="请选择工作结束时间"
            v-model="selectInfo.end"></ComponentDeclarePicker>

          <div class="input-cell disabled">
            <div class="key">累计工作时间：</div>
            <div class="value">
              {{ selectInfo.totalTime || '0年0月' }}
            </div>
          </div>

          <div class="input-cell">
            <div class="key">工作地点：</div>
            <div class="value">
              <input
                class="input"
                type="text"
                maxlength="12"
                placeholder="请输入工作地所在村"
                v-model="selectInfo.address" />
            </div>
          </div>

          <div class="input-cell">
            <div class="key">证明人：</div>
            <div class="value">
              <input class="input" type="text" maxlength="12" placeholder="请输入证明人" v-model="selectInfo.person" />
            </div>
          </div>
        </block>
        <div class="button-wrapper">
          <ComponentButton name="保存" type="primary" @click="handleSave"></ComponentButton>
        </div>
        <div class="iconfont iconfont-close" @click="closePopup"></div>
      </div>
    </ComponentPopup>
  </view>
</template>

<script>
  import ComponentPopup from '@/components/common/ez-popup/ez-popup.vue'
  import ComponentDeclarePicker from '@/components/project/ez-declare-picker/ez-declare-picker.vue'
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import { getCodeListByCodeName } from '@/utils/custom-api'
  import ComponentDeclareRadio from '@/components/project/ez-declare-radio/ez-declare-radio.vue'
  import { showModal } from '@/utils/uni-api'
  import { getDate } from '@/utils/get'
  import { checkIDCard, checkPhoneNumber } from '@/utils/check'
  import { getAge } from '@/utils/get'
  import { requestSPGetHo08 } from '@/service/api'
  /**
   * 申报 卡片 组件
   * @description 申报 卡片 组件
   */
  export default {
    name: 'ezDeclareCard',
    props: {
      // 渲染数据
      renderData: {
        type: [Array],
        default: () => {
          return []
        }
      },
      // 添加按钮名称
      addButtonName: {
        type: [String],
        default: '添加'
      },
      // 类型 根据项目编号设定
      type: {
        type: [String],
        required: true
      }
    },
    data() {
      return {
        // 选择的信息 或者 填报的信息
        selectInfo: {},
        // 自定义性别
        genderRange: [
          {
            aaa102: '1',
            aaa103: '男'
          },
          {
            aaa102: '2',
            aaa103: '女'
          }
        ],
        // 自定义与学生关系码表
        relationshipStudentRange: [
          {
            id: '01',
            value: '本人',
            name: '本人'
          },
          {
            id: '51',
            value: '父子',
            name: '父子'
          },
          {
            id: '52',
            value: '父女',
            name: '父女'
          },
          {
            id: '53',
            value: '母子',
            name: '母子'
          },
          {
            id: '54',
            value: '母女',
            name: '母女'
          },
          {
            id: '02',
            value: '兄妹',
            name: '兄妹'
          },
          {
            id: '03',
            value: '兄弟',
            name: '兄弟'
          },
          {
            id: '04',
            value: '姐弟',
            name: '姐弟'
          },
          {
            id: '05',
            value: '姐妹',
            name: '姐妹'
          },
          {
            id: '100',
            value: '其他关系',
            name: '其他关系'
          }
        ],
        // 自定义与户主关系码表
        relationshipRange: [
          {
            id: '01',
            value: '本人',
            name: '本人'
          },
          {
            id: '02',
            value: '户主',
            name: '户主'
          },
          {
            id: '10',
            value: '配偶',
            name: '配偶'
          },
          {
            id: '20',
            value: '子',
            name: '子'
          },
          {
            id: '28',
            value: '女婿',
            name: '女婿'
          },
          {
            id: '30',
            value: '女',
            name: '女'
          },
          {
            id: '36',
            value: '儿媳',
            name: '儿媳'
          },
          {
            id: '41',
            value: '孙子',
            name: '孙子'
          },
          {
            id: '42',
            value: '孙女',
            name: '孙女'
          },
          {
            id: '43',
            value: '外孙子',
            name: '外孙子'
          },
          {
            id: '44',
            value: '外孙女',
            name: '外孙女'
          },
          {
            id: '51',
            value: '父亲',
            name: '父亲'
          },
          {
            id: '52',
            value: '母亲',
            name: '母亲'
          },
          {
            id: '100',
            value: '其他关系',
            name: '其他关系'
          }
        ],
        // 自定义与申请人关系码表
        relation: [
          {
            id: '01',
            value: '夫妻',
            name: '夫妻'
          },
          {
            id: '02',
            value: '（养）子女',
            name: '（养）子女'
          },
          {
            id: '03',
            value: '（养）父',
            name: '（养）父'
          },
          {
            id: '04',
            value: '（养）母',
            name: '（养）母'
          },
          {
            id: '05',
            value: '其他',
            name: '其他'
          }
        ],
        // 自定义与申请人关系码表
        relation_shipRange: [
          {
            id: '01',
            value: '父亲',
            name: '父亲'
          },
          {
            id: '02',
            value: '母亲',
            name: '母亲'
          }
        ],
        // 自定义单位
        unit: [
          {
            id: 'n00068',
            name: '万袋（棒)',
            attribute: ['食用菌']
          },
          {
            id: 'n00069',
            name: '年出栏（头）',
            attribute: ['猪', '肉牛', '羊']
          },
          {
            id: 'n00070',
            name: '年存栏（只)',
            attribute: ['蛋禽', '能繁殖母兔']
          },
          {
            id: 'n00071',
            name: '年出栏（只）',
            attribute: ['肉禽']
          },
          {
            id: 'n00072',
            name: '年存栏（箱）',
            attribute: ['中蜂', '意蜂']
          },
          {
            id: 'n00073',
            name: '面积（亩）',
            attribute: ['粮油', '蔬菜', '水果', '中药材', '茶叶、蚕桑', '其他经济作物']
          },
          {
            id: 'n00074',
            name: '年产值（万元）',
            attribute: ['特种养殖']
          },
          {
            id: 'n00075',
            name: '池塘养殖面积（亩）',
            attribute: ['水产养殖']
          }
        ],
        // 自定义健康状况码表
        healthyRange: [
          {
            id: 'jk',
            name: '健康',
            value: '健康'
          },
          {
            id: 'hb',
            name: '患病',
            value: '患病'
          },
          {
            id: 'cj',
            name: '残疾',
            value: '残疾'
          }
        ],
        today: getDate(), // 今日时间 限制时间选择
        codeMap: {}
      }
    },
    components: {
      ComponentPopup,
      ComponentButton,
      ComponentDeclarePicker,
      ComponentDeclareRadio
    },
    filters: {
      // 农业物品计量单位
      findName(value, arr) {
        let keyarr = Object.keys(value)
        let data = ''
        keyarr.forEach((item) => {
          let res = arr.find((one) => one.id === item)
          if (res && value[res.id]) {
            data = res.name
          }
        })
        return data
      },
      // 农业物品计量
      findNum(value, arr) {
        let keyarr = Object.keys(value)
        let data = ''
        keyarr.forEach((item) => {
          let res = arr.find((one) => one.id === item)
          if (res && value[res.id]) {
            data = value[res.id]
          }
        })
        return data
      }
    },
    computed: {
      // 农业种类选取变换
      showunit() {
        let { breed_desc, botany_desc } = this.selectInfo
        let arr = []
        if (breed_desc || botany_desc) {
          let res = null
          this.unit.forEach((item) => {
            this.selectInfo[item.id] = ''
            let result = item.attribute.find((one) => one == breed_desc || one == botany_desc)
            if (result) {
              res = { name: item.name, id: item.id }
            }
          })
          if (res) {
            arr.push(res)
          }
        } else if (this.selectInfo.type_desc == '种养结合类') {
          arr = [{ name: '年产值（万元）', id: 'n00074' }]
        }
        return arr
      }
    },
    created() {},
    mounted() {
      this.getCodeTableCacheData()
    },
    methods: {
      // 通过身份证号查询一些信息
      getDataByIdCard(idCard) {
        // 查询残疾人信息
        requestSPGetHo08(idCard, true, false)
          .then((res) => {
            //  console.log(res,'残疾人数据')
            this.selectInfo = {
              ...this.selectInfo,
              style: res.chb0h1,
              style_desc: res.chb0h1Desc,
              level: res.chb0h2,
              level_desc: res.chb0h2Desc,
              number: res.c03601
            }
            // console.log(this.selectInfo)
          })
          .catch((err) => {
            this.selectInfo = {
              ...this.selectInfo,
              style: '',
              style_desc: '',
              level: '',
              level_desc: '',
              number: ''
            }
          })
      },
      openPopup() {
        this.$refs.popup.open()
      },
      closePopup() {
        this.$refs.popup.close()
      },
      // 获取该申报项目的所需要的码表数据
      getCodeTableCacheData() {
        const type = this.type
        getCodeListByCodeName('yesorno').then((res) => {
          this.codeMap = {
            ...this.codeMap,
            yesorno: res
          }
        })
        // 凉山 公共租赁住房实物配租 添加共同申请人
        if (type === '200001') {
          // 所属群体
          getCodeListByCodeName('z00065').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              z00065: res
            }
          })
          // 残疾类型
          getCodeListByCodeName('z00066').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              z00066: res
            }
          })
          // 残疾等级
          getCodeListByCodeName('chb0h2').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              chb0h2: res
            }
          })
        }
        // 地方政府济困助学
        if (type === '20607') {
          // 就业状态码表
          getCodeListByCodeName('aac016').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              aac016: res
            }
          })
        }
        // 市本级高中国家助学金
        if (type === '20014') {
          // 获取性别
          // getCodeListByCodeName('aac004').then((res) => {
          //   this.codeMap = {
          //     ...this.codeMap,
          //     aac004: res,
          //   }
          // })
        }
        // 地质灾害搬迁 家庭成员与户主关系
        // getCodeListByCodeName('chp031').then((res) => {
        //   this.codeMap = {
        //     ...this.codeMap,
        //     chp031: res,
        //   }
        // })
        // 获取健康状态
        // getCodeListByCodeName('m00029').then((res) => {
        //   this.codeMap = {
        //     ...this.codeMap,
        //     m00029: res,
        //   }
        // })
        if (type === '20093') {
          // 人员身份码表
          getCodeListByCodeName('s00032').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              s00032: res
            }
          })
        }
        // 新型职业农民参加城镇职工养老保险补助
        if (type === '20106') {
          // 获取农业类型码表
          getCodeListByCodeName('n00065').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              n00065: res
            }
          })
          // 获取种植业类码表
          getCodeListByCodeName('n00066').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              n00066: res
            }
          })
          // 获取养殖业类码表
          getCodeListByCodeName('n00067').then((res) => {
            this.codeMap = {
              ...this.codeMap,
              n00067: res
            }
          })
        }
      },
      // 根据开始时间和结束时间计算累计年月
      getTotalTime(startTime, endTime) {
        let str = ''
        let s = startTime.split('-')
        let e = endTime.split('-')
        let y = parseInt(e[0]) - parseInt(s[0])
        let m = parseInt(e[1]) - parseInt(s[1]) + 1
        if (m < 0) {
          m = 12 + m
          y = y - 1
        }
        if (m >= 12) {
          m = 0
          y = y + 1
        }
        str = y + '年' + m + '月'
        return str
      },
      // 开始时间改变
      hanldeChangeStartTime() {
        this.selectInfo = {
          ...this.selectInfo,
          end: '',
          totalTime: '0年0月'
        }
      },
      // 捕获 picker 改变
      handlePickerChange(id, val_desc, val) {
        this.selectInfo = {
          ...this.selectInfo,
          [id]: val,
          [id + '_desc']: val_desc
        }
      },
      // 捕获 radio 改变
      handleRadioChange(id, val_desc, val) {
        console.log(id, val_desc, val)
        this.selectInfo = {
          ...this.selectInfo,
          [id]: val,
          [id + '_desc']: val_desc
        }
      },
      // 手动输入身份证号 失去焦点
      handleBlurIdCard(e) {
        const { value } = e.target
        const checkResult = checkIDCard(value, '成员身份证号')
        if (checkResult.status === '0') {
          showModal(checkResult.msg)
          this.selectInfo = {
            ...this.selectInfo
          }
        } else {
          // 身份证号输入正确
          let res = this.renderData.find((item) => item.idCard === value)
          if (res) {
            showModal('身份证号已录入！')
          }
          const age = getAge(value)
          this.selectInfo = {
            ...this.selectInfo,
            age
          }
        }
      },
      // 手动输入手机号 失去焦点监听
      handleTelBlur(e) {
        const { value } = e.target
        const checkIDCardResult = checkPhoneNumber(value, '联系方式')
        if (checkIDCardResult.status === '0') {
          showModal(checkIDCardResult.msg, '提示', false)
        }
      },
      // 检测输入项是否输入合法
      handleCheck() {
        const type = this.type
        const renderData = [...this.renderData]
        if (type === '200001') {
          const { name, idCard, tel, income, unit, group, categories, grade } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkResult = checkIDCard(idCard, '身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
            for (let i = 0, len = renderData.length; i < len; i++) {
              let item = renderData[i]
              if (idCard === item.idCard) {
                showModal('该对象已添加，请添加未添加成员！')
                return false
              }
            }
          }
          if (!tel) {
            showModal('请输入联系方式')
            return false
          } else {
            const checkResult = checkPhoneNumber(tel, '联系方式')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
          }
          if (!income) {
            showModal('请输入月收入')
            return false
          }
          if (!unit) {
            showModal('请输入工作单位')
            return false
          }
          if (!group) {
            showModal('请选择所属群体')
            return false
          }
          // if (!categories) {
          //   showModal('请选择残疾类别')
          //   return false
          // }
          // if (!grade) {
          //   showModal('请选择残疾等级')
          //   return false
          // }
        }
        if (type === '20970') {
          const { name, idCard } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkResult = checkIDCard(idCard, '家庭成员身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
            for (let i = 0, len = renderData.length; i < len; i++) {
              let item = renderData[i]
              if (idCard === item.idCard) {
                showModal('该指导对象已添加，请添加未添加成员！')
                return false
              }
            }
          }
        }
        if (type === '20044') {
          const { name, idCard, relationship } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkResult = checkIDCard(idCard, '家庭成员身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
            for (let i = 0, len = renderData.length; i < len; i++) {
              let item = renderData[i]
              if (idCard === item.idCard) {
                showModal('该成员已添加，请添加未添加成员！')
                return false
              }
            }
          }
          if (!relationship) {
            showModal('请选择与户主关系')
            return false
          }
        }
        if (type === '20173') {
          const { number } = this.selectInfo
          if (!number) {
            showModal('请输入动物标识号码')
            return false
          }
        }
        if (type === '20407') {
          const { name, idCard, relationship } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkResult = checkIDCard(idCard, '子女身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
          }
          let res = this.renderData.find((item) => item.idCard === idCard)
          if (res) {
            showModal('身份证号已经存在！')
            return false
          }
        }
        if (type === '20093') {
          const {
            name, // 姓名
            idCard, // 身份证号
            relationship, // 与申请人关系
            nation, // 民族
            birthdy, // 出生年月
            relationship_desc
          } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkResult = checkIDCard(idCard, '家庭成员身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
          }
          let res = this.renderData.find((item) => item.idCard === idCard)
          if (res) {
            showModal('身份证号已经存在！')
            return false
          }
          if (!relationship_desc) {
            showModal('请选择与申请人关系')
            return false
          }
        }
        if (type === '20106') {
          const { type, botany, breed, n00068, n00069, n00070, n00071, n00072, n00073, n00074, n00075 } =
            this.selectInfo
          if (!type) {
            showModal('请选择类型')
            return false
          }
          if (!botany && !breed && this.selectInfo.type_desc !== '种养结合类') {
            showModal('请选择种养类型')
            return false
          }
          if (!n00068 && !n00069 && !n00070 && !n00071 && !n00072 && !n00073 && !n00074 && !n00075) {
            showModal('请输入数量')
            return false
          }
        }
        if (type === '20607') {
          const { name, idCard, work } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkResult = checkIDCard(idCard, '家庭成员身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
          }
          let res = this.renderData.find((item) => item.idCard === idCard)
          if (res) {
            showModal('身份证号已经存在！')
            return false
          }
          if (!work) {
            showModal('请选择工作状态')
            return false
          }
        }
        if (type === '20007') {
          const { name, idCard, relationship } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkResult = checkIDCard(idCard, '家庭成员身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
          }
          let res = this.renderData.find((item) => item.idCard === idCard)
          if (res) {
            showModal('身份证号已经存在！')
            return false
          }
          if (!relationship) {
            showModal('请选择与申请人关系')
            return false
          }
        }
        if (type === '20640') {
          const { name, sex, age, level, style, number, phone, address, time } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!sex) {
            showModal('请选择性别')
            return false
          }
          if (!age) {
            showModal('请输入年龄')
            return false
          }
          if (!level) {
            showModal('请输入残疾等级')
            return false
          }
          if (!style) {
            showModal('请输入残疾类别')
            return false
          }
          if (!number) {
            showModal('请输入残疾证号')
            return false
          }
          if (!phone) {
            showModal('请输入联系电话')
            return false
          }
          if (!address) {
            showModal('请输入户籍地址')
            return false
          }
          if (!time) {
            showModal('请输入聘用时间')
            return false
          }
        }
        if (type === '20639') {
          const { name, idCard, relationship_desc, work, style, level, number } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkResult = checkIDCard(idCard, '家庭成员身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
          }
          let res = this.renderData.find((item) => item.idCard === idCard)
          if (res) {
            showModal('身份证号已经存在！')
            return false
          }
          if (!relationship_desc) {
            showModal('请选择与申请人关系')
            return false
          }
          if (!work) {
            showModal('请输入工作单位')
            return false
          }
          if (!style) {
            showModal('请输入残疾类别')
            return false
          }
          if (!level) {
            showModal('请输入残疾等级')
            return false
          }
          if (!number) {
            showModal('请输入残疾人证号')
            return false
          }
        }
        if (type === '20072') {
          const { name, idCard, relationship_desc, work } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          } else {
            const checkResult = checkIDCard(idCard, '家庭成员身份证号')
            if (checkResult.status === '0') {
              showModal(checkResult.msg)
              return false
            }
          }
          let res = this.renderData.find((item) => item.idCard === idCard)
          if (res) {
            showModal('身份证号已经存在！')
            return false
          }
          if (!relationship_desc) {
            showModal('请选择与申请人关系')
            return false
          }
          if (!work) {
            showModal('请输入工作单位')
            return false
          }
        }
        if (type === '20300') {
          const {
            name, // 姓名
            idCard, // 身份证号
            relationship, // 关系
            age, // 年龄
            job // 工作，
          } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!idCard) {
            showModal('请输入身份证号')
            return false
          }
          let res = this.renderData.find((item) => item.idCard === idCard)
          if (res) {
            showModal('身份证号已经存在！')
            return false
          }
          if (!age) {
            showModal('请输入年龄')
            return false
          }
          if (!relationship) {
            showModal('请选择与申请人关系')
            return false
          }
          if (!job) {
            showModal('请输入职业')
            return false
          }
        }
        if (type === '20014') {
          const renderData = [...this.renderData]
          const {
            id,
            name, // 姓名
            gender, // 性别
            relationship, // 关系
            age, // 年龄
            job, // 工作，
            healthy, // 健康状况，
            workAdress, // 工作单位，
            wages // 年收入
          } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          } else {
            let tag = false
            for (let i = 0, len = renderData.length; i < len; i++) {
              const item = renderData[i]
              if (item.name === name) {
                tag = true
                break
              }
            }
            if (tag) {
              if (!id) {
                showModal('该家庭成员已存在，请勿重复添加！')
                return false
              }
            }
          }
          if (!gender) {
            showModal('请选择性别')
            return false
          }
          if (!age) {
            showModal('请输入年龄')
            return false
          }
          if (!relationship) {
            showModal('请选择与学生关系')
            return false
          } else {
            let tag = false
            let existId = ''
            for (let i = 0, len = renderData.length; i < len; i++) {
              const item = renderData[i]
              // 存在 本人 关系
              if (item.relationship === '本人') {
                existId = item.id
              }
              if (item.relationship === relationship && relationship === '本人') {
                tag = true
                break
              }
            }
            if (tag) {
              if (!id || id !== existId) {
                showModal('请重新选择与学生关系，本人关系已存在！')
                return false
              }
            }
          }
          if (!workAdress) {
            showModal('请输入工作（学习）单位')
            return false
          }
          if (!job) {
            showModal('请输入职业')
            return false
          }
          if (!wages) {
            showModal('请输入年收入')
            return false
          }
          if (!healthy) {
            showModal('请选择健康状况')
            return false
          }
        }
        if (type === '20457_o') {
          const { start, end, address, person } = this.selectInfo
          if (!start) {
            showModal('请选择工作开始时间')
            return false
          }
          if (!end) {
            showModal('请选择工作结束时间')
            return false
          }
          if (!address) {
            showModal('请输入执业地点')
            return false
          }
          if (!person) {
            showModal('请输入证明人')
            return false
          }
        }
        if (type === '20457_l') {
          const { start, end, address, person } = this.selectInfo
          if (!start) {
            showModal('请选择工作开始时间')
            return false
          }
          if (!end) {
            showModal('请选择工作结束时间')
            return false
          }
          if (!address) {
            showModal('请输入工作地所在村')
            return false
          }
          if (!person) {
            showModal('请输入证明人')
            return false
          }
        }
        if (type === '20518_1') {
          const { name, gender, birth, own, die } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!gender) {
            showModal('请选择性别')
            return false
          }
          if (!birth) {
            showModal('请输入出生年月')
            return false
          }
          if (!own) {
            showModal('请选择是否亲生')
            return false
          }
          if (!die) {
            showModal('请选择死残日期')
            return false
          }
        }
        if (type === '20518_2') {
          const { name, gender, birth, adoption, die, proce } = this.selectInfo
          if (!name) {
            showModal('请输入姓名')
            return false
          }
          if (!gender) {
            showModal('请选择性别')
            return false
          }
          if (!birth) {
            showModal('请输入出生年月')
            return false
          }
          if (!adoption) {
            showModal('请输入收养年月')
            return false
          }
          if (!die) {
            showModal('请选择死残日期')
            return false
          }
          if (!proce) {
            showModal('请选择是否具有法律手续')
            return false
          }
        }
        return true
      },
      // 添加
      handleAdd() {
        const type = this.type
        // 解决无法识别时间限制
        if (type === '20457_o' || type === '20457_l') {
          this.selectInfo = {
            start: '',
            end: ''
          }
        } else if (type === '20014') {
          this.selectInfo = {
            gender: ''
          }
        } else if (type === '20639') {
          this.selectInfo = {
            style: '',
            style_desc: '',
            level: '',
            level_desc: '',
            number: ''
          }
        } else {
          this.selectInfo = {}
        }

        this.openPopup()
      },
      // 编辑
      handleEdit(index) {
        const item = this.renderData[index]
        this.selectInfo = {
          ...item
        }
        this.openPopup()
      },
      // 删除
      handleDelete(index) {
        const type = this.type
        const newRenderData = [...this.renderData]
        newRenderData.splice(index, 1)
        this.$emit('change', type, newRenderData)
      },
      // 保存
      handleSave() {
        const result = this.handleCheck()
        if (!result) {
          return
        }
        const type = this.type
        const renderData = [...this.renderData]
        const newRenderData = []
        let selectInfo = { ...this.selectInfo }
        const { id } = selectInfo
        // 编辑
        if (id) {
          renderData.forEach((item) => {
            if (item.id === id) {
              item = {
                ...selectInfo
              }
            }
            newRenderData.push(item)
          })
          this.$emit('change', type, newRenderData)
        } else {
          // 添加
          // console.log('======selectInfo====', selectInfo)
          selectInfo = { ...selectInfo, id: +new Date() + '' }
          renderData.push(selectInfo)
          this.$emit('change', type, renderData)
        }
        this.selectInfo = { ...selectInfo }
        this.closePopup()
      }
    },
    watch: {
      'selectInfo.type': {
        handler(val) {
          if (val) {
            this.selectInfo = {
              ...this.selectInfo,
              botany: '',
              botany_desc: '',
              breed: '',
              breed_desc: '',
              n00068: '',
              n00069: '',
              n00070: '',
              n00071: '',
              n00072: '',
              n00073: '',
              n00074: '',
              n00075: ''
            }
          }
        },
        immediate: true
      },
      // 监听开始时间改变 计算累计工作时间
      'selectInfo.start': {
        handler(val) {
          if (val) {
            const type = this.type
            const { end } = this.selectInfo
            if (type === '20457_l' && end) {
              const totalTime = this.getTotalTime(val, end)
              this.selectInfo = {
                ...this.selectInfo,
                totalTime
              }
            }
          }
        },
        immediate: true
      },
      // 监听结束时间改变 计算累计工作时间
      'selectInfo.end': {
        handler(val) {
          if (val) {
            const type = this.type
            const { start } = this.selectInfo
            if (type === '20457_l' && start) {
              const totalTime = this.getTotalTime(start, val)
              this.selectInfo = {
                ...this.selectInfo,
                totalTime
              }
            }
          }
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .scroll-view_H {
    max-height: 550rpx;
  }
  .ez-declare-card-wrapper {
    .card {
      background-color: #ffffff;
      border-radius: 8rpx;
      border: solid 1px $border-color;
      font-size: 28rpx;
      line-height: 1;
      color: $color;
      padding: 20rpx;
      position: relative;
      margin-bottom: 24rpx;
      &.add {
        color: $primary;
        min-height: 200rpx;
        font-size: 32rpx;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0;
        .iconfont-add {
          font-size: 40rpx;
        }
      }
      .cell {
        margin-bottom: 20rpx;
        font-size: 28rpx;
        line-height: 1.4;
        display: flex;
        .key {
          color: $color;
        }
        .name {
          font-weight: 600;
          font-size: 32rpx;
        }
        .relationship_man {
          box-sizing: border-box;
          border: 1px solid #aac1de;
          color: #2f77e2;
          font-size: 24rpx;
          padding: 2rpx 10rpx;
          background-color: #d6e8ff;
          border-radius: 5rpx;
        }
        .relationship_woman {
          box-sizing: border-box;
          border: 1px solid #d694c2;
          color: #e615a6;
          font-size: 24rpx;
          padding: 2rpx 10rpx;
          background-color: #fff0fa;
          border-radius: 5rpx;
        }
        .interval {
          padding: 0 10rpx;
          color: #ccc;
        }
        .value {
          flex: 1;
          overflow: hidden;
          color: #ff7e00;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
      }
      .operating {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 32rpx;
          color: $primary;
          padding: 20rpx;
        }
      }
    }
    .popup-con {
      width: 700rpx;
      background-color: #fff;
      position: relative;
      padding: 40rpx;
      padding-top: 60rpx;
      border-radius: 8rpx;
      .input-cell {
        display: flex;
        align-items: center;
        border-bottom: 1px solid $border-color;

        height: 100rpx;
        .key {
          font-size: 30rpx;
          color: $color;
          font-weight: 700;
          padding-left: 14rpx;
          position: relative;
          &::before {
            content: '*';
            position: absolute;
            color: #f00;
            top: 50%;
            transform: translateY(-50%);
            margin-top: -4rpx;
            left: 0;
          }
        }
        .value {
          flex: 1;
          color: shade($color-placeholder, 20%);
          overflow: hidden;
          padding-left: 20rpx;
          text-align: right;
        }
        .input {
          font-size: 30rpx;
          line-height: 1.4;
          color: shade($color-placeholder, 20%);
          display: block;
          font-weight: 700;
          width: 100%;
        }
        &.disabled {
          .value,
          input {
            opacity: 0.4;
          }
        }
      }
      .box-over {
        max-height: 550rpx;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
      .button-wrapper {
        padding: $spacing * 2;
        padding-bottom: 20rpx;
      }
      .iconfont-close {
        position: absolute;
        top: 10rpx;
        right: 10rpx;
        font-size: 36rpx;
        color: #f00;
        padding: 12rpx;
      }
    }
  }
</style>
