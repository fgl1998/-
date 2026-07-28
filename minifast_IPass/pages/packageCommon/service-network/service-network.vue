<template>
  <view class="service-network h5-page">
    <!-- #ifdef MP-WEIXIN -->
    <block v-if="hasMarkers">
      <map
        class="map"
        :latitude="latitude"
        :scale="12"
        :longitude="longitude"
        show-location
        :markers="markers"
        enable-poi
        @tap="handleTap"
        @markertap="handleMarkertap">
      </map>
    </block>
    <block v-else>
      <map class="map" :latitude="latitude" :longitude="longitude" show-location enable-poi> </map>
    </block>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <map
      class="map"
      :latitude="latitude"
      :scale="12"
      :longitude="longitude"
      show-location
      :markers="markers"
      enable-poi
      @tap="handleTap"
      @markertap="handleMarkertap">
    </map>
    <!-- #endif -->

    <!-- 自贡隐藏合作机构 -->
    <div class="toolbar d-f ai-c spe" v-if="areaCode == '510300'">
      <div class="item d-f ai-c jc-c active">
        <div class="iconimg"></div>
        <span>合作银行网点</span>
      </div>
    </div>

    <div class="toolbar d-f ai-c" v-else>
      <block v-for="item in tabData" :key="item.id">
        <div
          class="item d-f ai-c jc-c"
          @click="handleChangeTab(item.id)"
          :class="[currentId === item.id ? 'active' : '']">
          <div class="iconimg"></div>
          <span>{{ item.name }}</span>
        </div>
      </block>
    </div>

    <!--泸州不显示 -->
    <div class="bank-wrapper" v-if="areaCode !== '510500' && currentId == 'bank'">
      <div class="tool">
        <scroll-view class="scroll-view" scroll-x>
          <div
            class="item"
            v-for="item in bankTypeListData"
            :key="item.id"
            :class="bankTypeCurrentId == item.id ? 'active' : ''"
            @click="onClickBankTypeScrollViewItem(item.id)">
            <img :src="item.imgSrc" alt="" class="bank-logo" />
            <div class="text">{{ item.name }}</div>
          </div>
        </scroll-view>
      </div>
      <div class="title">
        查询到 <span>{{ banksListData.length }}数据</span>
      </div>
      <div class="scroll-wrapper">
        <scroll-view class="scroll-view" scroll-y v-if="banksListData.length > 0">
          <div class="item" v-for="item in banksListData" :id="'scroll_' + item.id" :key="item.id">
            <img class="img" :src="item.imgSrc" alt="" />
            <div class="info">
              <div class="name">{{ item.name }}</div>
              <div class="address">{{ item.address }}</div>
              <div class="cells">
                <div class="cell">服务时间：{{ item.time }}</div>
                <div class="cell" @click="handleCallPhone(item.tel)">咨询电话：{{ item.tel }}</div>
              </div>
            </div>
            <div class="view">{{ item.chm04a || 0 }}人访问</div>
            <div class="go" @click="handleNavigation(item)">
              <div class="key">
                <img
                  class="icon"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA81JREFUaEPtmH3InmMYxn9HTTIhSZGPiLR8NWszsoQQ2j9kkRo1yz4s0hYt+8MWtbI05CPlIyklHyWyWkKyjJkiRIsopeSjREocOuu6dXV77+u+3+e57+156z3r+ee+zus6j+M8r/PjesQMF81w/MwSONARnI3AbATG9MCMuEK2rwL2SvqhzneiCdi+DLg1gd8yVbAmkoDti4G1wLXA98A5kn6ceAK2lySPX5+B3STpvqZUmYgI2D4veXx5Deh3yfs/TyQB2wuBNcCKBoAbJW0tFaoDEgHb8xPwWwrgvgEWSPp1YgjYPhNYne55Wwe4U9L9bUr7JQK25wGrEvCD2kAB+5L3f2vTHZSA7VOBuCZRy+c2gPkJ+DYAZ+vrJT3QBj7WByFg+6QEPGr5EQ1AfgceSuAfz3S+TN7/Y78TsH18BvyoBgB/J+AV+L1AJHUlt0uKtU7SSwRsH5uAR4IeU7D8GLBd0lehYztK6KOZ/mfAQkl/dkI/7hWyfXQCHgl6QsHo08A2SZ9XOrbnxIwDnJXtWyfpka7gR84B20dmwE8uGHwe2Crpk7qO7XXAw9n30Anv/zUYAduHJeBRWU4rGHoFuFdSePh/Yvtg4CPgjGxxraS4YtOSTjlg+5AM+OkFC28A90j6oITC9m3Ag5nOx8AiSZHg05IiAdvRdMLb8Tu7cPJOYLOk99qs2z4U2ANEc6tklaQn2vZOtT4lAdvxvQKeN5j6GW8l4O90NW77DiBvUnskLeq6v67XFoGbE5FzCwbeTyR2tIGwfTjwYS1/Vkp6sm1v03rXHLgxEbmgYOhTYIukF5t0bG8A8gFtt6R4C4wsnQhUp9u+GogEvKhg8WsguulruU4qveH9U7LvKyRFjxhZpkUgI3IJsBG4tMHyS5LiPfuf2L4rekL2aZekUkQ7kRqJQEYkEnwTEJGpy5KqKqWOvRvIm95Nkp7thLKgNBaBjEhci+3A0szWU5KiCMTMc3c0tmztXUkXjgs+9vdCIIFcBryQgfon1fp4lIT3T8zWlkt6bqIIJBK7gPMzYNuAILA5+/a2pPjfpxfpLQKJQIzT+TzzCxAPk+MytDdIiiGvF+mbQIzIMdM3DXpvSmqqXCMR6pVAQ8LmwK6TlOfJSKDzTUMQiEfOF0D9SblT0uVjI64d0DuBFIVI3vU1W8tKY8aoxIYiEDkQ/y5UskPSlaOCLO0bhECKQkyY1X+e10iKV1rvMiSBxUCM2q9Lyjt0ryQGI5Ci8DLwjKRXe0WdHTY0gSsktT50xiE3KIFxgHXdO0ugq6eG0pvxEfgXe+obQAmPev8AAAAASUVORK5CYII="
                  alt="" />
                <span>到这去</span>
              </div>
              <div class="desc">距您{{ item.distanceOfMeter || 0 }}km</div>
            </div>
          </div>
        </scroll-view>
        <ComponentNoData v-else></ComponentNoData>
      </div>
    </div>

    <ComponentCommonPopup ref="popup_address" type="bottom">
      <div class="popup-content">
        <div class="select-con">
          <div class="info d-f ai-c">
            <img :src="imageSrc" alt="" />
            <div class="details">
              <div class="name">{{ selectInfo.name }}</div>
              <div class="address">{{ selectInfo.address }}</div>
            </div>
          </div>
          <div class="time">
            <div>营业时间</div>
            <p>{{ selectInfo.time_desc }}</p>
          </div>
          <div class="files" v-if="selectInfo.chm03c">
            <div>可办理材料</div>
            <p>{{ selectInfo.chm03c }}</p>
          </div>

          <div class="button-wrapper d-f ai-c jc-sb">
            <ComponentButton
              name="联系网点"
              width="330rpx"
              height="80rpx"
              type="secondary"
              @click="handleCallPhone(selectInfo.tel)"></ComponentButton>
            <ComponentButton
              name="导航"
              width="330rpx"
              height="80rpx"
              type="primary"
              @click="handleNavigation(selectInfo)"></ComponentButton>
          </div>
        </div>
      </div>
    </ComponentCommonPopup>
  </view>
</template>

<script>
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  import ComponentNoData from '@/components/common/ez-no-data/ez-no-data.vue'
  import ComponentCommonPopup from '@/components/common/ez-popup/ez-popup.vue'

  import { getLocation, makePhoneCall, openLocation, downloadFile, showModal, showActionSheet } from '@/utils/uni-api'
  import { requestB039, requestB040, requestB174, requestB175 } from '@/service/api'
  import config from '@/config'
  import { IMAGE_COMMON } from '@/config/constants'
  import { bMapToQQMap } from '@/utils/convert'
  import { getCodeListByCodeName } from '@/utils/custom-api'

  const imageAddress = IMAGE_COMMON + 'icon-012.png'
  const { isUseBMap, requestUrl, areaCode } = config
  export default {
    name: 'pageServiceNetwork',
    data() {
      return {
        currentId: 'bank', // 当前选中tab Id
        // tab 数据
        tabData: [
          {
            id: 'bank',
            name: '合作银行网点'
          },
          {
            id: 'organ',
            name: '合作机构'
          }
        ],
        requestResponseData: [], // 请求返回的数据
        // 选择的信息
        selectInfo: {},
        longitude: '',
        latitude: '',
        imageSrc: '', // 机构头像
        isShowSelectInfo: false, // 是否显示选中内容
        hasMarkers: false, // 标记内容是否请求完成
        // 标记点 银行网点为所有数据
        markers: [],
        // 银行网点列表数据
        banksListData: [],
        // 银行网点类别数据
        bankTypeListData: [
          {
            name: '银行网点',
            id: 'all',
            imgSrc:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAA+RJREFUeF7tml1oHFUUx3/nblOlFtmdkOLMbsCq1IdApdQPagUrRRAUfPaDYkREkbwURQSh6YOgealWBBFKWh+K+iII4mNCEfwA9UVFlGqxyW5Ks7OpBtLa7hy5m73NNonFTfKwM3PvyzD3zgzn/7/nf+65Z66Q8yY5x48nwHtAzhnwEsi5A/gg6CXgJZBzBrwEcu4A/70K/EGx2Ae3KhTTTFIfUt8MfwY0LqyGY1UJzNA/kqBH0wx8ue2CjIXUX13Zv6ynRjCm8EqWwDssBo7cQnywE9sKD6gRfKNw79JD+h3wd0oJGQIZuBbwP9tC5s+7vhUEVAnqQGAfUDhcJh5NKfiW2VP0P2PQcYdBae4uc+H76xGgbrAPEw0wW0szAdb2KsFVTE2ShwaZm/xfBETEmcgTPAHeA7wE1hYD7CqQ9gBo7Rc45HB0FQSzAH45Bk9AN8ug94AMMuAl4CXQRSqcQQXgJdCdBPTqrind3iD71pQI+d2g3w4v1QOmCUYFHr5E8qh1pxuQT4GzEY0DM5QeS5B3FU70YgVpQ+oB7iM2iloCCpgJe7UyaZNzCHQyotEa76XmCdiIgoj3gDaLXgJ5jQE1gnGFoQTz9GIQTD5UdMEGvSql50FeE5gMiYd7KQD2bFncrhzWONP6/8J8QvJbmbnPHHk1SvbfpIQ0RmzfWYr7Cpg3IuK97hn7Dbvs2quBT0Lin+3YNEGrBFYmbpX0NmQV2OhZdQQUkB+a6C5bt2uyZcsgUwttoxNLgMtG2wScVPSdMo23HDA7XqU00UQP2x8eVYLf2574rLO5pwlwiZM1MsHcWWH21yn69xv0JUELwAchjc9rFB9UzHFgAOTuiPov9h1HwCJYeQCkGVG/sXPCepaAzmqtS6rstUbwsSIfWQIUnouIH2kT8L5gXlSS9yLioWsJkMvA/QL3hcQ/pYIAYGuZ+OUaWwdg8xjIuU3I0cvoKdCqQJ/CHYruNuh2xbwdEe+qEhwBXbCB13mAYI4nJKcFOZbA/grxVBoksKNM/GSdoHIJxhM4BaIF9PYrJCfaKfddioSG5hdg3gyJ97T1fxq4bWUMKL0A8niTK08N8lfc00GwQwIN4CtDcyTBHBN0OGTuzNIMliYEHVVk1O01zlHa20S+XE7AIuD+1wXdeZGbD2znzMVuY8A8cJP9UIIMV6jbwJPaNk3pCUFOOgAJ7KkQf+3uVzsh8q3CPR2IZ0F/TCMDguxQu2HtaJsohNs4P3M9AvJ9Rsgyk+tTYs41cn1OMI16X6vNmTgDtFbwreR5PS9n4V1PQBZmcT0YvAesh70svOs9IAuzuB4MufeAfwEyLmNfeaOR/gAAAABJRU5ErkJggg=='
          }
        ],
        // 银行网点当前筛选id
        bankTypeCurrentId: 'all',
        codeMap: {}, // 码表
        areaCode: areaCode
      }
    },
    components: {
      ComponentButton,
      ComponentCommonPopup,
      ComponentNoData
    },
    onShow() {
      this.getCodeTableCacheData()
    },
    onLoad() {
      requestB174().then((res) => {
        const data = res.lists.aae008List.list
        let arr = []
        data.forEach((item) => {
          const { aae008, aae008Desc, chi215 } = item
          if (aae008 && aae008Desc && chi215) {
            arr.push({
              id: aae008,
              name: aae008Desc,
              imgSrc: requestUrl + '/upload/downloadFile/' + chi215
            })
          }
        })
        this.bankTypeListData = this.bankTypeListData.concat(arr)
      })
    },
    methods: {
      // 获取码表
      async getCodeTableCacheData() {
        let chm032 = [] // 儿童与监护人关系

        try {
          chm032 = await getCodeListByCodeName('chm032')
        } catch (err) {
          console.error('code table c00066 error：', err)
        }

        this.codeMap = {
          ...this.codeMap,
          chm032
        }
      },

      // 打开地点弹窗
      openPopupAddress() {
        const currentId = this.currentId
        if (currentId != 'bank') {
          this.$refs.popup_address.open()
        }
      },

      // 关闭地点弹窗
      closePopupAddress() {
        this.$refs.popup_address.close()
      },

      // 打开操作面板弹窗
      openPopupActionSheet() {
        const arr = this.codeMap.chm032.map((item) => item.aaa103)
        const values = this.codeMap.chm032.map((item) => item.aaa102)

        showActionSheet(arr)
          .then((res) => {
            // console.log(values[res], 987)
            this.handleSelectType(values[res])
          })
          .catch((err) => {})
      },

      // 获取当前位置信息
      getCurrentLocationInfo() {
        const latitude = this.latitude
        const longitude = this.longitude
        if (latitude && longitude) {
          this.ruqestData(latitude, longitude)
        } else {
          getLocation('gcj02').then((res) => {
            const { latitude, longitude } = res
            this.latitude = latitude
            this.longitude = longitude
            this.ruqestData(latitude, longitude)
          })
        }
      },

      // 下载图片
      requestDownloadFile(chi215) {
        return new Promise((resolve, reject) => {
          downloadFile('/upload/downloadFile/' + chi215)
            .then((res) => {
              const { tempFilePath } = res
              resolve(tempFilePath)
            })
            .catch((err) => {
              reject(err)
            })
        })
      },

      // 获取当前定位周围的基层网点
      ruqestData(latitude, longitude, chm032) {
        const currentId = this.currentId
        if (currentId === 'bank') {
          requestB040(longitude, latitude, 10000, chm032).then((res) => {
            let { list } = res.lists.hm04AllList
            if (list && list.length > 0) {
              const newList = []
              list.map((item, index) => {
                let QQMap = bMapToQQMap(Number(item.chm048), Number(item.chm049))

                if (isUseBMap) {
                  item.chm048 = QQMap.longitude
                  item.chm049 = QQMap.latitude
                }
                let obj = {
                  id: 1000 + index,
                  chm040: item.chm040,
                  latitude: isUseBMap ? QQMap.latitude : Number(item.chm049),
                  longitude: isUseBMap ? QQMap.longitude : Number(item.chm048),
                  imgSrc: requestUrl + '/upload/downloadFile/' + item.chi215,
                  time: item.chm046,
                  name: item.chm041,
                  tel: item.aac103,
                  address: item.chm043,
                  chm04a: Number(item.chm04a || 0),
                  aae008: item.aae008,
                  distanceOfMeter: item.distanceOfMeter || 0
                }
                newList.push(obj)
              })
              this.markers = [...newList]
              this.banksListData = [...newList]
              this.hasMarkers = true
              this.requestResponseData = [...list]
            } else {
              this.hasMarkers = false
              this.markers = []
              this.banksListData = []
              this.requestResponseData = []
            }
          })
        } else {
          requestB039(longitude, latitude, 10000, chm032)
            .then((res) => {
              let { list } = res.lists.hm03List

              if (list && list.length > 0) {
                const newList = []
                list.map((item, index) => {
                  let QQMap = bMapToQQMap(Number(item.chm03a), Number(item.chm03b))

                  if (isUseBMap) {
                    item.chm03a = QQMap.longitude
                    item.chm03b = QQMap.latitude
                  }
                  let obj = {
                    id: 1000 + index,
                    latitude: isUseBMap ? QQMap.latitude : Number(item.chm03b),
                    longitude: isUseBMap ? QQMap.longitude : Number(item.chm03a),
                    iconPath: imageAddress,
                    width: '30',
                    height: '30'
                  }
                  newList.push(obj)
                })
                this.markers = [...newList]
                this.hasMarkers = true
                this.requestResponseData = [...list]
              } else {
                this.hasMarkers = false
                this.markers = []
                this.requestResponseData = []
              }
            })
            .catch(() => {
              this.hasMarkers = false
              this.markers = []
              this.requestResponseData = []
            })
        }
      },

      // tab change
      handleChangeTab(id) {
        const currentId = this.currentId
        this.closePopupAddress()
        this.currentId = id

        // 点击合作机构
        if (id == 'organ') {
          this.openPopupActionSheet()
        }
      },
      // 选择类型
      handleSelectType(id) {
        const latitude = this.latitude
        const longitude = this.longitude
        this.ruqestData(latitude, longitude, id)
      },
      // 点击地图
      handleTap() {
        this.isShowSelectInfo = false
      },
      // 点击标记点时触发
      handleMarkertap(e) {
        const currentId = this.currentId
        const { markerId } = e.detail
        const requestResponseData = this.requestResponseData
        const markers = this.markers
        let obj = {
          name: '',
          address: '',
          time_desc: '',
          tel: '',
          latitude: '',
          longitude: ''
        }
        for (let i = 0, len = markers.length; i < len; i++) {
          const item = markers[i]
          if (item.id === markerId) {
            // console.log(item, 12345888)
            const info = requestResponseData[i]
            if (info && info.chi215) {
              this.requestDownloadFile(info.chi215)
                .then((res) => {
                  this.imageSrc = res
                })
                .catch(() => {
                  this.imageSrc =
                    'https://tse3-mm.cn.bing.net/th/id/OIP-C.O5plvGkkyzbhRZBo0FJlPwHaHa?w=181&h=180&c=7&r=0&o=5&dpr=1.05&pid=1.7'
                })
            } else {
              this.imageSrc =
                'https://tse3-mm.cn.bing.net/th/id/OIP-C.O5plvGkkyzbhRZBo0FJlPwHaHa?w=181&h=180&c=7&r=0&o=5&dpr=1.05&pid=1.7'
            }
            obj = {
              ...obj,
              tel: info.aac103,
              name: info.chm031,
              address: info.chm033,
              time_desc: info.chm038,
              latitude: info.chm03b,
              longitude: info.chm03a,
              chm03c: info.chm03c
            }

            if (currentId === 'bank') {
              obj = {
                ...obj,
                tel: info.aac103,
                name: info.chm041,
                address: info.chm043,
                time_desc: info.chm046,
                latitude: info.chm049,
                longitude: info.chm048
              }
            }
            this.selectInfo = {
              ...obj
            }
            break
          }
        }

        // #ifdef MP-WEIXIN
        this.openPopupAddress()
        // #endif
        // #ifdef H5
        setTimeout(() => {
          this.openPopupAddress()
        }, 500)
        // #endif
      },
      // 联系网点
      handleCallPhone(tel) {
        // #ifdef MP-WEIXIN
        makePhoneCall(tel)
        // #endif
        // #ifdef H5
        showModal('电话号码为' + tel + '，请自行联系！')
        // #endif
      },
      // 导航
      handleNavigation(data) {
        const currentId = this.currentId
        const bankTypeCurrentId = this.bankTypeCurrentId
        const { name, address, latitude, longitude, chm040 } = data
        openLocation(Number(latitude), Number(longitude), name, address)
        if (currentId == 'bank') {
          requestB175(chm040, false).then((res) => {
            const data = [...this.markers]
            for (let i = 0, len = data.length; i < len; i++) {
              const item = data[i]
              if (item.chm040 === chm040) {
                item.chm04a = Number(item.chm04a) + 1
              }
            }
            this.markers = [...data]
          })
        }
      },
      onClickBankTypeScrollViewItem(id) {
        if (id) {
          this.bankTypeCurrentId = id
          const data = [...this.markers]
          let arr = []

          if (id === 'all') {
            this.banksListData = [...data]
          } else {
            data.forEach((item) => {
              // console.log('item.aae008', item, item.aae008)
              if (item.aae008 === id) {
                arr.push(item)
              }
            })
            this.banksListData = [...arr]
          }
        }
      }
    },
    computed: {},
    watch: {
      currentId: {
        handler(val) {
          if (val && val == 'bank') {
            this.getCurrentLocationInfo()
          }
        },
        immediate: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .service-network {
    width: 100%;
    height: 100%;
    height: 100vh;
    position: relative;
    .map {
      width: 100%;
      flex: 1;
    }
    .toolbar {
      position: absolute;
      top: 30rpx;
      left: 50%;
      width: 690rpx;
      height: 80rpx;
      background-color: #ffffff;
      transform: translateX(-50%);
      border-radius: 10rpx;
      z-index: 99;
      .item {
        width: 50%;
        height: 100%;
        font-size: 26rpx;
        line-height: 1;
        color: #999;
        transition: all 0.3s;

        .iconimg {
          width: 40rpx;
          height: 36rpx;
          margin-right: 20rpx;
          transition: all 0.3s;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAYAAAD7PHgWAAACIklEQVRYhe3XPWgVQRQF4C8hKMGgKcTKQEAFI4jBxjQKoohNLAQbsRCFQDpBRUkrioiWFu9VVgZiIUgaC41WUSubBESREAM2isEfJGDUYtewDLP63iR5LMEDC/fOnjvnsLNzZ7etVqspQTeu4QQ2l5GWiQ+4h5GhoaH5GKG9pLATTzBs9czJ5x7GRL1e74wROkoKz2JPHs9hAj9X2Fw7DmIr+nEGtxs1uL8QH8arFTb3B32YzuMDIgbLlnh9IV4tc/C+RHMJZQYrg8obLHsHG6k7JNvtM3hZwutHL77jEX6kCKXgOs4X8gE8DzgDmCzkN3GxWaHUJd4e5H0Rzs4g35EilGrwS5B/inDCsbCmIaQu8Qg+yo7DKYxHOOO4hF2Yx61WGnyHc//gLOJG4vxLqHybqbzB1CXuxQV04Y2s7YQ9rgOXZTv+q6zNzLTK4FWcLORTuB9wBnGlkHfjVLNCqUu8Icg3RTjhWFeKUKrB4hfOL9kTDDGd34vVNIzl9MGH2IjX4gZfYLfsBPmMp600uIjHDfCmxM03jMq3mTVrcBCzsjN2UvzPbwue5ZzZvKZlBk+jR9ZKBnA0wjmCfTmnJ69pGqkGw7q2CCcci3GaFmoUY/iWx29l/80hJvJ7cu5YilBqmxnNr79hDtsS51/Cmt3FLcN/g8tF5Q124DiOBeN7C/GdVdRfV9Ss1+uh1oO2Wq22EBCrhIV23JV9PlUNixj9DSEAYHQSUBIiAAAAAElFTkSuQmCC);
        }

        &:last-child {
          .iconimg {
            height: 38rpx;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAmCAYAAAC29NkdAAADDklEQVRYhc3YT8hVRRjH8c+rvfiKlVpSJIT9t4J4c1FCLaTFC4pUtGoVEdTJJFKp0NzY7k3SeIOkzrSpUBDEgmoRYVRQRLmwIsoWWQbmoj8WpoUltphzfcfr9b537jne/MGBOQ/zm/O9c+Y888wdKstSQ5qJh7ASV+E9PIgD3UxFUXQddFpDYKuxD89jIYaxFK/WHfy8Gt7z8Sgex7wz9LmjxvjobwbnYD1+wLhJuH9Q4iZ8XmP8U5Qzg3PEV7kas5P43xXYc/ixiu3HzXXhegWchyfwCC5M4kfxMjbiYBMwndQN8FKsEdfZrCR+BC9gE345W2AtdQK8DGvxMEaS+B8V2MQgwFpqB1yJzU4Hm6iu3wfEdVIp4HXYktz/Kr7GLTg8SKhUaRq4JWlvwxV4Rn24dVjQrzkFHE7au/Bnv4O2aRzfYgNm5JpzE+l8cVYnsCrDPwNP4yuM5TwwF3Bc/MJXiZDLe/CsE3MmXIN3sV3MFo0Dzm67v7gHz0bciDeT2L3ia38shDC9mzkXsL10+r5H337cjbtMbocXiNXP7hDC4qYAn8QD4g4zhg8z/W/hBnEd/1vFFuGTEMKLIYS5dQGP4hVx/e3K9KZjPIVRkz9wCCuwN4SwtA5gk/parBfvx89V7BK8EUKY3+r0fwLCiaIoXhOr8Ler2AiWtDrkAo6KX+MHYg040rV3jyqK4hB2JqGTCT235F+PO6v2EnEd7qhFN4VyZ7B9q5rVsVeDygX8MmkfxxcNsnRULuAGLBa/vmuxJ9N/Gz4SD1U7xWTdVblr8AQ+y/SkWoPbq/aouH63dzMMOs0Mt91PWX4NGvDjpP0XPp3KkAs4hm/EQ/v7uCjT/yyuFvffy7F3KkPuGlyB66v2AiwTjwc52pfTOXcG22u3rrVcE8oFfCdp/+bUNXVWlAv4krjurhTPJ981TtSmfv5+O1RdA9GZZrBu+knzXa9HzY7PHCrL8j7cIx7UF1Xxg/rfMYbFdNSC3I2fevDdavKkt0dMZa8PlWV5zOkZ/lzRsWnYKlYm55qOY9t/lgyR5q71wC8AAAAASUVORK5CYII=);
          }
        }

        &.active {
          background-color: #2187f5;
          color: #ffffff;
          border-radius: 10rpx;
          .iconimg {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAYAAAD7PHgWAAACIUlEQVRYhe3Xv2sUQRQH8E9CUMSgV4iVgYCKRhCDTYKdCGITC0uxEP0HLATFVgTRWGptZUgaQ0hjocEqYmVzgigiMWARRPEHEjCOxS5xmcwmd5vkWIJfGJg37/v2fW9m3ts9IQQloxFCeBBCWAibh4U8R6NMR1cIQQI7MItjKecm4BVO4Ffs6CkJuOyfuHnM4M8Gi+rGSezDIC7h/gpWydaOF47h0CrXYL1joJBnPMXpLvl12wvzNxu8c0V8Ksm5jDKBtUHtBZYVSStxp2TV/kFWhSkMol9WnU/xu+1MJZd3snB5U/7RqJ8NJTjDEedugtMo+CfbKZK1cCCyBxKcw5F9sEqiqgK/R/aXBCdei2NaQtU7eAOf0UAT0wnONK7hCL7iXicFfsSVNThLuFPx+cuofZupvcCqR9yPq+jFO9y2ssf14Lqs4n9gVNYzOyLwFs4X7CYeR5wR3CzYDVxoN1HVI94Z2bsTnHitt0qiqgKLXzhBtoMxXue+VEzLWE8ffIJdeCst8CWOyt4g3/C8kwKX8KwFXlNafMuofZvZsgJHMCd7x85iT4KzFy9yzlwe0zGBF9EnayXDOJPgnMZQzunLY9pGVYFxXFeCE6+lOG0nahUT+JnP38v+N8eYyX1y7kSVRFXbzFg+VsM89ld8/jK2bBV3DP8Frhe1F9iDczgbrR8vzB9uYv5tUc4411RXCGExItYJi914JPt8qhuWMPYXkvHlirWvjYUAAAAASUVORK5CYII=);
          }
          &:last-child {
            .iconimg {
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAmCAYAAAC29NkdAAAC9klEQVRYhc2YT0gVURjFf1qSYZKVFBZlEf2TQFxUUAtxIdTColWryFZFhCURihvdZdTCIMiWRYIQ/aGCWggZFFEurIiyRWVBSSSplAiP7LS4o1zHeW/mvhkfHnhw78c9dw7fPe/77gySSOi3WFKDpAFJKUkPJa2Ju29Swk5LGtJs9MTdP08SWWIJcBI4A5SmWfMPWJDtA4CsMlgiqUXSsC9bKUmdkrZL6rfiOTviEkltkkZ9wiYkdUhaZ629m0uBpZLaJY35hI17wsoCOIkJXJjh9FcBjZ7Piqz4OHAZuAgMx/JXBAQJLAOagGNAoRUf84R15ELYNHwpPeF5ysao570Sh6OZEw9u9gkbltQsqTiLjRMTmG8lc4c17gLWA+3A75iH1AyUZ0u2BRZY4x7gT7ab+nAO+AC0AotcyfnhS2ZgNSarHcApB/4ioA14C9Q6PdE673rLN/VpPHHN59O6CB5skqmZNroVXD8zejAKlvrmKyJwzgMVwD0rdghz7A2E9GpXgd98888ReV+AA8B+4KsXKwYuAX3ArqQEngWOYjpMLfDEkX8f2Ibx8V8vVgU8B64Ay2YxHD2YZB2skNTr8+YPSXvjeDBJvANqgCPATy+2EriDqRaA+xEnDQHXgS3AAy9WCFRPLXAVWIn5N/YCV5l5mYiDEeCWNZ8u6JmuW0FoAeq8cTWm49yMJS0Erhn0t6qiwFUJwlXgG2s8CbxOUEsgXAW2YopqDbAJ6Hfk7waeAq8wnisOI7h6UMBLR46NRmCPN67E+Lc7EyHXZabANw+9fuVa4DNrPAG8CCO4CqwF3gODwGNguSP/ArAR03/XAgNhBFcPHge2euNyYB/m9cAFn1wWu2bQf3eL990lAlwFPrLGv5jpqTmBq8BOjO82YG4cHxNX5IOrB8E09pGkhaRDugzGLT92vYv6qhn4zDxJh4GDmBf1Ki8+RPYdowBTjqZE9gHfI/B2Yr4LgWmhg8DtPEkpZlf4+YJUPnADczOZb5gEuv4DJA3g4wRql3wAAAAASUVORK5CYII=);
            }
          }
        }
      }
    }

    .spe {
      width: 345rpx !important;
      .item {
        width: 100% !important;
      }
    }

    .toolbar.specialZG {
      width: 345rpx !important;
    }
    .bank-wrapper {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 999;
      background-color: #fff;

      .title {
        font-size: 28rpx;
        line-height: 80rpx;
        color: #333;
        font-weight: 500;
        padding: 0 $spacing;
      }
      .tool {
        border-bottom: 1px solid #ddd;
        .scroll-view {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          .item {
            display: inline-block;
            margin-right: 20rpx;
            transition: all 0.3s;
            padding: 20rpx 0;
            .bank-logo {
              width: 80rpx;
              height: 80rpx;
              margin: 0 auto;
            }
            .text {
              font-size: 20rpx;
              line-height: 1;
              padding-top: 8rpx;
            }
            &:first-child {
              margin-left: $spacing;
            }
            &:last-child {
              margin-right: $spacing;
            }
            &.active {
              color: $primary;
            }
          }
        }
      }
      .scroll-wrapper {
        padding: 0 $spacing;
        .scroll-view {
          max-height: 220px;
          overflow: hidden;
          .item {
            display: flex;
            align-items: center;
            position: relative;
            padding: 20rpx 0;
            border-bottom: 1px solid #ddd;
            .img {
              width: 60px;
              height: 60px;
              background-color: #eee;
              border-radius: 4px;
              overflow: hidden;
              margin-right: 20rpx;
            }
            .info {
              flex: 1;
              overflow: hidden;
              display: block;
              padding-right: 180rpx;
              .name {
                font-weight: 500;
                font-size: 26rpx;
                line-height: 1;
                color: #333;
                @include textOverflow();
              }
              .address {
                font-weight: 400;
                font-size: 22rpx;
                line-height: 1;
                color: #666;
                padding-top: 8rpx;
                @include textOverflow();
              }
              .cells {
                .cell {
                  color: #999;
                  font-size: 20rpx;
                  padding-top: 8rpx;
                  @include textOverflow();
                }
              }
            }
          }
        }
        .view {
          position: absolute;
          bottom: 80rpx;
          right: 0;
          padding-bottom: 20rpx;
          font-size: 20rpx;
          color: #999;
          line-height: 1;
          width: 160rpx;
          text-align: left;
        }
        .go {
          position: absolute;
          bottom: 20rpx;
          right: 0;
          background-color: $primary;
          color: #fff;
          font-size: 22rpx;
          padding: 10rpx 0;
          border-radius: 8rpx;
          line-height: 1;
          width: 160rpx;
          text-align: center;

          .key {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .icon {
            width: 24rpx;
            height: 24rpx;
            margin-right: 4rpx;
          }
          .desc {
            font-size: 20rpx;
            opacity: 0.8;
            padding-top: 8rpx;
          }
        }
      }
    }
  }

  .select-con {
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0rpx -4rpx 16rpx 0rpx rgba(0, 0, 0, 0.14);
    border-radius: 30rpx 30rpx 0rpx 0rpx;
    padding: 0 $spacing;
    .info {
      width: 100%;
      padding-top: 36rpx;
      padding-bottom: 30rpx;
      border-bottom: 1px solid $border-color;
      img {
        width: 100rpx;
        height: 100rpx;
        border-radius: 10rpx;
        margin-right: 30rpx;
        background-color: #eee;
      }
      .details {
        flex: 1;
        overflow: hidden;
      }

      .name {
        font-size: 36rpx;
        font-weight: 700;
        color: #000;
        line-height: 1.2;
      }

      .address {
        font-size: 24rpx;
        line-height: 1.4;
        color: #999999;
        padding-top: 20rpx;
      }
    }
    .cells {
      padding: 30rpx 0;
      .cell {
        text-align: center;
        color: $color;
        line-height: 80rpx;
        border-bottom: 1px solid $border-color;
        padding: 0 30rpx;
        &:last-child {
          border-bottom: 0;
        }
      }
    }

    .time {
      width: 100%;
      text-align: center;
      padding: $spacing 0;
      div {
        font-size: 30rpx;
        line-height: 1;
        color: #333;
      }
      p {
        font-size: 30rpx;
        line-height: 1.4;
        margin-top: 28rpx;
        color: #999;
        text-align: left;
      }
    }
    .files {
      width: 100%;
      text-align: center;
      padding: $spacing 0;
      border-top: 1px solid $border-color;
      div {
        font-size: 30rpx;
        line-height: 1;
        color: #333;
      }
      p {
        font-size: 30rpx;
        line-height: 1.4;
        margin-top: 28rpx;
        color: #999;
        text-align: left;
      }
    }

    .button-wrapper {
      width: 100%;
      border-top: 1px solid $border-color;
      padding: $spacing 0;
    }
  }
</style>
