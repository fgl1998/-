<template>
  <view class="ez-query-wrapper">
    <div class="title-decoration">{{ title }}</div>
    <div class="cell-wrapper">
      <block v-for="item in renderData" :key="item.id">
        <div class="cell d-f ai-c">
          <div class="label">{{ item.key }}</div>
          <div class="value df ai-c">
            <block v-if="item.type === 'picker'">
              <picker
                class="picker"
                :value="getIndex(item)"
                :disabled="item.disabled"
                :range="item.range"
                :mode="item.mode"
                :range-key="item.rangeKey"
                @change="handlePickerChange($event, item.id)">
                <div class="picker-value" v-if="item.value">
                  {{ item.range.filter((i) => i[item.valueKey] == item.value)[0][item.rangeKey] }}
                </div>
                <div class="picker-placeholder" v-else>
                  {{ item.placeholder }}
                </div>
                <div class="iconimg iconimg-arrow-right"></div>
              </picker>
            </block>
            <block v-else-if="item.type === 'radio'">
              <radio-group class="radio-group" @change="handleRadioChange($event, item.id)">
                <block v-for="item2 in item.range" :key="item2[item.valueKey]">
                  <label class="label d-f ai-c" :class="[item2[item.valueKey] === item.value ? 'checked' : '']">
                    <radio
                      class="radio"
                      :value="item2[item.valueKey]"
                      :checked="item2[item.valueKey] === item.value"></radio>
                    <div class="iconimg"></div>
                    <p>{{ item2[item.rangeKey] }}</p>
                  </label>
                </block>
              </radio-group>
            </block>
            <block v-else>
              <input
                class="input"
                :type="item.type"
                :value="item.value"
                :disabled="item.disabled"
                :maxlength="item.maxlength"
                :placeholder="item.placeholder"
                placeholder-style="color: #b2b2b2;"
                @input="handleInputInput($event, item.id)" />
            </block>
          </div>
        </div>
      </block>
    </div>
    <div class="btn-wrapper">
      <ComponentButton name="查询" height="72rpx" type="primary" @click="$emit('click')"></ComponentButton>
    </div>
  </view>
</template>

<script>
  /**
   * Input 输入框
   * @description input输入框组件
   */
  import ComponentButton from '@/components/common/ez-button/ez-button.vue'
  export default {
    name: 'ezQuery',
    props: {
      renderData: {
        type: [Array],
        default: () => {
          return []
        }
      },
      title: {
        type: [String],
        default: '查询条件'
      }
    },
    model: {
      prop: 'value',
      event: 'input'
    },
    components: {
      ComponentButton
    },
    data() {
      return {}
    },
    created() {},
    mounted() {},
    methods: {
      handlePickerChange(e, id) {
        const value = e.target.value
        const renderData = this.renderData
        renderData.forEach((item) => {
          if (item.id === id) {
            const i = item.range[value]
            this.$emit('change', id, i[item.valueKey], i)
          }
        })
      },
      handleRadioChange(e, id) {
        const value = e.target.value
        this.$emit('change', id, value)
      },
      handleInputInput(e, id) {
        const value = e.target.value
        this.$emit('change', id, value)
      },
      getIndex(item) {
        const range = item.range
        const valueKey = this.valueKey
        const value = item.value
        range.map((e, i) => {
          if (e[item[valueKey]] === value) {
            return i
          }
        })
      }
    },
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .ez-query-wrapper {
    background-color: #fff;
    border-radius: 12rpx;
    padding: 46rpx 40rpx 64rpx;
    .title-decoration {
      font-size: 32rpx;
      font-weight: 700;
      color: #3d424d;
      position: relative;
      line-height: 1;
      padding-left: 26rpx;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 8rpx;
        height: 32rpx;
        background-color: #3882ff;
        border-radius: 2rpx;
      }
    }
    .iconimg-arrow-right {
      width: 12rpx;
      height: 22rpx;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAsCAMAAABIQohxAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA/UExURUdwTDiC/ziD/z2K/zmD/ziC/zmD/zyG/0mc/ziD/zmE/4Tg/zqE/ziC/ziE/ziD/zmD/ziC/ziD/ziE/ziC/wHdj6UAAAAUdFJOUwD87hGX3oIgB8wzAkf2X6hRvrVtxY6xvQAAAMBJREFUOMuVlMsWhCAMQ0VQ0OK7//+ts6KlaI6OS+8hxjSlC6l7fniKAHCfAWAeCQA+PQA8zACwuwBgtzW+x0Juvve+kH63JE5yyPqmFIQcje91KaT1PQ8MfKdN5KxvosuJXERyy27P+EPkgs2bxiLnjia5LDG0mUoMtzFQACCF/6TAx9Uun/V7/UFXD4Y0EltBDdEM32vspuZVsuuH0VZlMCXW+hiXdeHyp4o+u1RgXb4vDlg1B5YTrTO6ANCV8QNKQhtnQwET9AAAAABJRU5ErkJggg==);
    }

    .cell-wrapper {
      width: 100%;
      padding-top: 24rpx;
    }
    .cell {
      height: 96rpx;
      border-bottom: 1px solid #ccc;
      padding-left: 24rpx;
      font-size: 30rpx;
      font-weight: 700;
      color: #4e5767;
      position: relative;
      .value {
        flex: 1;
        overflow: hidden;
        margin-left: 20rpx;
        .input,
        .picker {
          width: 100%;
          display: block;
          height: 100%;
          text-align: right;
          padding-right: 32rpx;
          position: relative;
          .picker-placeholder {
            color: #b2b2b2;
          }
          .iconimg {
            position: absolute;
            top: 50%;
            right: 6rpx;
            transform: translateY(-50%) rotate(90deg);
          }
        }
        .input {
          padding-right: 0;
        }
        .radio-group {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .label {
            margin-left: 80rpx;
            white-space: nowrap;
            &:first-child {
              margin-left: 0;
            }
            &.checked {
              p {
                color: #388eff;
              }
              .iconimg {
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAOw0lEQVR4Xu1dDawcVRX+zjwKaQOCGigqiJEINAoKSHe2tBGBtkALARJQRDBS5acQQKCBAjvDzBbbUH6DgiAlBAQUjQXpA1rkRyvsbP0BWrVAgkFslBoTreVHaHc+c+ftK6/te2/v7M7P3X0zyctLXs+c851zvs7cuffccwU9eJVc7gULk0QwCYIDQEwCMQHABAITLMF49RsS/Q0g3hHgnZB4V/2G+pHoZy2Il0msRYi1dU/W9Vq4pOsdcmmV+zANwDEUHBklG9glJb82KlII8TSAJ2oNrIQnYUq2MlHblQQo+zwwBKYJosTPSjHhrZKwEUA/gZUWsLLmyJpWN5j2711DgMk+P28JZgsxi0DZtEAqPALUKOgPiWWrHHnJRIzbYjKaAJNd7mftgFkkZgtwZDcEdBAjgadFsCzcjP5VnrxqKnYjCVBewClhiDkCnGVq4OLgInC3ZWFJ7Wp5Ps59WcgaRYCyx6NCYI4ITsvC+axtkHjQApbUXHkqa9sj2TOCAOUqZ5PR//aTTAlMyjiWiuDuWkWWpWynpfpcCWAv5KdkE+YTOLsl0h4UEOBOjsPCYL68npd7uRGg5PF8EVwBYK+8nDfE7joSi+qufD8PPJkToLSAUyXEfADH5eGwwTYfo4WF9avlN1lizJQAJZ+XCbA4Swe7zRaBeXVHrs8KdyYEKF3LiVaIxSTOyMqxbrYjgvtCC/PqV8n6tP1InQAllzPEwmIIDkrbmZ7ST6xmiHl1T1ak6VeqBCge+Z2nLu1XQmoEsD3eBsF5nYeg0ADi9sCVuWlEIhUClH0u48AqXXElFAEB+muOzE5I3RY1iRPA9rkawIFJAy30RRFYEziS6FgqUQLYPv8DYNciWalGYEPgyG5JWUiMALbPNwFMTApYoWfUCKwPHNkziRglQoBylctJzEgCUKFDLwIiWFGryEw96ZGlOiZAucqbSVzUKZDi/vgREMEttYpcHP/OD+7oiABlnwuJaEGnuHKKgACLao6otZW2rrYJUEzytBXvVG7qZLKoLQJE07t9WJ6KN4XStiLABma2M20cmwBqYUc2Y0Uxt99WntK7Sa0d7IAZcReQYhOgXOW9xapeennsRLNaRaxV5Mw4OmIRoHjvxwltPrJxxwPaBGhW8qzMx63CapwI0MI03coibQLYPvuLMq44achV9rHAEa3FOC0CNAs4v5erS4XxWBEgcYFOoWlLAqjSbWyCevSP9erdWAkwQHgdxmFaq5LzlgQo+7xjrNbtG5DEjiCofQc1R84ZTcmoBGju2Hm0IxTFzblGQATHj7YDaVQC2D5/Poa2a+WaqBSNLw0cOXkk/SMSQG3UpOCXKQIrVGcUASGOHmlD6ogEKHl8oFd36WYUd2PMqF3JdVe+NhygYQmg9uczxHPGeFAA6TgCYuHw4foTDEuAks8lvdKcoePI9YgC1aSi7sicbd3ZjgBRW5Y+vNIjfpvgxj0QPEpiRyEOgMDNC1TYwP7btqvZjgB2ld8BcWNeIHvI7tpQcOWqijw81KfJVZ5oEUtz8VNwSVCRm4ba3o4AJZ9PdVtDplyCObrRN9HArMCTPwwnZns8FoLHssatGlfVHTlqRAJErdiAF7MG1mP23lOt7Fr1AbJ9/hXAJ7P2PQS+MLSF3VZPALvKq0AsyBpUL9mj4JR6RX7Wyifb5zMAjmgll/i/C64OKnLtoN6tCFD2+bypTRgTD0QaComzA1d+qKPa9qn6Dn9CRzZJGdXMsubIlO0IUPZ5MIFh31lJAuhhXZcHjlyn41/eaywCHFJz5AWFdcsTwPZ5CYAbdBwoZLaOQNzafNvnLwAcn2McLw0cib70hhIgb1A5xqN90xTcUa/IuboabJ/qFfEtXfmU5B4NHDlhCwFcl9byPmwAsHNKBntV7UOBI1/Rda7sczGBy3TlU5R7a2YDu3qehNEToOxxJgVPpGiwF1U/ufcBOPanp0pDxznTvrCEOKbmyvKIALbH6yG4VMeRQgYQwe/eb+DY318j/9KJR7nK80mYVVNJ3BC4otr2AXaVdRCTdZwpZPBa2MBxui3gbY+nQ/Aj4+ImWBVUpDRAAJ//zfHUDeNiMwqgfwM4NnCkrgN6ssdZloWlIMbpyGcsszFw5EOiDliSPvwtY+PdaY44LnDlcR3wts/DgWjRZ3cd+Txk2MDeUvI4XXWbyANAN9kU4PSaIw/oYD7M52f7BpL/GR35vGRUVxexfV4I4Ja8QHSDXRFcUKvodfM+3OXHG31QS8CHdYFvF4ld5W1g0dBxpGSRcOquVHWSWb6R4/kWHgEwXUc+dxnB7eoJkM+qVO7eawAgbgpcUVPkWlfJ50MCnKIlbIbQs2J7rEOKT8Bh8nFP4Mg3dfNkV3kniG/ryhshR6xSBFgDweeMAGQICAEeqTlyoi6cksfrRDBPV94YOeKP6ivgNRF82hhQOQMh8euPfBgzHr9Q3tOBYvu8EsCWAgude0yRIfEXKfv8O4GPmQIqZxxrGg3M+K0nqutpy6vkc64AuZz10xKchoAA/1CDQHP6+wpWg7gfDayK8PdB1bF/XcOXJETWNTtt/VlHWXkBT2MIrXkBHX05yWxQn4HvGzFVSXiBK9dsGwi7ypNB3JZyH+K3AcwMHNHaDdWs6lXf+jvmlLhkzAo2GUEAAf5Uc2TEgWjJ56GiSJDW1wpxQuCK1jb4kktb+qJv/T2SyUKOWiICmPAKGOF//9DQTPsud9+0OVpSPTXJkAnwjZoj9+roPLzK/RuEqpzaT0e+C2Q2mDEI1CDAYDBLVV4nTOaTi4KL6xXRmgafcg33CPvwaC8tm0eDQEM+A+8KHNGeREmiwIKAX3dEa5/eoXdw3I7roY7B6amW+NFnoAkTQWoM8G4DU1/0RH2RaF12lScIcSvb2V0juDWoiFoE07psnz9J+tWjZThtITURZMpUMAUv1itycByfbZeHSB9uJjBN+z7i/sAV7U/Lnm6SFU0Fm7QYRLwRuLKPdjIBNAeHqsZdJ6naDRQVBtvjIgguj4Ony2SfNXI5uK+BfZ7z5I04wWx1eIXaEvX2eExfPU/UN3/Ly67ychCLWgp2s0BzOdjIghASR9ZdUUvV2lc0NSu4eduJLQKvYCccXb9c1H68llfZ4zkU/KClYPcLXGR0SZgQ59ZcuSNOnNXgsNngYt/mff9kA9PrnqjzDFtetk81z6AGfT1/RSVhXVAUemPgSKw9C2pwiL5on+NUAY6uOfIrnWw26yPVjOBOOvLdLhMVhSonuqAsfFngSKzNlGpwuHkTptZc0WrHMnkBv2iFWJbymoNJnBkoC48I0B0bQ17ta2B63MGhTsSnVLlvg+gXYH8d+Z6QGboxpNUI2iSH4xyGoIN78nx+1BoPdRZCSUe+V2QGt7QPbA71+SUCz3aLc3Fq9Ef1yaVl90XJP6ZbfE8KpwBHqLHRQH+AgUCoadhdkjKQth4C8+uOdPSdXqryASFOSxurgfo3Bg3shsHt4c2B4IMAvmog2JEhEbcHrsxtB7PtU5VytXVvO/YMu+fHgSMR8bd0COnW+jYB+q0G5sYZHNo+VRGnKuYckxeB8+uOqCqrDwhQ9nkgAa3JEgOjtoYW5uqclFUcfRcl/aCaI2u2IkBzMNjNbeL+J8Cc0TZwlj3OoeAuAwmcGaQR28RF44AeaBQ50uCw7PMsAksyi7SphkZrFNkrrWIJPCyN5o5nC0dQYAsw09ScZIlr1FaxCkjRLDrLdGRrq2Wz6OZroGgXn21esrOm0y6+ODAiu3xkbUnrwIjma6A4Mibr7KRsT/vImOhzsDg0KuV0ZK8+1qFR0VOgODYu+yylZDH2sXHRU6A4ODKldGSvtq2DI6MvguLo2OyzlbzF9o6OjZ4CVc4mobVrNnnchcYkItDR4dERCYrj45PIQy46Oj4+PnoNLOSnsAkrAeyVixeF0XYjsA7jMC2YL6+PpmDU4+MHbyx5PF/EsHbn7YZljNxH4oK627q7qRYBmgNCVTt33BiJX7e7qb0HUpsApQWcKmH0KiguwyMQp3JamwDR5JBPdcLEYsP9H9PwCMyrO3K9bhBiEaD5aXgviTN0DRRy2UVABPfVKnJmHIuxCVC6lhNlM1ZAcFAcQ4VsyhEgVnMHzKhfJevjWIpNgOhV4HKG9GF5HEOFbLoRaDa5jH3wR1sEKMYD6SYzrva47/2h+tsmQPRp6FE1bzwvLuBCPsEIdLA5RqHoiADRoNCnap82K0GXClWaEVCbYmqOzNYUH1asYwJETwKfakPJgZ0AKe6NHYE1gSMdD8QTIUCTBOZ0HY8dy667YUPgyG5JoE6MAE0SqD77E5MAVugYMQLrA0f2TCo+iRIgGhNUuVw1H0oKYKHngwio8x1rFUl0g0viBGiS4GYSFxXJSy4CIrilVpGLk9M4oCkVAjS/DhYSuCJpwGNR32A7lzR8T40ACmyxeNR5yjqZ5NGxnioBIhKoaWMLi4u1A510DJFRc/sh5tU9iT29G8dS6gSISHAtJ1ohFheriHqpUat6oYV5cRd29LRvLZUJAQZNFq+E1ilK+5G/LYJMCRA9DQYqi+YX5WXbkeExWlio0+amNY30JTInwJanwUChqfpKGOvVxutILNIp4NRPq75kbgRQEFXJuWzCfAJn60PuHUlVt89xWNiqdDtNj3MlwKBjzR1IZwE4KU1nDdK9VAR31yqimlPnehlBgC1E8HhUCMwR6c3unWqXrgUsqbnyVK5ZH2LcKAJsIcICTglDzBFAPRW6/lLNGSwLS2pXy/OmOWMkAQaDFLWr2QGzSMwW4EjTgjcaHtWQSQTLws3oX+XJq6ZiN5oAQ4MWtbATzBZiFoGyiQFVTRgp6A+JZasceclEjNti6hoCDAVe9nkwgS8DOAIDv3fOKdhvAVAHWz0rwDM1R17ICUfbZruSAEO9dV1aKyxMJzAdFqaBmJRi2/uNEKxFiJUCPDkjxJOeJ2Hb0Tfgxq4nwHAxVAdhwcIkEUyC4ICIFMQEABMITLAE49VvSPQ3gHhHgHdC4l31G+pHop+1IF4mo6SvrXt6x84ZkFdtCP8HuvoPfrYc8sQAAAAASUVORK5CYII=);
              }
            }
          }
          .radio {
            width: 0;
            height: 0;
            display: none;
          }
          .iconimg {
            width: 32rpx;
            height: 32rpx;
            transition: all 0.3s ease-in-out;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAQ+ElEQVR4Xu1db4xc1XX/nTvjXdmLWZIPmMQoDaaV86EklYwKgqCQ0BhTTEKlsiVF8e6bmTvTGGRiE4NRVUqKVDshmIBiw8ydmbfrlJY6lfLHC9hQEiICgqpIjcmHWC12ihyC+ZDEGNta7+491d2Zddfree++92Zm973dd6XV7O6cc+7583v33XfveecSFmCr1WqrtBafIOLVWtNqIqwGsAzgZQCZn6WN383/ptopgE4BfBrg5u84xYxDQvAhZjokhP5lPp8/vNDcRUk3aM+ePX2nT+vrMxm+hZmvBcgEe0mX7BoH+BARvTI5SfuWLhUvbdiw4WSX+poTsYkEQK1W+5TW9Blm+iwRbgGQmRNvnd/JJDP2EfFPhOCf5vP5n8+THpG7TQwAyuX6VQDflMmIdcy4KrLFXWQkwuuTk3o/QM+VSrnXu9hVx0THGgBJCLpXJJIChlgCoFIZWU+ki8DU8L4Q2j5mUSkWB0fjZkysALAAAz873rEDQiwA0KXATwJ0BOAjRDjMjLeJ+D2t+b1sdsmxyUm819uL90yExsZwcSaDiycmxlcIQRcz08VE+BgzVgF0GcCXdXiiGRsgzCsAXNf9+MQE3w+QGe7bba8CeBHAj3t6xOHBwcG32xU4k39kZORjZ87oVQA+B+AGANe0L58r2SxtdxznV+3LiiZh3gCgVO1OILMN4EujqY63ALzAjJ8uWYKXHMd5N6KcSGyu614yPo7rifAZAJ8HcHkkQaCjwOQOKfO7ovG3xzXnAKjVRj6ttb4fwJ9HUP1dgM1EarS//4LRgYGByQgyOs6yd+/ezPHjH6wHsB4g83lJhE6eFUJsz+cHfxaBNzLLnAKgUql/jYgejqDtPq3x9NjYidFNmza9H4F/zlgef/zxC3t7l68XArdHeYph5q3FYu5bc6XwnABAKbWCKPswM74c0rDYTJZC6j1FHnVyS4TvMk9slVIei9JvGJ6uA6Bcrq0VQpir/pMhFEt04GfbGREIB7XWW0ul/PMh/BaatKsACDvkm9UzrWlnsTi0N7QlCWCoVIYHhOAtYZayu31L6BoAlBreDfBXgsWFjwH0SH9/3864TOyC6R2eqjFhPLkF4HsAWhFMAj0h5dDGYLThqLoCgErFHSXCzQFV2SWE3rkQ99r97G/mLGwBcGcQPzHjmWLRMU8YHW0dB4BS7kEAV9i15OMANkuZc+20C5dCqboD4FGA+gNY+aaUTpi5lFVkRwGglPt7AEEMea0RfMd8LvqmlHt1AwQwn7Z2XErnIhtR0O87BgClXLMSF+CeRq7WyzaXSgNmBEhb0wPl8t5+IU49CrAZEWztmJROlMWm8+R2BADV6vABZl5r0xrAA1I6DwWgW7QkSrl/B+AfbA4goucLhaEbbXS279sGQLXqfpsZd9s6YsY9xaKz00aXfm8WkNwtRHjE5gsiPFYoOF+10fl93xYAlHK3A9hmV4BvlTL3QztdSjHtAaXqXwToBwE8skNKx+ytRGqRARB0kUcIvTKfz78TSbtFzlSr1T6qtfi1zQ3tLBZFAkBzefeATbHx8Z4Pb9x4x+9sdOn33h7YvfupDy1Zcua3Nh9prW+MsmwcGgBmYwfImvVpy/MoXSnl0Bs2xdPv7R5QangNwP9poTwITKwNu4EUGgDVqrvHtqtHhIFCwfme3bSUIqgHqlX3Nmb47pGYXcRCwdkQVKahCwWAIPd9ZmwrFp1vhFEipQ3mgUrFvY8IO/yow84HAgOgmcnzsr+q5Eo5lAtmTkoVxQNKDddti0VCiOuCZhYFBoBS7jOWNK7XtO5bl67wRQlrcJ7GiuHJ/ZZl42eldAJtxgUCQCOBU3zHW02zsUPr0rX94IFsh7Kxd8DmFTSffRd9V5BEUysAGqnb9LJ/9i7nFvuuXjsBjcLb2EWkujcvHc1m+TpbyrkVAErVy5a8/V1SOndFMSLlac8DSrlmVPbJJ+CKlLmSXy++AGjmsu3zGfqPCcHXLLZkjvbC1jnuRlIJveqXWcQsbvF7J9EXAEq5P7KkNt8rpRMlzbtzXljkkpRytwL4po8b9knpfMHre08A2K5+k8B54YV91y70HL6448vkGL7//slX/BJN/UYBTwDYrn5m+quFmr0b96DP1s9kGxPxv0YZBVoCwHb1A/AdVpLmwIWgr/2CbT0XaAmAqMIWgiOTakPUi/Y8AJiyLEKQX7JmevXHFCW2C1drvnp27aLzAKCU+/cAHvSy0fZYEVPfLAq1AowCD0rpfH2mM84DQLXqvuYzo0yv/phDyW8UME9uhYJzTur5OQCwDf9a445SyfnnmPtgUatXLrt/LQSe8nLC7NvALADUHhRCmFtAq/bu6dMnVsf9/fxFHX0Apj7B0qXLD3kVqdBaf71Uyp+9xZ8DAP/hn6tS5uRid3AS7FeqrgAqtNJ19m3gLACUUmuArE/eWZranYTgGx3tKeUTV0opp/I1zwKgWq3fy0xeqVxv9ff3rU6XfZMBgeYr6OY20LJwFRHfVyjkpvYPZgDAPcCMlq93EUEVCk4nSrklw4MLQMtq1a0wo+UtmwjPFwrO1GtlUwCo1WrLtabfAyRa2c4Mp1h0hheAXxaNCZWKO0QEj1fvWQvBF+Xz+RNTAFCq/pcAeaZx9/SISwcHB61vqCwa7ybA0JGRkZVnzuij3qrybVLm/q0JALcKIO9B/IaUzpUJsDlVcZYHlHLNpH6Nh2NqUjqF6RHgTYD+uPXwz98sFnP3pd5Nngcqlfo3iOje1przL6TMXTE9ApzxOWbls1I6LyXP/FRjpdzrAfzEwxPjUjo91CxWZOrutmw9PeIPOl14OQ3N3HigWeD6f716E0JfTkq5pmaveemjVZuU0snOjbppL93wgFLuhE+p+5upWq1vZiaPyh30P1IO/VE3FEtlzo0HlBr+b4D/sFVvRLyFKhX3SSJ45Y6/IKUTpPbP3FiT9hLaA0q55lV+U87+vMaMsrkFmEmCmSyc14hQLhScvwnda8oQGw9Uq+6TzJ4X+EsGAOZ4sz/10PhvpXT+MTbWpIqE9oCl6th/kFJ1zzUAIpaFQs4sEqUtoR7wrzjGvzAjgHkENGfhtLhH6C8Wi3nzdlDaEuqBcrleEoKe9FD/MCk1/A7AH2lFkMlkrs7lNiTiBMyExqfratdqw3dozf/UuiP6jRkBfOr7ZlZJueFI17VMO+iaB6pV91ZmfN+jg+MGAJ7LwL29mQuSfjp21zybEMFKueYR0OvUkfEUAAkJZFQ1gwAgvQVE9W4C+ALcAtJJYALiGFnFIJPA9DEwsnvjzxjgMTBdCIp/GKNrGGQhKF0Kju7f2HMGWApON4NiH8U2FLRuBqXbwW14NwGs1u3gNCEkAVFsQ0VrQkiaEtaGdxPAak0JS5NCExDFiCoGSgo1sv32AwCkaeERAzDfbIHSwhsA8F4LAPCQlM4D821M2n94DyjlmvMHzTmELdqMF0MsjwqvSulcG777lGO+PaCU+wqAa1rpMZ3vOfVmULk8fLMQPOqlcDaLjziOY46GTVtCPOC67iUTE/iNl7pa0/pSaeiZKQDs2bOnb2xs0pzlm2k5WDC+VCw6TyfE9lRNTJ0+ejsR/sXDGZO9vZl+k+txtkBEpeJ+nwi3ejA8KaXzldSzyfGAUu4TAFqm9DPjB8Wi8xfGmhk1guqbAHrMw8S0RExyYg9biRiA75Yy9/g5AKjVap/SWvyXt51pkaikYMBWJEoI/Sf5fP7n5wDA/JGWiUtKiP31jFQmrvE0kBaKTDoE2ioUmZaKTXr4zUXcRqlY+20gPSgi7hBpq1h0gNsA0nLx8YWArVz87DrB500CGwBID4yIb4htkz//U94CHRhhurCdPJGOAvGDiO3q9zrnKT00Kn6xjKRR1Is2PTYukrvjxdTxY+OMebYhJT04Mh4g6NrBkUHmAgDSo2PnGQddOzo2yCgAcHp49DwCoOuHRzdGgfT4+HmMsW/XXT8+3vTuuu7HJyboZYAv9daGc1LmPGrTx9V9ydZLqboDUN3bCjqazfJ1juP8ys9S3+PjpxmVqt0JiO/4AOA4QOukdPxOHE22x2OkvVLu1QDvB6jfWy19l5T5XTa1AwGgOSE09YRNXWGv9prWfetKpQGTWpa2LnmgXN7bL8TJ/QDOOQByVnfPSuncHESFwACo1UY+rbV+2V8ouVIO5YJ0nNJE84BSw3WAHT9uIcR1+fzgz4L0EBgARlilUv8aET1sEfyAlM5DQTpPacJ5wPKq95QwZt5aLOa+FVRyKAAYodWqu4cZX/brgBn3FIuORwXyoKqldDM94F/ooUFJhO8WCs6GMJ4LDQCl1Aoga8qOfdK/ozSHMEwg/GhtOX5N3oPAxFop5bEw/YYGgBFeLtfWCiEO2DoSQq/M5/Pv2OjS7709UKvVPqq1sJ7YprW+sVTKe9UD9OwgEgBCzAcwPt7z4Y0b7/hdGuTwHti9+6kPLVly5rc2zrD3/ZnyIgPACFFqeDfAAV4YoSulHJo6qzZtwTyg1PAagH3Ocp6WQ09IObQxmNTzqdoCQGMkcEeJYH3mJMJAoeB4Hk4Z1YCFyFeturcxY6/NNmY8Uyw66210ft+3DYDGSOAeBHCFTRFmbCsWHa8Dqm3si+L7SsW9jwg7Ahj7ppSOZSJul9IRADRB4FNy9py7jqv1ss3piuG5wWms8J161LbI0+Q6LqVzkT28doqOAaAJAvMK+Qp7tzB7BpvTvYOGpxpr+3jUsrw77dZjUjqXBPBxIJKOAsD0WK0OH2DmACeNsdkz2LzYdxEbu3om+H4bO41YEtHzhcLQ1LHvnWodB0ADBO63mXF3QCV3CaF35vP5wwHpFwRZszjXFgB3BjGICI8VCs5Xg9CGoekKAJrD2nYA24Ipw8cAeqS/v2/nwMDAZDCeZFI1X93eAvA9AAW5XRpDd0jp3N8Ni7sGAKNswM2js3aZRFOtaWexOGR9BOqGM7ot02TvCsFbmHFV0L7aWeQJ0kdXAWAUaC4bmx3EMI8s+5hFpVgc9KxbFMS4uNA0M6yLAG4JodNBrfXWKMu7Ifr4/wohYZjC0poNJKLsw7ZdxBZyEw2EiIGf2tVjntgadmMnbFwMfddHgJlKhb0lzODdpzWeHhs7Mbpp06b3oxg6Vzzm/fze3uXrhcDtIa/4KRW7PeTP9sOcAsB03swsMhMav/Qyr3i9C0yVsxvt779gNC4TxsbE7gOzJLseIPMZ5Tn9WSHE9qCZPJ0C9JwDYFrxRqJpZpt/trGvmW8R4cda49XeXvHC4OCgdcu0U04zckZGRlaOjenPC4FrmPE5AJdHk09HgckdQRI4o8n355o3ABi1GinnfD9AZoLUbnuDmV8koud6esThwcHBt9sVOJO/WXh5FTPfREQ3AFjTvnyuZLO03Za63X4/3hLmFQDTakWdLFkcMwnQEYCPEOEwM37NjJPMfDKbFR+YT/P31ESI0EdEfRMT+gLz2fgbK5nNmcp0GcCXeRXRjBic2ExuYwGALgMhYoy6whabwE9bFysALGAgxC7wsQbAtHLNcjXriHBTmNWzrly7IYWaVU1mPKc17y+VcrE9gT2WI0ArXxswAHxTJiPWxRUMJuiTk9q8svVcnIM+07+JAcBMpZVSa4gyNwB0AzP/GUAi5AXaIXLWRPTvAL/IPPmilDJxeY+JBMDM6NVqteVa043m5VSArwJoNYAlHYrwbDHjAB8C6HXzcqYQfCCfz5/oUl9zIjbxAGjlpeZe+yeIeLXWtJoIBhTLAF4GkPlZ2vjd/G+qnQLoFMCnAW7+jlPMOCQEH2KmQ0LoXy7EnIX/A1WJUjTIou/2AAAAAElFTkSuQmCC)
              no-repeat center center;
            background-size: 100% 100%;
            margin-right: 12rpx;
          }
          p {
            transition: all 0.3s ease-in-out;
            color: rgba(78, 87, 103, 1);
            font-size: 28rpx;
            font-weight: 500;
          }
        }
      }
    }
    .btn-wrapper {
      padding-top: 64rpx;
    }
  }
</style>
