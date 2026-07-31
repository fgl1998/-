<script>
export default {
  data() {
    return {}
  },
  created() {
    // 获取所以码值并缓存
    this.$codeConfig.getAllDictText()
    this.$device.send()
    this.getIndustryListTree()
  },
  mounted() {},
  methods: {
    getIndustryListTree() {
      return new Promise((resolve, reject) => {
        let industryList = undefined
        const res = window.localStorage.getItem('industryList')
        if (res !== 'null' && res !== 'undefined' && res !== '') {
          industryList = JSON.parse(res)
        }
        if (!industryList) {
          this.$http.post(this.$requestConstant.commonRequestType, 'jy048_com01', null, null, true).then((data) => {
            let result = data?.data?.result
            window.localStorage.setItem('industryList', JSON.stringify(result))
          })
        }
        console.log(industryList, 66666666)
      })
    },
  },
  onLaunch: function () {},
  onShow: function () {
    if (!this.$loginConfig.isLogin()) {
      let page = window.location.href
      let currentPage = page.split('#')[1]
      if (
        !currentPage.includes('/pages/largeScreen/largeScreen') &&
        !currentPage.includes('/pages/jobInfoStatistic/jobInfoStatistic') &&
        !currentPage.includes('/pages/recruitmentArea/recruitmentArea')
      ) {
        uni.navigateTo({
          url: '/pages/loginPage/loginPage',
        })
      }
    }
  },
  onHide: function () {},
}
</script>

<!-- 分页按钮样式问题调整 -->
<style lang="less">
body {
  width: 1920px;
  height: 1080px;
}

/deep/ .btn-next,
/deep/ .btn-prev {
  border: 0px;
  height: 28px;
}

.newNoData {
  background: url('./static/images/img/publicImg/noData.png') top center no-repeat;
  background-size: 100%;
  max-width: 310px;
  margin: 0 auto;
  color: #333;
  font-size: 16px;
  font-weight: 600;

  &::after {
    padding-top: 90%;
    display: block;
    content: attr(data-on);
    text-align: center;
    font-family: Microsoft YaHei;
    padding-bottom: 5%;
  }
}

/deep/ .el-loading-spinner {
  top: calc((100% - 450px) / 2) !important;

  .el-icon-loading-idCard {
    background-image: url('./static/images/card/idCard.gif');
    background-repeat: no-repeat;
    width: 500px;
    height: 450px;
  }

  .el-icon-loading-card {
    background-image: url('./static/images/card/card.gif');
    background-repeat: no-repeat;
    width: 500px;
    height: 450px;
  }
}
</style>
