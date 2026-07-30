<template>
    <view class="service-page" id="contrainer">
        <view class="service-box">
            <view class="form-page">
                <!-- 领取待遇基本信息 -->
                <view class="title-line-blue">
                    <view class="title">领取待遇基本信息</view>
                </view>
                <view class="uform">
                    <u-form :model="formData" ref="formData" label-position="left">
                        <view class="form-box">
                            <u-form-item label="失业申请编号" label-width="120" v-show="false">
                                <u-input v-model="formData.syy001" :border="false" placeholder="失业申请编号" disabled  />
                            </u-form-item>
                            <u-form-item label="领取月数" label-width="120">
                                <u-input v-model="formData.ajc097" :border="false" placeholder="领取月数" disabled />
                            </u-form-item>
                            <u-form-item label="月领取金额" label-width="120">
                                <u-input v-model="formData.ajc151" :border="false" placeholder="月领取金额" disabled />
                            </u-form-item>
                            <u-form-item label="领取总金额" label-width="120">
                                <u-input v-model="formData.yhk034" :border="false" placeholder="领取总金额" disabled />
                            </u-form-item>
                        </view>
                    </u-form>
                </view>

                <!-- 业务审核信息 -->
                <view class="title-line-blue">
                    <view class="title">业务审核信息</view>
                </view>
                <scroll-view scroll-y="true" scroll-x="true" style="height: 300rpx; white-space: nowrap; margin-bottom: 20rpx;" class="table-scroll-view">
                    <view class="table-container">
                        <view class="table-header">
                            <view class="table-col col-name">名称</view>
                            <view class="table-col col-level">审核级别</view>
                            <view class="table-col col-person">审核人</view>
                            <view class="table-col col-status">审核状态</view>
                            <view class="table-col col-opinion">审核意见</view>
                            <view class="table-col col-time">审核时间</view>
                        </view>
                        <view class="table-body">
                            <view v-for="(item, index) in ywshTableData" :key="index" class="table-row">
                                <view class="table-col col-name">{{item.yap200s || '-'}}</view>
                                <view class="table-col col-level">{{item.yap205s || '-'}}</view>
                                <view class="table-col col-person">{{item.yap201s || '-'}}</view>
                                <view class="table-col col-status">{{item.yap202s || '-'}}</view>
                                <view class="table-col col-opinion">{{item.yap203s || '-'}}</view>
                                <view class="table-col col-time">{{item.yap204s || '-'}}</view>
                            </view>
                            <view v-if="ywshTableData.length === 0" class="table-row empty-row">
                                <view class="table-col empty-col" style="width: 100%; text-align: center;">暂无审核记录</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <view class="btn-box">
                <u-button type="primary" @click="handleBack">返回</u-button>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'unemploymentInsuranceCheckfflc',
        components: {},
        data() {
            return {
                // 表单数据
                formData: {
                    syy001: '', // 失业申请编号
                    ajc097: '', // 领取月数
                    ajc151: '', // 月领取金额
                    yhk034: '', // 领取总金额
                    aae017: '', // 登记失业地
                    aac013: '', // 户籍地址
                    aac011: '', // 现居住地
                    aae160: '', // 失业原因
                    aac062: '', // 文化程度
                    aac066: '', // 政治面貌
                    alc083: '', // 就业失业登记证号
                    alc084: '' // 发证日期
                },
                // 业务审核表格数据
                ywshTableData: [],
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
                const param = {
                    no: '207-0030',
                    data: JSON.stringify({
                        aac001: this.routeParams.aac001,
                        syy001: this.routeParams.syy001,
                    }),
                }
                this.$base.post('', param, (res) => {
                    if (res.serviceSuccess) {
                        this.$message.success('详情数据获取成功')
                        this.formData = res.data.applyInfo || {}
                        this.ywshTableData = res.data.auditList || []
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

    .form-box {
        margin-bottom: 20rpx;
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

    /* 表格样式优化 */
    .table-scroll-view {
        border: 1rpx solid #e8e8e8;
        border-radius: 12rpx;
        overflow: hidden;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
    }
    
    .table-container {
        width: 100%;
        min-width: 960rpx;
    }
    
    .table-header {
        background: linear-gradient(135deg, #f0f9ff 0%, #e6f4ff 100%);
        font-weight: 600;
        color: #262626;
        position: sticky;
        top: 0;
        z-index: 10;
    }
    
    .table-row {
        display: flex;
        flex-wrap: nowrap;
        border-bottom: 1rpx solid #f0f0f0;
        transition: background-color 0.2s ease;
    }
    
    .table-row:last-child {
        border-bottom: none;
    }
    
    .table-row:nth-child(even):not(.empty-row) {
        background-color: #fafafa;
    }
    
    .table-row:hover:not(.empty-row) {
        background-color: #f5f5f5 !important;
    }
    
    .table-col {
        flex-shrink: 0;
        padding: 24rpx 16rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        font-size: 28rpx;
        line-height: 1.4;
        border-right: 1rpx solid #f0f0f0;
    }
    
    .table-col:last-child {
        border-right: none;
    }
    
    /* 列宽优化 */
    .col-name {
        width: 140rpx;
    }
    
    .col-level {
        width: 120rpx;
    }
    
    .col-person {
        width: 120rpx;
    }
    
    .col-status {
        width: 120rpx;
        color: #1890ff;
    }
    
    .col-opinion {
        width: 220rpx;
    }
    
    .col-time {
        width: 160rpx;
    }
    
    /* 空状态优化 */
    .empty-row {
        height: 160rpx;
        align-items: center;
        background-color: #fafafa !important;
    }
    
    .empty-col {
        color: #8c8c8c;
        font-size: 28rpx;
        padding: 0;
        font-style: italic;
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
            padding: 20rpx 12rpx;
            font-size: 26rpx;
        }
        
        .col-name {
            width: 130rpx;
        }
        
        .col-level,
        .col-person,
        .col-status {
            width: 110rpx;
        }
        
        .col-opinion {
            width: 200rpx;
        }
        
        .col-time {
            width: 150rpx;
        }
    }
</style>