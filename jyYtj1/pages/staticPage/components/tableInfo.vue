<template>
  <div class="tableInfoOuter">
    <div class="title" :style="{ backgroundColor: ace936 || '00c0fa', color: ace937 || '#FFFFFF' }">
      常年免费培训安排表
    </div>
    <Mtable :tableData="tableData" @finish="finish" :config="config" :columns="columns" style="flex: 1" :time="time" />
  </div>
</template>

<script>
import Mtable from './Mtable.vue'
export default {
  name: 'tableInfo',
  props: {
    columns: {
      type: Array,
    },
    tableData: {
      type: Array,
    },
    time: {
      type: Number,
      default: 3000,
    },
    show: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default() {
        return {
          ace929: '1',
          ace931: '2',
          ace932: '8',
        }
      },
    },
  },
  components: {
    Mtable,
  },
  data() {
    return {
      ace936: '',
      ace937: '',
    }
  },
  mounted() {
    // this.$emit("end")
    if (this.tableData && this.tableData.length) {
      this.setStyle()
    }
  },
  watch: {},
  methods: {
    finish(data) {
      this.$emit('end', data)
    },
    setStyle() {
      const { ace936, ace937 } = this.config
      this.ace936 = ace936
      this.ace937 = ace937
    },
  },
}
</script>

<style scoped lang="less">
.tableInfoOuter {
  background: linear-gradient(0deg, hsla(0, 0%, 100%, 0.15), hsla(0, 0%, 100%, 0.76), hsla(0, 0%, 100%, 0.76));
  border-radius: 50px;
  width: 80%;
  height: 67%;
  position: absolute;
  padding: 0 30px 40px 30px;
  left: 7%;
  top: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    display: inline-block;
    text-align: center;
    padding: 10px 20px;
    // color: white;
    font-weight: 400;
    font-size: 20px;
    // background: linear-gradient(0deg, #264f8d, #00c0fa);
    border-radius: 50px;
    margin: 10px auto;
    letter-spacing: 5px;
  }
}
</style>
