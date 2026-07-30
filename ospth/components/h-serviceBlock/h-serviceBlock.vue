<template>
	<view class="service_block">
		<view v-if="isShowBlock && serviceData.length > 0" v-for="(sdim, index) in serviceList" :key="sdim.sdimItemId">
			<view class="service_body" v-if="sdim.services.length > 0">
				<view v-for="(item, index) in sdim.services" :key="item.serviceId" class="work_item"
					@click="clickServiceItem(item)">
					<view class="item_icon">
						<image class="icon_img" :src="imageSrc+'/static/newImages/work/'+  item.icon  +'.png'" mode="">
						</image>
						<view v-if="isCurSet" @click.stop="addItem(item)" class="handle_icon add_icon"></view>
					</view>
					<view class="item_text">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view v-if="isShowBlock && serviceData.length == 0">
			<view class="service_body">
				<view class="waiting-block">
					<view class="wait-pic"></view>
					<view style="margin-top: 10rpx;">{{status}}</view>
				</view>
			</view>
		</view>
		<view v-if="!isShowBlock">
			<view class="service_body">
				<view class="waiting-block" v-if="serviceData.length === 0">
					<view class="wait-pic"></view>
					<view style="margin-top: 10rpx;">{{status}}</view>
				</view>
				<view v-for="(item, index) in serviceData" :key="index" class="work_item"
					@click="clickServiceItem(item)" v-else>
					<view class="item_icon">
						<image class="icon_img" :src="imageSrc+'/static/newImages/work/'+  item.icon  +'.png'" mode="">
						</image>
						<view v-if="isCurSet" @click.stop="addItem(item)" class="handle_icon add_icon"></view>
					</view>
					<view class="item_text">{{ item.name }}</view>
				</view>
			</view>
		</view>

		<!-- <view class="block_title">
            <view class="title_style"></view>
            <view class="title_text">{{ title }}</view>
        </view>
        <view class="service_body">
			<view class="waiting-block" v-if="serviceData.length === 0">
				<view class="wait-pic"></view>
				<view style="margin-top: 10rpx;">{{status}}</view>
			</view>
            <view v-for="(item, index) in serviceData" :key="index" class="work_item" @click="clickServiceItem(item)" v-else>
                <view class="item_icon">
                    <image class="icon_img" :src="imageSrc+'/static/newImages/work/'+  item.icon  +'.png'" mode=""></image>
                    <view v-if="isCurSet" @click.stop="addItem(item)" class="handle_icon add_icon"></view>
                </view>
                <view class="item_text">{{ item.name }}</view> 
            </view>
        </view> -->
		<!-- <view v-if="serviceData.length==0" style="padding:50rpx 0 80rpx 0;"></view> -->
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			serviceData: {
				type: Array,
				default: () => {
					return []
				}
			},
			sdimItems: {
				type: Array,
				default: () => {
					return []
				}
			},
			isCurSet: {
				type: Boolean,
				default: false
			},
			//按板块展示
			isShowBlock: {
				type: Boolean,
				default: false
			},
			status: {
				type: String,
				default: '加载中'
			}
		},
		data() {
			return {
				imageSrc: this.$base.IMAGE_SRC,
				serviceList: []
			}
		},
		methods: {
			addItem(item) {
				this.$emit('addItem', item)
			},
			clickServiceItem(item) {
				this.$emit('clickServiceItem', item)
			},
			getServiceSdim(serviceSdimBoList, sdimId) {
				for (let i in serviceSdimBoList) {
					if (serviceSdimBoList[i].sdimId == sdimId) {
						return serviceSdimBoList[i]
					}
				}
				return null
			},
			checkIn(service, sdimInfo) {
				let sdimBo = this.getServiceSdim(service.serviceSdimBoList, sdimInfo.sdimId)
				if (!sdimBo) {
					return false
				}
				let sdimItems = sdimBo.serviceSdimItemBoList
				for (let i in sdimItems) {
					if (sdimItems[i].sdimItemId == sdimInfo.sdimItemId) {
						return true
					}
				}
				return false
			}
		},
		watch: {
			serviceData() {
				this.serviceList = []
				if (!this.isShowBlock || this.serviceData.length == 0) {
					return
				}
				let tempList = []
				for (let i in this.sdimItems) {
					if (this.sdimItems[i].sdimItemName == '全部') {
						continue
					}
					tempList.push({
						sdimId: this.sdimItems[i].sdimId,
						sdimItemId: this.sdimItems[i].sdimItemId,
						sdimItemName: this.sdimItems[i].sdimItemName,
						services: []
					})
				}
				let otherMap = {
					sdimId: "",
					sdimItemId: "",
					sdimItemName: "其他",
					services: []
				}
				for (let i in this.serviceData) {
					let flag = false
					let service = this.serviceData[i]
					for (let j in tempList) {
						if (this.checkIn(service, tempList[j])) {
							flag = true
							tempList[j].services.push(service)
						}
					}
					if (!flag) {
						otherMap.services.push(service)
					}
				}
				tempList.push(otherMap)
				this.serviceList = tempList
			}
		}
	}
</script>

<style lang="scss">
	.service_block {
		background-color: #FFFFFF;

		//margin-bottom: 24rpx;
		.service_body {
			display: flex;
			// justify-content: space-between;
			flex-wrap: wrap;
			box-sizing: border-box;
			//padding: 30rpx 0 0 0;
		}

		.waiting-block {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 0 auto;
			padding-bottom: 60rpx;

			.wait-pic {
				width: 200rpx;
				height: 150rpx;
				background: url(#{$image_src}/static/newImages/work/law_pic.jpg) no-repeat center;
				background-size: 100% 100%;
			}
		}

		.work_item {
			width: 25%;
			margin-bottom: 60rpx;

			.item_text {
				width: 86%;
				margin-left: 7%;
				text-align: center;
				font-family: PingFangSC-Regular;
				font-size: 24rpx;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0rpx;
				color: #333333;
			}

			.item_icon {
				width: 96rpx;
				height: 96rpx;
				margin: 0 auto 8rpx auto;
				position: relative;

				.icon_img {
					width: 100%;
					height: 100%;
					background-size: contain;
				}

				.handle_icon {
					width: 36rpx;
					height: 36rpx;
					background-repeat: no-repeat;
					background-size: 100% 100%;
					background-position: center;
					position: absolute;
					top: -18rpx;
					right: -18rpx;
				}

				.handle_icon.add_icon {
					background-image: url(#{$image_src}/static/newImages/work/add@2x.png);
				}

				.handle_icon.del_icon {
					background-image: url(#{$image_src}/static/newImages/work/delete@2x.png);
				}
			}
		}
	}
</style>
