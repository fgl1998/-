<template>
  <div class="statistics">
    <ComponentPanel title="当日登记情况">
      <div class="panel-content">
        <div class="item">
          <div class="img-wrapper">
            <div class="iconimg"></div>
          </div>
          <div class="value">
            <div class="val">{{ totalNum }}</div>
            <div class="unit">人</div>
          </div>
          <div class="key">登记人数</div>
        </div>
        <div class="item">
          <div class="img-wrapper">
            <div class="iconimg"></div>
          </div>
          <div class="value">
            <div class="val">{{ aka131_01_num || 0 }}</div>
            <div class="unit">人</div>
          </div>
          <div class="key">市内人员</div>
        </div>
        <div class="item">
          <div class="img-wrapper">
            <div class="iconimg"></div>
          </div>
          <div class="value">
            <div class="val">{{ aka131_02_num || 0 }}</div>
            <div class="unit">人</div>
          </div>
          <div class="key">市外人员</div>
        </div>
        <div class="item">
          <div class="img-wrapper">
            <div class="iconimg"></div>
          </div>
          <div class="value">
            <div class="val">{{ aka131_03_num || 0 }}</div>
            <div class="unit">人</div>
          </div>
          <div class="key">省外人员</div>
        </div>
      </div>
    </ComponentPanel>
  </div>
</template>
<script>
import ComponentPanel from '@/components/common/ez-panel/ez-panel.vue'

export default {
  name: 'pageEPRStatistics',
  props: {
    //  市内人员
    aka131_01_num: {
      type: [Number],
      default: 0
    },
    //  市外人员
    aka131_02_num: {
      type: [Number],
      default: 0
    },
    //  省外人员
    aka131_03_num: {
      type: [Number],
      default: 0
    }
  },
  data() {
    return {}
  },
  components: {
    ComponentPanel
  },
  mounted() {},
  methods: {},
  computed: {
    totalNum() {
      let num = 0
      const aka131_01_num = this.aka131_01_num
      const aka131_02_num = this.aka131_02_num
      const aka131_03_num = this.aka131_03_num

      if (aka131_01_num) {
        num += parseInt(aka131_01_num)
      }
      if (aka131_02_num) {
        num += parseInt(aka131_02_num)
      }
      if (aka131_03_num) {
        num += parseInt(aka131_03_num)
      }
      return num
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
.statistics {
  width: 100%;
  .panel-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow-x: scroll;
    .item {
      min-width: 200rpx;
      height: 240rpx;
      background-color: rgba(116, 185, 255, 0.05);
      border-radius: 4rpx;
      border: solid 1px #74b9ff;
      font-size: 28rpx;
      font-weight: 400;
      line-height: 40rpx;
      color: #666666;
      text-align: center;
      .img-wrapper {
        height: 114rpx;
        display: flex;
        .iconimg {
          margin: auto;
          width: 72rpx;
          height: 72rpx;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOS0wMVQxNDoxNDoxNyswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDktMDFUMTQ6MTc6MTgrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDktMDFUMTQ6MTc6MTgrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZDM0NjRhMTItZDc0Mi00NzQzLWI5NzMtMDdlMDI3ZTdiMDZlIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOmQzNDY0YTEyLWQ3NDItNDc0My1iOTczLTA3ZTAyN2U3YjA2ZSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmQzNDY0YTEyLWQ3NDItNDc0My1iOTczLTA3ZTAyN2U3YjA2ZSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDM0NjRhMTItZDc0Mi00NzQzLWI5NzMtMDdlMDI3ZTdiMDZlIiBzdEV2dDp3aGVuPSIyMDIyLTA5LTAxVDE0OjE0OjE3KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PopNQdEAAAQVSURBVHic7ZxNdhpHEIC/QljyLnME3SD4BIGNjFYhJ7B1gsyLYB3vjWx8gignsHYRbJBugE8QcgO0izFMZWGNgxEgNU3BNK+/ld5ourrfR0//0MWIqhJZn9KuGxA6UaAnUaAnUaAnUaAnZZebRQSA8642RPkVoWrRqC0zUOhcvJQ/8wsuKxNxulmE82v9Q4TXTk0MAFUuL+py9vVvI4HNHg2Bj+7NC4NMOHt3IpcuTpzGQIHUtVEhIRm/u5ZxnUR+cq0gJEQ4di3jNIksov3yfmYJkGbXfx8blzGeRIGeRIGeRIGeRIGeRIGeRIGeRIGeeC+kl5H+pcflEq+s4j+GKqOLunywrsdEYKunlUzpA4lF/KcgAs1rbbTrUrOsx+QRzpRUdijvG0K11dOKZRV7Pwbq1PaDNBEoGZcWcV1R+NQ+lRvLOkzGwPap3LR6+kKVhkX8J6GMpkf2H6TZLPz2RAbAwCp+Udj7MdCaKNCTKNCTKNATs0mk2dX3qjTWOajZEAMRzu4nMzNMeuBvPX0NpDuUB1DJlH7a18SyEhOBpWyH678ZBJLyv1Qs67AaA2+M4jozgaFlfBOBkyMuFT5ZxHYhE846pzK0rMNkEunUZARUWj2tWG/mlzF5zuC+HaaYzcLwbTu318R1oCdRoCemj3Da1+TZF350KHK35cf+DvjBJ4CJwLSvSfkzHxlTdU1/Or/WYanEL5sWmfY1OfjMKxGSySEfOjUZodwg/Dxz251rXJNHuDwmXTd/WoRjzXi/yfakfU3KY/oidIA3B2P+bvW0MlHSmeXWHWtsAKwe4apX6Q0mr+fy4P8diUCSKf1nB9TenkhlaeEnYDOJKFeeEW430YxF8nJyib6ndiYC23XpqLLuofatiH8u9ip5OZuQ6JSl3+rx4OYipvguk5ePd8L3KwOFUUmo5ROXWZZ+CKySNz2kOj2kOr9P9+mJeyXwMXmdmow6NRmtkuj6/eHeCHyKvPzaKonlsdv4uxcCXeTNIjwc01EW3rsM063cNlhH3soyjtkMQffAjctb0VuXEazAIsiDQAUWRR4EKLBI8iAwgUWTBwEJLKI8CERgUeVBIAKLKg8CEHi/wa/MXiuKPAhA4KKD+aLIgwAELqIo8iBQgfPsSh7sgcBdyoNAv4357m0b44f/35Y82IMeOM825cEGemCzq85v+1mJMpgccbuOgG3LA/dTuRGeuSRPQWE0zXiRJ0c2r/VqLgVjEbeTQxqbkOfixKkHKlwJ9j+iFkgOvp4NpwDtujRWJWtOYGidiboMJ4HTjDflEg220AvnKWqyptMk0jmVoQhVVf6xalBOqVSMn8w+hvMLGHPOu9qQFWkTPohwtcseZ/YCxshD9m4duG2iQE+iQE+iQE+iQE+iQE/+A4pOTibcecCkAAAAAElFTkSuQmCC)
            no-repeat center center;
          background-size: 100% 100%;
        }
      }
      .value {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #74b9ff;
        font-size: 32rpx;
        line-height: 52rpx;
        .val {
          font-weight: 700;
        }
        .unit {
          font-size: 28rpx;
          color: #999;
          padding-left: 6rpx;
        }
      }
      .key {
        padding-top: 12rpx;
      }
      &:nth-of-type(2) {
        background-color: rgba(126, 212, 135, 0.05);
        border-color: #7ed487;
        .value {
          color: #7ed487;
        }
        .img-wrapper {
          .iconimg {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOS0wMVQxNDoxNDoyMiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDktMDFUMTQ6MTc6MDErMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDktMDFUMTQ6MTc6MDErMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZjNjZjMxMzAtNDFlMS02ODQw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);
          }
        }
      }
      &:nth-of-type(3) {
        background-color: rgba(255, 193, 139, 0.05);
        border-color: #ffc18b;
        .value {
          color: #ffc18b;
        }
        .img-wrapper {
          .iconimg {
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOS0wMVQxNDoxNDozNCswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDktMDFUMTQ6MTc6MDkrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDktMDFUMTQ6MTc6MDkrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NWJhYTRlMDAtOTA4OS0xYzRk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);
          }
        }
      }
      &:not(:first-child) {
        margin-left: 8rpx;
      }
    }
  }
}
</style>
