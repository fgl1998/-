<template>
    <view class="service-page" id="contrainer">
        <view class="service-box">
            <view class="form-page">
                <!-- 基本信息 -->
                <view>
                    <view class="uform">
                        <u-form :model="infoForm" ref="infoForm" label-position="left">
                            <!-- 基本信息 -->
                            <view class="title-line-blue">
                                <view class="title">基本信息</view>
                            </view>
                            <u-form-item label="核定信息" label-width="120">
                                <mini-picker v-model="infoForm.hdxx" :range="hdxxOptions" @change="handleChangeHdxx">
                                </mini-picker>
                            </u-form-item>
                            <u-form-item label="月核定金额" label-width="120">
                                <u-input v-model="infoForm.aae019" :border="false" placeholder="月核定金额" disabled />
                            </u-form-item>
                            <u-form-item label="待遇享受开始时间" label-width="120">
                                <u-input v-model="infoForm.yac604" :border="false" placeholder="待遇享受开始时间" disabled />
                            </u-form-item>
                            <u-form-item label="待遇享受截止时间" label-width="120">
                                <u-input v-model="infoForm.yac605" :border="false" placeholder="待遇享受截止时间" disabled />
                            </u-form-item>
                            <u-form-item label="应享受月数" label-width="120">
                                <u-input v-model="infoForm.yac606" :border="false" placeholder="应享受月数" disabled />
                            </u-form-item>
                            <u-form-item label="已享受月数" label-width="120">
                                <u-input v-model="infoForm.yac607" :border="false" placeholder="已享受月数" disabled />
                            </u-form-item>
                            <u-form-item label="剩余享受月数" label-width="120">
                                <u-input v-model="infoForm.yac608" :border="false" placeholder="剩余享受月数" disabled />
                            </u-form-item>


                        </u-form>
                    </view>
                </view>
            </view>

            <!-- 发放明细 -->
            <view class="title-line-blue">
                <view class="title">发放明细</view>
            </view>
            <scroll-view scroll-y="true" scroll-x="true" style="height: 400rpx; white-space: nowrap; display: block;">
                <view class="table-container" style="min-width: 100%;">
                    <view class="table-header">
                        <view class="table-col">姓名</view>
                        <view class="table-col">费款所属期</view>
                        <view class="table-col">对应费款所属期</view>
                        <view class="table-col">补贴金额</view>
                        <view class="table-col">支付标志</view>
                        <view class="table-col">拨付方式</view>
                        <view class="table-col">支付结果</view>
                        <view class="table-col">支付说明</view>
                        <view class="table-col">银行卡号</view>
                        <view class="table-col">经办时间</view>
                    </view>
                    <view class="table-body">
                        <view v-for="(item, index) in ffxxTableData" :key="index" class="table-row">
                            <view class="table-col">{{item.aac003 || '-'}}</view>
                            <view class="table-col">{{item.aae002 || '-'}}</view>
                            <view class="table-col">{{item.aae003 || '-'}}</view>
                            <view class="table-col">{{item.aae019 || '-'}}</view>
                            <view class="table-col">{{item.aae117 || '-'}}</view>
                            <view class="table-col">{{item.aaa079 || '-'}}</view>
                            <view class="table-col">{{item.yac821 || '-'}}</view>
                            <view class="table-col">{{item.yac822 || '-'}}</view>
                            <view class="table-col">{{item.yhk032 || '-'}}</view>
                            <view class="table-col">{{item.aae036 || '-'}}</view>
                        </view>
                        <view v-if="ffxxTableData.length === 0" class="table-row empty-row">
                            <view class="table-col" style="width: 1680rpx; text-align: center;">暂无发放明细记录</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <view class="btn-box">
                <u-button type="primary" @click="handleBack">返回</u-button>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'unemploymentInsuranceAddFfxx',
        components: {

        },
        data() {
            return {
                // 表单数据
                infoForm: {
                    hdxx: '', // 核定信息
                    aae019: '', // 月核定金额
                    yac604: '', // 待遇享受开始时间
                    yac605: '', // 待遇享受截止时间
                    yac606: '', // 应享受月数
                    yac607: '', // 已享受月数
                    yac608: '' // 剩余享受月数
                },
                // 核定信息选项
                hdxxOptions: [],
                // 发放明细数据
                ffxxTableData: [],
                // 路由参数
                routeParams: {
                    yac002: '',
                    syy001: ''
                }
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
                // 直接调用getHdxxOptions方法获取核定信息
                this.getHdxxOptions();
            },
            
            // 获取核定信息选项
            getHdxxOptions() {
                const param = {
                    no: '207-0032',
                    data: JSON.stringify({
                        yac002: this.routeParams.yac002
                    }),
                }
                this.$base.post('', param, (res) => {
                    if (res && res.serviceSuccess) {
                        const arr = res.data
                        // 处理数据为空的情况
                        if (!arr || arr.length === 0) {
                            this.$message.info('暂无核定信息数据')
                            this.hdxxOptions = [{ label: '暂无数据', value: '' }]
                            return
                        }
                        try {
                            this.hdxxOptions = arr.map(item => ({
                                label: item.name || '未命名',
                                value: item.id || ''
                            }))
                            // 如果有数据，设置默认选中第一个选项
                            if (this.hdxxOptions.length > 0 && this.hdxxOptions[0].value) {
                                this.infoForm.hdxx = this.hdxxOptions[0].value
                                // 默认加载第一个核定信息的详情
                                this.getFfxxDetail(this.hdxxOptions[0].value)
                            }
                        } catch (error) {
                            console.error('数据处理错误:', error)
                            this.$message.error('数据格式异常，请联系管理员')
                            this.hdxxOptions = [{ label: '数据异常', value: '' }]
                        }
                    } else {
                        this.$message.error(res.msg || '接口查询失败！')
                        // 错误时提供默认选项
                        this.hdxxOptions = [{ label: '查询失败', value: '' }]
                    }
                })
            },

            // 获取发放流程详情
            getFfxxDetail(yac600) {
                const param = {
                    no: '207-0033',
                    data: JSON.stringify({
                        yac002: this.routeParams.yac002,
                        yac600: yac600 || this.infoForm.hdxx
                    }),
                }
                this.$base.post('', param, (res) => {
                    if (res.serviceSuccess) {
                        const formData = res.data.info || {}
                        this.infoForm = { ...this.infoForm, ...formData }
                        const listData = res.data.list || []
                        this.ffxxTableData = listData
                        this.$message.success('发放流程信息获取成功')
                    } else {
                        this.$message.error(res.msg || '接口查询失败！')
                    }
                }, (error) => {
                    this.$message.error('获取发放流程信息失败，请重试')
                    console.error('获取发放流程信息失败:', error)
                })
            },

            // 处理核定信息变化
            handleChangeHdxx(e) {
                this.infoForm.hdxx = e.value
                // 根据选定的核定信息重新加载发放明细
                if (e.value) {
                    this.getFfxxDetail(e.value)
                }
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

    /* 表格样式优化 */
    .table-container {
        width: auto;
        min-width: 100%;
        border: 1rpx solid #e8e8e8;
        margin-bottom: 40rpx;
        border-radius: 8rpx;
        overflow: visible;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    }

    /* 确保表格行不换行 */
    .table-header, .table-row {
        display: inline-flex;
        flex-wrap: nowrap;
        align-items: center;
        height: 90rpx;
        transition: background-color 0.2s ease;
    }

    /* 确保scroll-view能够正确滚动 */
    scroll-view {
        white-space: nowrap;
        width: 100%;
    }

    /* 确保空数据行正确显示 */
    .empty-row .table-col {
        width: 1680rpx !important;
        color: #999;
        font-size: 30rpx;
        font-style: italic;
        background-color: #fafafa;
    }

    /* 优化表格列宽，根据内容重要性分配宽度 */
    .table-col {
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        border: 1rpx solid #e5e5e5;
        font-size: 28rpx;
        padding: 10rpx 8rpx;
        line-height: 1.4;
    }

    /* 根据内容调整列宽 */
    .table-col:nth-child(1), /* 姓名 */
    .table-col:nth-child(2), /* 费款所属期 */
    .table-col:nth-child(3), /* 对应费款所属期 */
    .table-col:nth-child(6), /* 拨付方式 */
    .table-col:nth-child(9) { /* 银行卡号 */
        width: 200rpx;
    }
    
    .table-col:nth-child(4), /* 补贴金额 */
    .table-col:nth-child(5), /* 支付标志 */
    .table-col:nth-child(7), /* 支付结果 */
    .table-col:nth-child(10) { /* 经办时间 */
        width: 160rpx;
    }
    
    .table-col:nth-child(8) { /* 支付说明 */
        width: 240rpx;
    }

    /* 增强标题行样式 */
    .table-header {
        background: linear-gradient(90deg, #f0f9ff 0%, #e6f4ff 100%);
        font-weight: bold;
        color: #1890ff;
        border-bottom: 2rpx solid #91d5ff;
    }

    .table-header .table-col {
        font-weight: 600;
        background-color: transparent;
    }

    /* 表格行样式优化 */
    .table-row {
        background-color: #ffffff;
    }

    .table-row:nth-child(even) {
        background-color: #fafafa;
    }

    .table-row:hover {
        background-color: #f6ffed !important;
    }

    /* 空数据状态优化 */
    .empty-row {
        height: 120rpx;
        align-items: center;
        background-color: #fafafa !important;
    }

    .empty-row .table-col {
        color: #999;
        font-size: 30rpx;
        font-style: italic;
        background-color: #fafafa;
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

        /* 移动端表格优化 */
        .table-header, .table-row {
            height: 80rpx;
        }

        /* 缩小移动端各列宽度 */
        .table-col {
            font-size: 26rpx;
            padding: 8rpx 4rpx;
        }

        .table-col:nth-child(1),
        .table-col:nth-child(2),
        .table-col:nth-child(3),
        .table-col:nth-child(6),
        .table-col:nth-child(9) {
            width: 180rpx;
        }
        
        .table-col:nth-child(4),
        .table-col:nth-child(5),
        .table-col:nth-child(7),
        .table-col:nth-child(10) {
            width: 140rpx;
        }
        
        .table-col:nth-child(8) {
            width: 200rpx;
        }
    }
</style>


