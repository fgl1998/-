<template>
  <div class="xu-common-title" :class="{mini : size === 'mini' }">
    <div class="left_title">
      <div class="top">
        <view><img :src="getRealImgUrl('img/publicImg/title.png')" class="loginBack"/></view>
		<view></view>
        <view class="zn-title"> {{ zh }}</view>
        <view v-if="en" class="en">
          {{ en }}
        </view>
      </div>
      <!-- <div class="bottom-line"></div> -->
    </div>
    <div class="right_title">
      <slot name="btn"></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    zh: {
      type: String,
      default: ''
    },
    en: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'normal'
    }
  }
};
</script>
<style lang="less" scoped>
.xu-common-title {
  width: 100%;
  height: 51px;
  display: flex;
  border-bottom: 1px solid #999999;

  .left_title {
    width: 100%;
    height: 51px;

    .top {
      display: flex;
		>view:first-child {
			width: 6px;
			height: 51px;
			border-bottom: 3px solid #0682FE;
			> img {
			  width: 6px;
			  height: 28px;
			}

		}
		>view:nth-child(2) {
			width: 6px;
			height: 51px;
			border-bottom: 3px solid #0682FE;
		}

      .zn-title {
        // margin-left: 12px;
        // width: 112px;
        height: 51px;
		border-bottom: 3px solid #0682FE;
        font-family: SourceHanSansCNBold, SourceHanSansCNBold;
        font-weight: bold;
        font-size: 28px;
        color: #333333;
        line-height: 30px;
        text-align: center;
        font-style: normal;
      }

      .en {
        // width: 300px;
        margin-left: 10px;
        height: 26px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 20px;
        color: #999999;
        line-height: 30px;
        text-align: center;
        font-style: normal;
        text-transform: uppercase;
      }
    }

    .bottom-line {
      margin-top: 23px;
      width: 128px;
      height: 3px;
      background: #0682FE;
      border-radius: 3px;
    }
  }
}

.mini {
  width: 98%;
  height: 30px;
  display: flex;
  border-bottom: 1px solid #EEEEEE;

  .left_title {
    width: 100%;
    height: 40px;

    .top {
		display: flex;
		>view:first-child {
			width: 6px;
			height: 30px;
			border-bottom: 3px solid #0682FE;
			> img {
			  width: 7px;
			  height: 18px;
			}

		}
		>view:nth-child(2) {
			width: 6px;
			height: 30px;
			border-bottom: 3px solid #0682FE;
		}
      .zn-title {
        // width: 112px;
        height: 30px;
        font-family: SourceHanSansCNBold, SourceHanSansCNBold;
        font-weight: bold;
        font-size: 20px;
        color: #333333;
        line-height: 20px;
        text-align: center;
        font-style: normal;
		border-bottom: 3px solid #0682FE;
      }

      .en {
        // width: 300px;
        height: 20px;
        font-family: SourceHanSansCN, SourceHanSansCN;
        font-weight: 400;
        font-size: 16px;
        color: #999999;
        line-height: 20px;
        text-align: center;
        font-style: normal;
        text-transform: uppercase;
      }
    }

    .bottom-line {
      margin-top: 10px;
      width: 80px;
      height: 3px;
      background: #0682FE;
      border-radius: 3px;
    }
  }
}
</style>
