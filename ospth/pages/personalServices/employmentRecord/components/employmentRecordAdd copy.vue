<template>
    <div class="employment-record-add ">
        <div class="modal-btn">
            <ta-button @click="$router.go(-1)">返回</ta-button>
            <ta-button @click="handleReset">重置</ta-button>
            <ta-button type="primary" @click="handleConfirm">确认</ta-button>
        </div>
        <div class="content-box">
            <ta-form :autoFormCreate="(form) => { this.queryForm = form}" :formLayout="true" label-width="150px"
                layout="inline">
                <div class="sub-title">个人基本信息</div>
                <div class="form-box">
                    <ta-form-item fieldDecoratorId="yac002" label="身份证号" required>
                        <ta-input disabled />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="aac003" label="姓名" required>
                        <ta-input disabled />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="aac004" label="性别" required>
                        <ta-select disabled collection-type="sex" style="width: 178px" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="aac005" label="民族" required>
                        <ta-select disabled collection-type="AAC005" style="width: 178px" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="aac006" label="出生年月" required>
                        <ta-input disabled />
                    </ta-form-item>
                    <ta-form-item :require="{ message: '请选择户口性质!' }" fieldDecoratorId="aac009" label="户口性质">
                        <ta-select :disabled="isDisabled" collection-type="AAC011" style="width: 178px" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="aab301" label="户籍行政区划代码" v-show="false" />
                    <ta-form-item :require="{ message: '请选择户籍行政区划!' }" fieldDecoratorId="aab299" label="户籍行政区划">
                        <ta-input style="width: 420px" placeholder="请选择户籍地址" @click="openAreaSelector('aab299')"
                            :disabled="isDisabled" />
                    </ta-form-item>
                    <ta-form-item :require="{ message: '请输入户籍详细地址!' }" fieldDecoratorId="ycc004" label="户籍详细地址">
                        <ta-input :disabled="isDisabled" style="width: 280px" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="ycc005" label="现住地址行政区划代码" v-show="false" />
                    <ta-form-item :require="{ message: '请选择现住地址行政区划!' }" fieldDecoratorId="ycc299" label="现住地址行政区划">
                        <ta-input style="width: 420px" placeholder="请选择现住地址" @click="openAreaSelector('ycc299')"
                            :disabled="isDisabled" />
                    </ta-form-item>
                    <ta-form-item :require="{ message: '请输入现住地址!' }" fieldDecoratorId="aac026" label="现住地址">
                        <ta-input :disabled="isDisabled" style="width: 280px" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="ycc022" label="个人身份">
                        <ta-select :disabled="isDisabled" collection-type="AAC012" style="width: 178px" />
                    </ta-form-item>
                    <ta-form-item required fieldDecoratorId="aac011" label="文化程度">
                        <ta-select :disabled="isDisabled" collection-type="AAC011" style="width: 178px"
                            @change="fnselect" />
                    </ta-form-item>
                    <ta-form-item :fieldDecoratorOptions="{ rules: [{ phone: 'mobile', message: '输入的联系电话不合法' }] }"
                        :require="{ message: '请输入联系电话!' }" fieldDecoratorId="aae005" label="联系电话">
                        <ta-input :disabled="isDisabled" />
                    </ta-form-item>
                </div>
                <div class="sub-title">学历信息</div>
                <div class="form-box" v-if="showRequiredFields">
                    <ta-form-item :require="{ message: '请选择教育类别!' }" fieldDecoratorId="ycc03q" label="教育类别">
                        <ta-select style="width: 178px" :disabled="isDisabled">
                            <ta-select-option value="1">全日制</ta-select-option>
                            <ta-select-option value="2">非全日制</ta-select-option>
                        </ta-select>
                    </ta-form-item>
                    <ta-form-item :require="{ message: '请输入毕业院校!' }" fieldDecoratorId="yau002" label="毕业院校">
                        <ta-input :disabled="isDisabled" />
                    </ta-form-item>
                    <ta-form-item :require="{ message: '请输入所学专业!' }" fieldDecoratorId="yac01f" label="所学专业">
                        <ta-input :disabled="isDisabled" style="width: 220px" />
                    </ta-form-item>
                    <ta-form-item :require="{ message: '请选择毕业日期!' }" fieldDecoratorId="yac01g" label="毕业日期">
                        <ta-date-picker :disabled="isDisabled" />
                    </ta-form-item>
                </div>
                <div class="form-box" v-else>
                    <ta-form-item fieldDecoratorId="ycc03q" label="教育类别">
                        <ta-select style="width: 178px">
                            <ta-select-option value="1">全日制</ta-select-option>
                            <ta-select-option value="2">非全日制</ta-select-option>
                        </ta-select>
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="yau002" label="毕业院校">
                        <ta-input :disabled="isDisabled" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="yac01f" label="所学专业">
                        <ta-input :disabled="isDisabled" style="width: 220px" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="yac01g" label="毕业日期" :require="{ message: '请选择毕业日期!' }">
                        <ta-date-picker :disabled="isDisabled" />
                    </ta-form-item>
                </div>

                <div class="sub-title">就业登记信息</div>
                <div class="form-box">
                    <ta-form-item fieldDecoratorId="ycc030" label="主键流水号" v-show="false" />
                    <ta-form-item fieldDecoratorId="aac001" label="个人编号" v-show="false" />
                    <ta-form-item fieldDecoratorId="aac021" label="就失业证号码" v-show="false" />
                    <ta-form-item fieldDecoratorId="aab020" label="目前单位或经营活动的类型" v-show="false" />
                    <ta-form-item fieldDecoratorId="aab022" label="目前单位或经营活动的行业" v-show="false" />
                    <ta-form-item fieldDecoratorId="ycc031" label="是否经济活动人口" v-show="false" />
                    <ta-form-item fieldDecoratorId="ycc032" label="目前工作性质" v-show="false" />
                    <ta-form-item fieldDecoratorId="ycc033" label="社区就业性质" v-show="false" />
                    <ta-form-item fieldDecoratorId="ycc034" label="是否签订劳动合同" v-show="false" />
                    <ta-form-item fieldDecoratorId="ycc037" label="签订的劳动合同期" v-show="false" />
                    <ta-form-item fieldDecoratorId="ycc036" label="是否属于再就业" v-show="false" />
                    <ta-form-item fieldDecoratorId="aab007" label="工商登记证号" v-show="false" />
                    <ta-form-item fieldDecoratorId="aab009" label="工商执照有限期" v-show="false" />
                    <ta-form-item fieldDecoratorId="aab003" label="组织机构代码" v-show="false" />
                    <ta-form-item v-show="formFieldsVisibility.ycc03j" fieldDecoratorId="ycc03j" label="创业带动就业人数" />
                    <ta-form-item v-show="formFieldsVisibility.ycc66h" fieldDecoratorId="ycc66h" label="灵活就业方式" />
                    <ta-form-item :require="{ message: '请选择就业形式!' }" fieldDecoratorId="yhc407" label="就业形式">
                        <ta-select :disabled="isDisabled" collection-type="ADC111" style="width: 220px"
                            @change="fnSelects" />
                    </ta-form-item>
                    <ta-form-item :require="formFieldsRequired.aab004 ? { message: '请输入现工作单位!' } : undefined"
                        fieldDecoratorId="aab004" label="现工作单位">
                        <ta-input :disabled="isDisabled" />
                    </ta-form-item>
                    <ta-form-item v-show="formFieldsVisibility.ycc03n"
                        :require="formFieldsRequired.ycc03n ? { message: '请输入就业单位区域!' } : undefined"
                        fieldDecoratorId="ycc03n" label="就业单位区域">
                        <ta-input :disabled="isDisabled" :maxLength="5"></ta-input>
                    </ta-form-item>
                    <ta-form-item :require="{ message: '请选择所属行业!' }" fieldDecoratorId="ycc064" label="所属行业">
                        <ta-select :disabled="isDisabled" style="width: 178px">
                            <!-- 遍历行业分类数据 -->
                            <template v-for="category in industryCategories">
                                <!-- 使用ta-select-opt-group实现分组 -->
                                <ta-select-opt-group :label="category.name">
                                    <!-- 主类别作为组选项 -->
                                    <ta-select-option :value="category.id" :class="{ 'industry-main-category': true }">
                                        {{ category.name }}
                                    </ta-select-option>
                                    <!-- 子类别 -->
                                    <template v-for="subCategory in category.children">
                                        <ta-select-option :value="subCategory.id"
                                            :class="{ 'industry-sub-category': true }">
                                            {{ subCategory.name }}
                                        </ta-select-option>
                                    </template>
                                </ta-select-opt-group>
                            </template>
                        </ta-select>
                    </ta-form-item>
                    <ta-form-item v-show="formFieldsVisibility.adc113"
                        :require="formFieldsRequired.adc113 ? { message: '请选择是否自主创业!' } : undefined"
                        fieldDecoratorId="adc113" label="是否自主创业">
                        <ta-select :disabled="isDisabled" collection-type="YESORNO" style="width: 178px" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="ycc025" label="月平均工资">
                        <ta-input :disabled="isDisabled" style="width: 220px" />
                    </ta-form-item>
                    <ta-form-item :require="{ message: '请选择就业日期!' }" fieldDecoratorId="ycc039" label="就业日期">
                        <ta-date-picker :disabled="isDisabled" @change="fnCheckTimeYcc039" />
                    </ta-form-item>
                    <ta-form-item :require="{ message: '请选择是否签订劳动合同!' }" fieldDecoratorId="ycc03r" label="是否签订劳动合同">
                        <ta-select :disabled="isDisabled" collection-type="YESORNO" style="width: 178px"
                            @change="fnelect" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="aae031" label="合同开始日期" v-show="formFieldsVisibility.aae031">
                        <ta-date-picker :disabled="isDisabled" style="width: 220px" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="aae032" label="合同结束日期" v-show="formFieldsVisibility.aae032">
                        <ta-date-picker :disabled="isDisabled" @change="fnAae032Change" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="ycc035" label="合同年限" v-show="formFieldsVisibility.aae032">
                        <ta-input :disabled="true" placeholder="自动计算" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="aae043" label="就业登记日期" required>
                        <ta-date-picker disabled />
                    </ta-form-item>
                    <ta-form-item :require="{ message: '请选择就业登记地!' }" fieldDecoratorId="aae017" label="就业登记地">
                        <aae017-select-tree ref="aae017SelectTree" v-model="aae017Value" :data="aae017Data"
                            :disabled="isDisabled" :showSearch="true" placeholder="请选择就业登记地"
                            @change="handleAae017Change" />
                    </ta-form-item>
                    <ta-form-item v-show="formFieldsVisibility.ycc03m"
                        :require="formFieldsRequired.ycc03m ? { message: '请输入劳务派遣单位名称!' } : undefined"
                        fieldDecoratorId="ycc03m" label="劳务派遣单位名称">
                        <ta-input :disabled="isDisabled" placeholder="请输入" />
                    </ta-form-item>
                    <ta-form-item fieldDecoratorId="ycc03m" label="备注">
                        <ta-input :disabled="isDisabled" placeholder="请输入" />
                    </ta-form-item>
                </div>
                <div class="sub-title">上传材料</div>
                <materialUploadTable ref="materialUploadTable" :yda020="showUploadFile" />
            </ta-form>
        </div>
        <ta-modal title="提示" v-model="visibleModal" height="150px" @ok="handleOkModal" @cancel="handleOkModal">
            <p>{{ modalTextTip }}</p>
        </ta-modal>
        <!-- 地址选择弹窗 - 支持多个实例 -->
        <area-selector-modal :visible="showAreaModal" :level="4" :field-name="currentAreaField"
            @confirm="handleAreaConfirm" @close="showAreaModal = false" />
    </div>
</template>

<script>
    import moment from 'moment'
    import materialUploadTable from 'common/components/materialUploadTable.vue'
    import areaSelectorModal from 'common/components/areaSelectorModal.vue'
    import aae017SelectTree from '@/common/components/aae017SelectTree.vue'
    export default {
        name: 'employmentRecordAdd',
        props: {},
        components: {
            materialUploadTable,
            areaSelectorModal,
            aae017SelectTree
        },
        data() {
            return {
                modalTextTip: '',
                queryForm: {},
                visibleModal: false,
                isDisabled: false,
                industryCategories: [],
                aae043Date: '', // 就业登记日期，默认为当前日期
                showAreaModal: false,
                selectedAreaText: '',
                selectedAreaCodes: [],
                currentAreaField: 'ycc299', // 当前正在处理的地址字段名
                ycc005Value: '',
                aab301Value: '',
                showUploadFile: '',
                // 就业登记地树结构数据
                aae017Data: [],
                aae017Value: '', // 选中的就业登记地值
                aae017DESC: '',
                showRequiredFields: false,
                // 统一管理表单字段的显示状态
                formFieldsVisibility: {
                    adc113: false, // 是否自主创业
                    ycc03m: false, // 劳务派遣单位名称
                    ycc03n: false, // 就业单位区域
                    ycc66h: false, // 灵活就业方式
                    ycc03j: false, // 创业带动就业人数
                    aae031: false, // 合同开始日期
                    aae032: false, // 合同结束日期
                    ycc035: false, // 合同年限
                },
                // 统一管理表单字段的必填状态
                formFieldsRequired: {
                    adc113: false,
                    ycc03m: false,
                    aab004: true,
                    ycc03n: true
                },
            }
        },
        created() {
            this.userInfo = this.$route.params || {}
            // 初始化当前日期为就业登记日期，存储在data中
            this.aae043Date = moment()
        },
        mounted() {
            this.$nextTick(() => {
                this.init();
                // 使用setFieldsValue设置表单字段值
                if (this.queryForm.setFieldsValue) {
                    // 将moment对象转换为字符串格式，避免TaDatePicker的value属性验证失败
                    this.queryForm.setFieldsValue({
                        aae043: this.aae043Date.format('YYYY-MM-DD')
                    })
                }
                // 初始化时调用fnInitEduction方法设置学历字段的必填性
                setTimeout(() => {
                    this.fnInitEduction();
                }, 100);

                // 移到mounted钩子中调用，确保DOM已渲染完成
                this.initAae017Data();
            });
        },
        methods: {
            init() {
                const param = {
                    no: '403-0014',
                    data: JSON.stringify({
                        yac002: this.userInfo.certNo,
                    }),
                };
                Base.sendRequest('', param, (res) => {
                    if (res.serviceSuccess) {
                        if (res.data.code === '1') {
                            let forms = res.data.ac01Info || {}
                            // 处理所有日期字段，确保它们是字符串格式
                            const dateFields = ['aae043', 'ycc039', 'yac01g', 'aae031', 'aae032']
                            if (forms) {
                                dateFields.forEach(field => {
                                    if (forms[field]) {
                                        forms[field] = String(forms[field])
                                    }
                                })
                            }
                            this.queryForm.setFieldsValue(forms)
                            this.industryCategories = res.data.ycc064 || []
                        }
                        if (res.data.code === '0') {
                            this.$message.error(res.data.msg || '查询失败')
                            if (res.data.formReadOnly === 'true') {
                                this.isDisabled = true
                            } else {
                                this.isDisabled = false
                            }
                            let forms = res.data.ac01Info || {}
                            this.queryForm.setFieldsValue(forms)
                        }
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 初始化就业地数据
            async initAae017Data() {
                const selectTree = this.$refs.aae017SelectTree;
                if (selectTree && selectTree.queryAae017Data) {
                    try {
                        // 调用组件内置的查询方法，传入证件号码
                        this.aae017Data = await selectTree.queryAae017Data(this.userInfo.certNo);
                    } catch (error) {
                        console.error('初始化就业地数据失败:', error);
                    }
                } else {
                    console.warn('未找到aae017SelectTree组件或queryAae017Data方法');
                }
            },
            // 初始化教育相关字段的必填性
            fnInitEduction() {
                let aac011 = this.queryForm.getFieldValue('aac011');
                if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' || aac011 ==
                    '41') {
                    // 设置为必填
                    this.showRequiredFields = true;
                } else {
                    // 设置为非必填
                    this.showRequiredFields = false;
                }
            },
            // 选择文化程度时的校验
            fnselect(value) {
                if (value == '11' || value == '14' || value == '20' || value == '30' || value == '40' || value ==
                    '41') {
                    // 设置为必填
                    this.showRequiredFields = true;
                } else {
                    // 设置为非必填
                    this.showRequiredFields = false;
                }
                var yhc407 = this.queryForm.getFieldValue('yhc407');
                this.fnSelects('', yhc407);
            },
            // 选择就业形式时的校验
            fnSelects(value) {
                console.log(value, '?');
                var aac011 = this.queryForm.getFieldValue('aac011');
                if (null == aac011 || '' == aac011) {
                    this.$message.warning('请先选择文化程度！');
                }
                // 控制是否自主创业字段显示
                this.setFormFieldState('adc113', value == '21' || value == '99');
                // 根据就业形式和文化程度设置上传文件类型
                if (value == '21') { // 个体经营 
                    if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' ||
                        aac011 == '41') {
                        this.showUploadFile = '3_403';
                    } else {
                        this.showUploadFile = '2_403';
                    }
                } else if (value == '22') { // 灵活就业 
                    if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' ||
                        aac011 == '41') {
                        this.showUploadFile = '7_403';
                    } else {
                        this.showUploadFile = '6_403';
                    }
                } else if (value == '29') { // 单位就业个人身份登记申请 
                    if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' ||
                        aac011 == '41') {
                        this.showUploadFile = '5_403';
                    } else {
                        this.showUploadFile = '4_403';
                    }
                } else if (value == '30') { // 公益性岗位就业 
                    if (aac011 == '11' || aac011 == '14' || aac011 == '20' || aac011 == '30' || aac011 == '40' ||
                        aac011 == '41') {
                        this.showUploadFile = '9_403';
                    } else {
                        this.showUploadFile = '8_403';
                    }
                } else {
                    // 其他不必要上传材料的就业形式，重置showUploadFile以清空材料表格
                    this.showUploadFile = '';
                }
                // 控制相关字段的显示和必填性
                if (value == '10' || value == '21' || value == '29' || value == '30') {
                    this.setFormFieldState('ycc03n', true, true);
                    this.setFormFieldState('ycc064', true, true);
                } else {
                    this.setFormFieldState('ycc03n', false, false);
                    this.setFormFieldState('ycc064', false, false);
                }

                // 单位就业个人身份登记申请或公益性岗位就业时查询工作单位
                if (value == '29' || value == '30') {
                    let yac002 = this.queryForm.getFieldValue('yac002');
                    if (yac002 == null || yac002 == '') {
                        this.$message.warning('请先填写身份证号码');
                    } else {
                        //查询就业单位信息
                        const param = {
                            no: '403-0015',
                            data: JSON.stringify({
                                yac002: this.userInfo.certNo,
                            }),
                        };
                        Base.sendRequest('', param, (res) => {
                            if (res.serviceSuccess) {
                                this.visibleModal = true
                                this.modalTextTip = res.data.msg
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                    }
                }
            },
            //是否签订劳动合同
            fnelect(value) {
                console.log(value, 'value');
                // 根据是否签订劳动合同控制aae031、aae032和ycc035字段的显示
                if (value == '1') {
                    this.setFormFieldState('aae031', true, true);
                    this.setFormFieldState('aae032', true, true);
                    this.setFormFieldState('ycc035', true, false);
                } else {
                    this.setFormFieldState('aae031', false, false);
                    this.setFormFieldState('aae032', false, false);
                    this.setFormFieldState('ycc035', false, false);
                }
            },
            // 处理就业登记地选择变化
            handleAae017Change(selected) {
                if (selected && selected.value && selected.label) {
                    // 更新表单中的就业单位区域字段
                    if (this.queryForm && this.queryForm.setFieldsValue) {
                        this.queryForm.setFieldsValue({
                            aae017: selected.label,
                        });
                    }
                    this.aae017DESC = selected.label
                }
            },
            // 打开地址选择弹窗并指定字段名
            openAreaSelector(fieldName = 'ycc299') {
                this.currentAreaField = fieldName
                this.showAreaModal = true
            },
            handleAreaConfirm(data) {
                // 获取字段名，默认为ycc299
                const fieldName = data.fieldName || 'ycc299'
                // 保存选中的地址信息
                this.selectedAreaCodes = data.codes
                this.selectedAreaText = data.names.join('')

                // 构建表单数据对象
                const formData = {}
                // 根据字段名设置对应的表单值
                formData[fieldName] = this.selectedAreaText

                // 设置代码字段
                if (fieldName === 'ycc299') {
                    // 现住地址行政区划，设置对应的代码字段ycc005
                    this.ycc005Value = this.selectedAreaCodes[this.selectedAreaCodes.length - 1] // 最后一级的代码
                } else if (fieldName === 'aab299') {
                    // 户籍行政区划，设置对应的代码字段aab301
                    this.aab301Value = this.selectedAreaCodes[this.selectedAreaCodes.length - 1] // 最后一级的代码
                }

                // 统一更新表单数据
                this.queryForm.setFieldsValue(formData)

                // 关闭弹窗
                this.showAreaModal = false
            },
            // 就业日期不能大于就业登记日期
            fnCheckTimeYcc039(date, dataString) {
                const ycc039 = dataString
                // 确保aae043Date是moment对象
                if (!this.aae043Date || !moment.isMoment(this.aae043Date)) {
                    this.aae043Date = moment()
                }
                // 直接使用moment对象进行比较
                if (ycc039 && moment(ycc039).isAfter(this.aae043Date)) {
                    this.$message.error('就业日期不能大于就业登记日期')
                    return false
                }
                return true
            },
            handleReset() {
                // 重置表单
                if (this.queryForm && this.queryForm.resetFields) {
                    this.queryForm.resetFields();
                }
                if (this.queryForm && this.queryForm.setFieldsValue) {
                    this.aae043Date = moment();
                    this.queryForm.setFieldsValue({
                        aae043: this.aae043Date
                    });
                }
                // 重新初始化页面数据
                this.init();
                // 重置表单字段的显示和必填状态
                this.fnInitEduction();
                // 重置上传文件类型
                this.showUploadFile = '';
            },
            handleOkModal() {
                this.visibleModal = false
            },
            // 检测合同结束日期必须大于开始日期
            fnAae032Change() {
                // 强制获取最新的表单值
                this.$nextTick(() => {
                    const aae031 = this.queryForm.getFieldValue('aae031');
                    const aae032 = this.queryForm.getFieldValue('aae032');
                    if (aae032 && aae031) {
                        let startDate, endDate;
                        if (aae031._isAMomentObject) {
                            startDate = aae031;
                        } else {
                            // 如果是字符串，尝试用正确格式解析
                            startDate = moment(String(aae031), 'YYYY-MM-DD');
                        }
                        if (aae032._isAMomentObject) {
                            endDate = aae032;
                        } else {
                            endDate = moment(String(aae032), 'YYYY-MM-DD');
                        }
                        if (startDate.isValid() && endDate.isValid()) {
                            // 检查结束日期是否小于等于开始日期
                            if (endDate.isBefore(startDate) || endDate.isSame(startDate, 'day')) {
                                // 立即显示提示弹窗，不再使用setTimeout
                                this.visibleModal = true;
                                this.modalTextTip = "截止日期必须大于起始日期";
                            } else {
                                // 计算合同年限 - 使用moment格式确保安全
                                const startYear = startDate.year();
                                const endYear = endDate.year();
                                const years = endYear - startYear + 1;
                                this.queryForm.setFieldsValue({
                                    ycc035: years.toString()
                                });
                            }
                        } else {
                            console.log('日期无效:', startDate.isValid(), endDate.isValid());
                        }
                    }
                });
            },
            // 劳务派遣单位就业校验
            fnChangeYcc03K(key, value) {
                // 使用统一方法控制字段状态
                this.setFormFieldState('ycc03m', value == '0', value == '0');
            },
            // 人员所属类型选择事件
            fnpersonType(key, value) {
                // 使用统一方法控制多个字段状态
                this.setFormFieldState('aab004', true, value == '010');
                this.setFormFieldState('ycc03n', value == '010', value == '010');
                this.setFormFieldState('ycc66h', value == '022');
                this.setFormFieldState('ycc03j', value == '020');
            },
            // 统一控制表单字段显示和必填性的方法
            setFormFieldState(field, visible = true, required = false) {
                if (Array.isArray(field)) {
                    field.forEach(f => this.setFormFieldState(f, visible, required));
                    return;
                }
                // 更新显示状态
                if (this.formFieldsVisibility.hasOwnProperty(field)) {
                    this.formFieldsVisibility[field] = visible;
                }
                // 更新必填状态
                if (this.formFieldsRequired.hasOwnProperty(field)) {
                    this.formFieldsRequired[field] = required;
                }
                // 如果字段被隐藏，清空其值
                if (!visible && this.queryForm && this.queryForm.setFieldsValue) {
                    const resetValue = {};
                    resetValue[field] = '';
                    this.queryForm.setFieldsValue(resetValue);
                }
            },
            // 户口行政区划选择
            clickAac010() {
                this.openAreaSelector('ycc299');
            },
            // 户口行政区划选择（另一种调用方式）
            clickAac010Tow() {
                this.openAreaSelector('aab299');
            },
            // 检查就业日期不能大于就业登记日期
            fnCheckTime() {
                const ycc039 = this.queryForm.getFieldValue('ycc039');
                const aae043 = this.queryForm.getFieldValue('aae043');

                if (ycc039 && aae043) {
                    if (moment(ycc039).isAfter(moment(aae043))) {
                        this.$message.error('就业日期不能大于就业登记日期!');
                        this.queryForm.setFieldsValue({
                            ycc039: ''
                        });
                    }
                }
            },
            handleConfirm() {
                // 表单校验
                this.queryForm.validateFields((errors, values) => {
                    if (errors) {
                        return
                    }
                    // 获取表单数据
                    const formData = this.queryForm.getFieldsValue()

                    if (!formData) {
                        this.$message.error('表单数据获取失败')
                        return
                    }

                    // 获取当前日期作为经办日期
                    const currentDate = moment()

                    // 1. 验证就业登记日期不能晚于经办日期
                    if (formData.aae043) {
                        const registerDate = moment(formData.aae043)
                        // 添加isValid检查确保日期格式正确
                        if (!registerDate.isValid()) {
                            this.$message.error('就业登记日期格式不正确')
                            return
                        }

                        if (registerDate.isAfter(currentDate, 'day')) {
                            this.$message.error('就业登记日期不能晚于经办日期')
                            return
                        }
                    }
                    // 2. 验证就业日期不能晚于就业登记日期
                    if (formData.ycc039 && formData.aae043) {
                        const employmentDate = moment(formData.ycc039)
                        const registerDate = moment(formData.aae043)

                        // 添加isValid检查确保日期格式正确
                        if (!employmentDate.isValid()) {
                            this.$message.error('就业日期格式不正确')
                            return
                        }

                        if (employmentDate.isAfter(registerDate, 'day')) {
                            this.$message.error('就业日期不能晚于就业登记日期')
                            return
                        }
                    }
                    if (formData.ycc03r === '0') {
                        formData.aae031 = ''
                        formData.aae032 = ''
                    } else {
                        formData.aae031 = moment(formData.aae031).format('YYYY-MM-DD')
                        formData.aae032 = moment(formData.aae032).format('YYYY-MM-DD')
                    }
                    // 这里可以添加后续的提交逻辑
                    console.log('表单验证通过，可以提交数据', formData)
                    formData.aae043 = moment(formData.aae043).format('YYYY-MM-DD')
                    formData.yac01g = moment(formData.yac01g).format('YYYY-MM-DD')
                    formData.ycc039 = moment(formData.ycc039).format('YYYY-MM-DD')
                    formData.aae017 = formData.aae017.value
                    formData.ycc005 = this.ycc005Value
                    formData.aab301 = this.aab301Value
                    formData.aac001 = this.userInfo.ext03
                    formData.aae017DESC = this.aae017DESC
                    const fileList = this.$refs.materialUploadTable.check() || []
                    const yhc407 = formData.yhc407 || this.queryForm.getFieldValue('yhc407');
                    // 只有在特定就业形式下才强制要求上传材料，其他情况可以不上传
                    const needUploadFileTypes = ['21', '22', '29', '30'];
                    if (needUploadFileTypes.includes(yhc407) && fileList[0].files.length === 0) {
                        this.$message.error('请上传必要的材料');
                        return;
                    }
                    const param = {
                        no: '403-0016',
                        data: JSON.stringify({
                            ...formData,
                            fileList: JSON.stringify(fileList)
                        })
                    }
                    this.Base.sendRequest('', param, (res) => {
                        if (res.serviceSuccess && res.data.code === '1') {
                            this.$message.success(res.data.msg || '保存成功')
                            setTimeout(() => {
                                this.$router.go(-1)
                            }, 5000)
                        } else {
                            this.$message.error(res.data.msg || '保存失败')
                        }
                    }, (error) => {
                        // 添加失败回调，处理网络错误等情况
                        this.$message.error('网络异常，请稍后重试')
                        console.error('请求失败:', error)
                    })
                })
            },
        }
    }
</script>

<style scoped>
    .employment-record-add {
        width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .content-box {
        margin-top: 20px;
    }

    .sub-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        padding: 10px 0;
        background-color: #afd2f0;
        border-bottom: 2px solid #e8e8e8;
        margin-bottom: 20px;
    }

    .form-box {
        margin-bottom: 30px;
    }

    .modal-btn {
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-end;
    }

    .modal-btn .ta-button {
        margin-left: 10px;
    }

    .btn-box {
        display: flex;
        justify-content: space-around;

        .btn {
            cursor: pointer;
        }
    }

    .tips {
        color: red;
        font-size: 16px;
        font-weight: bold;
        margin-top: -33px;
    }

    /* 统一输入框和下拉框宽度，确保对齐 */
    .ta-form-item .ta-input,
    .ta-form-item .ta-select {
        width: 180px;
    }

    /* 针对特定长标签的输入框，保持一致的宽度 */
    .ta-form-item[label-width="220px"] .ta-input {
        width: 180px;
    }

    /* 行业分类样式 */
    .industry-main-category {
        font-weight: bold;
        color: #1890ff !important;
        /* 主类别使用蓝色 */
    }

    .industry-sub-category {
        color: #666 !important;
        /* 子类别使用灰色 */
    }

    /* 地址选择器样式 */
    .area-selector-wrapper {
        position: relative;
        display: inline-block;
        width: 300px;
    }

    .area-input {
        width: 100%;
        padding: 8px 30px 8px 12px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 14px;
        background-color: #fff;
        cursor: pointer;
    }

    .area-input:focus {
        outline: none;
        border-color: #40a9ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    .area-input:hover {
        border-color: #40a9ff;
    }

    .area-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
        pointer-events: none;
        font-size: 12px;
    }
</style>