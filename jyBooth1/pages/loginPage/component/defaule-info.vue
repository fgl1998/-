<template>
	<div class="info-left">
		<div class="top-line"></div>
		<div class="center">
			<div class="company-vedio">
				<image class="pic_first" :src="$defaultData.defaultCompanyInfo.defaultImg" />
			</div>
			<div class="company-pic">
				<image v-for="(item, index) in $defaultData.defaultCompanyInfo.imgList" :key="index" :src="item.aae707" />
			</div>
		</div>
		<div class="bottom-line"></div>
		<div class="bottom">
			<div class="company-name">{{ $defaultData.defaultCompanyInfo.aab004}}</div>
			<div class="company-type">
				<view>所属行业：{{ $defaultData.defaultCompanyInfo.aab022}}</view>
				<view>单位规模：{{ $defaultData.defaultCompanyInfo.aab056}}</view>
				<view>单位性质：{{ $defaultData.defaultCompanyInfo.aab020}}</view>
			</div>
			<div class="company-desc">
				<view class="title">【公司简介】：</view>
				<view class="desc">{{ $defaultData.defaultCompanyInfo.aab092}}</view>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'defaultInfo'
	}
</script>

<style lang="less" scoped>
	.info-left {
		width: 1164px;
		height: 720px;
		padding: 32px 42px;
		.top-line {
			width: 1080px;
			height: 6px;
			background: #0682fe;
			border-radius: 6px;
			margin-bottom: 32px;
		}
		.center {
			width: 1080px;
			display: flex;
			.company-vedio {
				width: 684px;
				height: 389px;
				.pic_first {
					width: 684px;
					height: 398px;
				}
			}
			.company-pic {
				width: calc(100% - 704px);
				height: 389px;
				margin-left: 20px;
				> image:first-child {
					margin-right: 15px;
				}
				> image:last-child {
					margin-left: 15px;
				}
				> image {
					margin: 10px 0;
					width: 175px;
					height: 180px;
				}
			}
		}
		.bottom-line {
			width: 1080px;
			height: 6px;
			background: #0682fe;
			border-radius: 6px;
			margin: 32px 0;
		}
		.bottom {
			width: 1080px;
			.company-name {
				width: 100%;
				height: 28px;
				font-family: SourceHanSansCNBold, SourceHanSansCNBold;
				font-weight: bold;
				font-size: 28px;
				color: #333333;
				line-height: 42px;
				text-align: left;
				font-style: normal;
			}
			.company-type {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 28px;
				> view {
					width: 320px;
					height: 20px;
					font-family: SourceHanSansCN, SourceHanSansCN;
					font-weight: 400;
					font-size: 20px;
					color: #666666;
					line-height: 30px;
					text-align: left;
					font-style: normal;
				}
			}
			.company-desc {
				width: 1080px;
				height: 136px;
				margin-top: 26px;
				overflow: hidden;
				.title {
					width: 1080px;
					font-family: SourceHanSansCN, SourceHanSansCN;
					font-weight: bold;
					font-size: 20px;
					color: #666666;
					line-height: 39px;
					font-style: normal;
					display: inline;
				}
				.desc {
					font-family: SourceHanSansCN, SourceHanSansCN;
					font-size: 16px;
					color: #666666;
					font-style: normal;
					display: inline;
				}
			}
		}
	}
</style>