<template>
    <view class="service-page" id="contrainer">


        <view class="service-box">
            <view class="form-page">
                <!-- 基本信息和申请信息 -->
                <view>
                    <view class="uform">
                        <u-form :model="infoForm" ref="infoForm" label-position="left">
                            <!-- 基本信息 -->
                            <view class="title-line-blue">
                                <view class="title">基本信息</view>
                            </view>
                            <u-form-item label="姓名" label-width="120">
                                <u-input v-model="infoForm.aac003" :border="false" placeholder="姓名" disabled />
                            </u-form-item>
                            <u-form-item label="身份证号" label-width="120">
                                <u-input v-model="infoForm.yac002" :border="false" placeholder="身份证号" disabled />
                            </u-form-item>
                            <u-form-item label="性别" label-width="120">
                                <mini-picker v-model="infoForm.aac004" :border="false" placeholder="性别" disabled
                                    collection="AAC004" />
                            </u-form-item>
                            <u-form-item label="民族" label-width="120">
                                <mini-picker v-model="infoForm.aac005" :border="false" placeholder="民族" disabled
                                    collection="AAC005" />
                            </u-form-item>
                            <u-form-item label="联系电话" label-width="120">
                                <u-input v-model="infoForm.aae005" :border="false" placeholder="联系电话" disabled />
                            </u-form-item>
                            <u-form-item label="发放方式" label-width="120">
                                <mini-picker v-model="infoForm.syy002" :border="false" placeholder="发放方式" disabled
                                    :range="payMethods" />
                            </u-form-item>
                            <u-form-item label="银行类别" label-width="120">
                                <u-input v-model="infoForm.yhk031" :border="false" placeholder="银行类别" disabled />
                            </u-form-item>
                            <u-form-item label="银行卡号" label-width="120">
                                <u-input v-model="infoForm.yhk030" :border="false" placeholder="银行卡号" disabled />
                            </u-form-item>
                            <u-form-item label="开户名称" label-width="120">
                                <u-input v-model="infoForm.yhk032" :border="false" placeholder="开户名称" disabled />
                            </u-form-item>
                            <u-form-item label="银联号" label-width="120">
                                <u-input v-model="infoForm.yhk033" :border="false" placeholder="银联号" disabled />
                            </u-form-item>
                            <u-form-item label="户籍号" label-width="120">
                                <u-input v-model="infoForm.alc083" :border="false" placeholder="户籍号" disabled />
                            </u-form-item>

                            <!-- 申请信息 -->
                            <view class="title-line-blue">
                                <view class="title">申请信息</view>
                            </view>
                            <u-form-item label="有无求职要求" label-width="120">
                                <mini-picker v-model="infoForm.dff005" :border="false" placeholder="有无求职要求" disabled
                                    collection="YESORNO" />
                            </u-form-item>
                            <u-form-item label="求职要求" label-width="120">
                                <mini-picker v-model="infoForm.dff006" :border="false" placeholder="求职要求" disabled
                                    collection="YESORNO" />
                            </u-form-item>
                            <u-form-item label="是否进行求职登记" label-width="120">
                                <mini-picker v-model="infoForm.dff007" :border="false" placeholder="是否进行求职登记" disabled
                                    collection="YESORNO" />
                            </u-form-item>
                            <u-form-item label="是否领取养老保险" label-width="120">
                                <mini-picker v-model="infoForm.ylbx" :border="false" placeholder="是否领取养老保险" disabled
                                    collection="YESORNO" />
                            </u-form-item>
                            <u-form-item label="停保原因" label-width="120">
                                <mini-picker v-model="infoForm.aae160" :border="false" placeholder="停保原因" disabled
                                    collection="STOPCAUSE" />
                            </u-form-item>
                            <u-form-item label="缴费月数" label-width="120">
                                <u-input v-model="infoForm.dff001" :border="false" placeholder="缴费月数" disabled />
                            </u-form-item>
                            <u-form-item label="参保起止时间" label-width="120">
                                <u-input v-model="infoForm.aae003_s" :border="false" placeholder="参保起止时间" disabled />
                            </u-form-item>
                            <u-form-item label="参保截止时间" label-width="120">
                                <u-input v-model="infoForm.aae003_e" :border="false" placeholder="参保截止时间" disabled />
                            </u-form-item>
                            <u-form-item label="是否领金后不足一年" label-width="120">
                                <mini-picker v-model="infoForm.bzyntxry" :border="false" placeholder="是否领金后不足一年"
                                    disabled collection="YESORNO" />
                            </u-form-item>
                            <u-form-item label="退休时间" label-width="120">
                                <u-input v-model="infoForm.txshij" :border="false" placeholder="退休时间" disabled />
                            </u-form-item>

                            <u-form-item label="领金后距离退休月数" label-width="120">
                                <u-input v-model="infoForm.betweens" :border="false" placeholder="本次每月拟发放失业保险金金额"
                                    disabled />
                            </u-form-item>
                            <u-form-item label="可享受月数" label-width="120">
                                <u-input v-model="infoForm.ajc097" :border="false" placeholder="可享受月数" disabled />
                            </u-form-item>
                            <u-form-item label="本次失业保险金待遇开始日期" label-width="120">
                                <u-input v-model="infoForm.aae030" :border="false" placeholder="本次失业保险金待遇开始日期"
                                    disabled />
                            </u-form-item>
                            <u-form-item label="本次失业保险金待遇终止日期" label-width="120">
                                <u-input v-model="infoForm.ajc106" :border="false" placeholder="本次失业保险金待遇终止日期"
                                    disabled />
                            </u-form-item>
                            <u-form-item label="是否申请人工核算" label-width="120">
                                <mini-picker v-model="infoForm.mac291" :border="false" placeholder="是否申请人工核算" disabled
                                    collection="YESORNO" />
                            </u-form-item>
                            <u-form-item label="参保状态" label-width="120">
                                <mini-picker v-model="infoForm.aac031" :border="false" placeholder="参保状态" disabled
                                    :range="aac031Range" />
                            </u-form-item>
                            <u-form-item label="本次每月拟发放失业保险金金额" label-width="120">
                                <u-input v-model="infoForm.ajc151" :border="false" placeholder="本次每月拟发放失业保险金金额"
                                    disabled />
                            </u-form-item>
                            <u-form-item label="转移月数" label-width="120">
                                <u-input v-model="infoForm.syy052" :border="false" placeholder="转移月数" disabled />
                            </u-form-item>
                            <u-form-item label="失业时间" label-width="120">
                                <u-input v-model="infoForm.dff002" :border="false" placeholder="失业时间" disabled />
                            </u-form-item>
                            <u-form-item label="未计发待遇的累计缴费月数" label-width="120">
                                <u-input v-model="infoForm.ajc092" :border="false" placeholder="未计发待遇的累计缴费月数"
                                    disabled />
                            </u-form-item>
                            <u-form-item label="是否发放" label-width="120">
                                <mini-picker v-model="infoForm.alc076" :border="false" placeholder="是否发放" disabled
                                    collection="YESORNO" />
                            </u-form-item>
                            <u-form-item label="待遇发放情况反馈" label-width="120">
                                <mini-picker v-model="infoForm.ffk221" :border="false" placeholder="是否发放" disabled
                                    collection="YESORNO" />
                            </u-form-item>

                            <!-- 缴费信息 -->
                            <view class="title-line-blue">
                                <view class="title">失业保险缴费信息</view>
                            </view>
                            <scroll-view scroll-y="true" scroll-x="true" style="height: 300rpx; white-space: nowrap;">
                                <view class="table-container">
                                    <view class="table-header">
                                        <view class="table-col">缴费险种</view>
                                        <view class="table-col">缴费年度</view>
                                        <view class="table-col">缴费所属期</view>
                                        <view class="table-col">对应缴费所属期</view>
                                        <view class="table-col">单位缴费</view>
                                        <view class="table-col">个人缴费</view>
                                        <view class="table-col">身份证号</view>
                                        <view class="table-col">经办时间</view>
                                        <view class="table-col">单位名称</view>
                                    </view>
                                    <view class="table-body">
                                        <view v-for="(item, index) in jfData" :key="index" class="table-row">
                                            <view class="table-col">{{item.syy001 || '-'}}</view>
                                            <view class="table-col">{{item.wjj001 || '-'}}</view>
                                            <view class="table-col">{{item.wjj002 || '-'}}</view>
                                            <view class="table-col">{{item.wjj003 || '-'}}</view>
                                            <view class="table-col">{{item.wjj001fileid || '-'}}</view>
                                            <view class="table-col">{{item.isswtich || '-'}}</view>
                                            <view class="table-col">{{item.yac002 || '-'}}</view>
                                            <view class="table-col">{{item.aae036 || '-'}}</view>
                                            <view class="table-col">{{item.aab004 || '-'}}</view>
                                        </view>
                                        <view v-if="jfData.length === 0" class="table-row empty-row">
                                            <view class="table-col" style="width: 1620rpx; text-align: center;">暂无缴费记录
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </scroll-view>
                            <view class="title-line-blue">
                                <view class="title">经办人信息</view>
                            </view>
                            <u-form-item label="缴费月数" label-width="120">
                                <u-input v-model="infoForm.aae011" :border="false" placeholder="【经办】创建人姓名" disabled />
                            </u-form-item>
                            <u-form-item label="缴费月数" label-width="120">
                                <mini-picker v-model="infoForm.aae017" :border="false" placeholder="【经办】创建机构" disabled
                                    collection="AAE017" />
                            </u-form-item>
                            <u-form-item label="缴费月数" label-width="120">
                                <u-input v-model="infoForm.aae036" :border="false" placeholder="【经办】创建日期" disabled />
                            </u-form-item>


                        </u-form>
                    </view>
                </view>


            </view>
            <view class="btn-box">
                <u-button type="primary" @click="handleBack">返回</u-button>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'unemploymentInsuranceAddDetail',
        components: {

        },
        data() {
            return {
                // 表单数据
                infoForm: {
                    syy001: '', // 失业申请编号
                    aac001: '', // 个人编号
                    aac003: '', // 姓名
                    yac002: '', // 身份证号
                    aac004: '', // 性别
                    aac005: '', // 民族
                    aae005: '', // 联系电话
                    syy002: '', // 发放方式
                    yhk031: '', // 银行类别
                    yhk030: '', // 银行卡号
                    yhk032: '', // 开户名称
                    yhk033: '', // 银联号
                    alc083: '', // 户籍号
                    dff002: '', // 失业时间
                    cause: '', // 停保原因
                    dff005: '', // 有无求职要求
                    dff006: '', // 求职要求
                    aae003_s: '', // 参保起止时间
                    aae003_e: '', // 参保截止时间
                    dff007: '', // 是否进行求职登记
                    ajc151: '', // 本次每月拟发放失业保险金金额
                    dff001: '', // 缴费月数
                    zymsys: '', // 可享受月数
                    ajc097: '', // 转移月数
                    aae017: '', // 社保缴纳地
                    aae011: '', // 经办人姓名
                    aae036: '', // 经办日期
                    ylbx: '', // 是否领取养老保险
                    aae160: '', // 停保原因
                    bzyntxry: '', // 是否领金后不足一年
                    txshij: '', // 退休时间
                    betweens: '', // 领金后距离退休月数
                    aae030: '', // 本次失业保险金待遇开始日期
                    ajc106: '', // 本次失业保险金待遇终止日期
                    mac291: '', // 是否申请人工核算
                    aac031: '', // 参保状态
                    syy052: '', // 转移月数
                    ajc092: '', // 未计发待遇的累计缴费月数
                    alc076: '', // 是否发放
                    ffk221: '' // 待遇发放情况反馈
                },
                // 缴费数据
                jfData: [],
                // 路由参数
                routeParams: {
                    yac002: '',
                    syy001: ''
                },
                payMethods: [{
                        value: '1',
                        label: '社保卡'
                    },
                    {
                        value: '2',
                        label: '银行卡'
                    }
                ],
                aac031Range: [{
                        value: '0',
                        label: '暂停参保'
                    },
                    {
                        value: '1',
                        label: '在职参保'
                    }
                ],
            }
        },
        onLoad(options) {
            console.log('options: ', options);
            if (options.params) {
                try {
                    this.routeParams = JSON.parse(decodeURIComponent(options.params));
                    console.log('获取到的路由参数:', this.routeParams);
                    // 初始化数据
                    this.init();
                } catch (error) {
                    console.error('解析参数失败:', error);
                    this.$message.error('参数解析失败');
                }
            } else {
                this.$message.error('缺少必要参数');
            }
        },
        onShow() {
            this.$nextTick(() => {
                this.setHeight()
            })
        },
        onReady() {
            this.$nextTick(() => {
                this.setHeight()
            });
        },
        methods: {
            // 初始化数据
            init() {
                const param = {
                    no: '207-0029',
                    data: JSON.stringify({
                        yac002: this.routeParams.yac002,
                        syy001: this.routeParams.syy001,
                    }),
                }
                this.$base.post('', param, (res) => {
                    if (res.serviceSuccess) {
                        this.$message.success('详情数据获取成功')
                        this.infoForm = res.data.applyInfo || {}
                        this.jfData = res.data.dataList || []
                      
                    } 
                }, (error) => {
                    this.$message.error('获取详情数据失败，请重试');
                    console.error('获取详情数据失败:', error);
                })
            },
            // 返回上一页
            handleBack() {
                uni.navigateBack();
            },

            // 设置高度
            setHeight() {
                const query = uni.createSelectorQuery().in(this)
                query.select('#contrainer').boundingClientRect(data => {
                    if (data) {
                        this.componentHeight = data.height
                        if (typeof terminalUtil !== 'undefined' && terminalUtil._setIframeHeight) {
                            terminalUtil._setIframeHeight(data.height)
                        }
                    }
                }).exec()
            }
        }
    }
</script>

<style scoped>
    .service-page {
        padding: 20rpx;
    }

    .title-line-blue {
        height: 80rpx;
        background-color: #e6f4ff;
        border-left: 8rpx solid #1890ff;
        display: flex;
        align-items: center;
        padding-left: 24rpx;
        margin-bottom: 30rpx;
        margin-top: 40rpx;
    }

    .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
    }

    .btn-box {
        margin-top: 60rpx;
        margin-bottom: 40rpx;
        display: flex;
        justify-content: center;
    }

    .table-container {
        width: 100%;
        border: 1rpx solid #e8e8e8;
        margin-bottom: 40rpx;
    }

    .table-header,
    .table-row {
        display: flex;
        flex-wrap: nowrap;
    }

    .table-col {
        flex-shrink: 0;
        width: 180rpx;
        padding: 10rpx 5rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        border: 1rpx solid #e5e5e5;
        font-size: 28rpx;
    }

    .table-header .table-col {
        background-color: #f5f5f5;
        font-weight: bold;
    }

    .table-row:nth-child(even) {
        background-color: #fafafa;
    }

    .empty-row {
        height: 80rpx;
        align-items: center;
        background-color: #fafafa !important;
    }

    /* 按钮样式优化 */
    .u-button {
        min-width: 240rpx !important;
        height: 92rpx !important;
        font-size: 32rpx !important;
        border-radius: 46rpx !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    }

    .u-button:hover:not(:disabled) {
        transform: translateY(-2rpx) scale(1.02);
        box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.15);
    }

    .u-button--primary {
        background-color: #1890ff;
        border-color: #1890ff;
    }

    .u-button--primary:hover:not(:disabled) {
        background-color: #40a9ff !important;
        border-color: #40a9ff !important;
    }

    /* 输入框禁用样式优化 */
    .u-input[disabled] {
        background-color: #f5f5f5 !important;
        color: #999 !important;
        border-radius: 8rpx;
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
        .service-page {
            padding: 10rpx;
        }

        .title-line-blue {
            height: 70rpx;
            margin-bottom: 20rpx;
            margin-top: 30rpx;
            padding-left: 20rpx;
        }

        .title {
            font-size: 28rpx;
        }

        .u-form-item {
            padding: 20rpx 0;
        }

        .btn-box {
            margin-top: 40rpx;
            margin-bottom: 30rpx;
        }

        .table-col {
            width: 160rpx;
            font-size: 26rpx;
            padding: 8rpx 3rpx;
        }
    }
</style>