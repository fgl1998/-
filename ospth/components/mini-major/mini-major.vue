<template>
    <!-- 
        专业查询组件
     -->
    <view class="mini-major">
        <view class="cell-content" @click="showPop">
            <mini-cell className="cell-li" required :title='label' :value="defaultValue ? defaultValue : '请选择'"></mini-cell>
        </view>
        <mini-popup :isShowPopup="isShowPopup" :maskCloseable="maskCloseable" @clickMask="clickMask">
            <view class="major-choose">
                <view class="toolbar">
                    <view @click="handleConcel" class="cancel-btn">取消</view>
                    <view @click="handleConfirm" class="confirm-btn">确定</view>
                </view>
                <view class="tabs" :class="majorCurrent != 0 ? 'tabs-active' : ''">
                    <i class="icon icon-arrow-right"></i>
                    <text @click="handleFloorBack">返回上一级↑</text>
                </view>
                <scroll-view class="tab-content" scroll-y="true">
                    <ul>
                        <block v-for="(item,index) in majorArr" :key="index">
                            <li @click.stop="handleMajor(item,index)" :class="item.selected&&isLast?'active':''">
                                <text>{{item.label}}</text>
                                <i class="r-icon" v-show="item.selected&&isLast">✔</i>
                            </li>
                        </block>
                    </ul>
                </scroll-view>
            </view>
        </mini-popup>
    </view>
</template>

<script>
    export default {
        name: 'mini-major',
        props: {
            label: {
                type: String,
                default: '所学专业'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: false
            },
            defaultValue: {
                type: String,
                default: '请选择'
            }
        },
        data() {
            return {
                isShowPopup: false,
                maskCloseable: true,
                majorArr:[],
                majorCurrent: 0, // 专业当前级数
                majorFloor: {}, // 暂存对象
                isLast: false, // 是否为最后一级
                chooseObj: {}, // 选择对象
            };
        },
        created() {
    
        },
        mounted() {
            this.init()
        },
        methods: {
            // 点击灰色遮罩层
            clickMask(e) {
                this.isShowPopup = e;
            },
            showPop () {
                if(this.disabled){
                    return
                }
                this.isShowPopup = true
            },
            // 取消
            handleConcel() {
                this.isShowPopup = false
            },
            // 确认按钮
            handleConfirm() {
                if(!this.chooseObj.value){
                    this.$toast('请继续选择！')
                    return
                }
                this.$emit('majorChange',this.chooseObj)
                this.isShowPopup = false
            },
            init () {
                this.searchMajor()
                // 其他需要初始化的方法
            },
            // 根据具体查询
            searchMajor (_item={}) {
				let param ={
					serverNum: 'jy006_com09',
					apiCode: "jy006_com09",
					aca130: _item.value ? _item.value : '', // 查小专业，可不传
				}
                this.$base.post('/business/getData.do',param, data=> {
                    if(data.serviceSuccess){
                        if(data.resultData.data.serviceSuccess){
                            let resArr = data.resultData.data.data.result
                            // 查下级 如果没有数据
                            if(!resArr.length){
                                // this.$message.error('当前为最后一级')
                                this.isLast = true
                                this.chooseObj = _item
                                return
                            }
                            // 加选中属性
                            resArr.forEach((item,index) => {
                                item['selected'] = false
                            })
                            this.majorArr = [...resArr]
                            // 第一次查询 不加
                            _item.value ? this.majorCurrent++ : ''
                            // 存每一级的数据
                            this.majorFloor['major_'+this.majorCurrent] = [...resArr]
                        }else{
                            this.$message.error('专业查询出错！')
                        }
                    }else{
                        // this.$message.error('专业查询出错：'+res.message)
                    }
                })
            },
            handleMajor (_item,_index){
                this.majorArr.forEach((item,index) => {
                    index == _index ? item['selected'] = true : item['selected'] = false
                })
                this.$forceUpdate()
                this.searchMajor(_item)
            },
            // 专业查询返回上一级
            handleFloorBack () {
                this.isLast = false
                this.chooseObj = {}
                if(this.majorCurrent == 0){
                    this.$toast('当前为第一级')
                    return
                }
                this.majorCurrent--
                this.majorArr = this.majorFloor['major_'+this.majorCurrent]
            }
        },
    };
</script>

<style scoped lang="scss">
    .major-choose{
        width: 100%;
        height: 800rpx;
        background: white;
    }
    .toolbar{
        height: 100rpx;
        line-height: 54rpx;
        padding: 23rpx 30rpx 13rpx 30rpx;
        display: flex;
        justify-content: space-between;
        view{
            display: inline-block;
            width: 140rpx;
            text-align: center;
            line-height: 54rpx;
            border: 1px solid #3B93F7;
            border-radius: 6rpx;
            color: white;
            background: #3B93F7;
            font-size: 28rpx;
        }
        .cancel-btn{
            
        }
        .confirm-btn{
            
        }
    }
    .tabs{
        height: 100rpx;
        line-height: 90rpx;
        text-align: left;
        padding: 0 30rpx;
        color: #666666;
        border-bottom: 1px solid whitesmoke;
    }
    .tabs-active{
        color: #3B93F7;
    }
    .tab-content{
        height: calc(100% - 180rpx);
        ul{
            padding-bottom: 80rpx;
        }
        li{
            line-height: 80rpx;
            color: #666666;
            font-size: 28rpx;
            padding: 0 30rpx;
            border-bottom: 1px solid whitesmoke;
        }
        .active{
            color: #3B93F7;
        }
        .r-icon{
            font-size: 28rpx;
            color: #3B93F7;
            float: right;
        }
    }
</style>
