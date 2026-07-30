<template>
  <div style="display: inherit;">
    <component
        :is="`${componentConfig.type}-component`"
        :componentConfig="componentConfig"
        :value="currentValue"
        :ref="componentConfig.name"
        :checked="checked"
        v-on="listeners"></component>
  </div>
</template>

<script>
// 同步引入基础组件
const requireComponent = require.context("../packages/component", true, /\w+-component\.(vue|jsx)$/);
let components = {}; // 组件注册obj
// 基础组件添加在组件注册obj
requireComponent.keys().map(fileName => {
  let component = requireComponent(fileName).default;
  components[component.name] = component;
});
export default {
  name: "commonWidget",
  props: {
    // 组件的配置数据
    componentConfig: {
      type: Object,
      required: true
    },
    // ta-form-item设置进来的value
    value: undefined,
    // ta-form-item设置进来的checked，应对特殊组件
    checked: Boolean
  },
  data() {
    return {
		currentValue:this.value
	};
  },
  components: components,
  computed: {
    getEvents() {
      let listenersObj = {};
      if (Array.isArray(this.componentConfig.eventList)) {
        this.componentConfig.eventList.forEach(event => {
          if (event.methodType + "" === "1") {
            if (listenersObj.hasOwnProperty(event.eventType)) {
              if (listenersObj[event.eventType].endsWith(";")) {
                listenersObj[event.eventType] += `\n${event.textarea}`;
              } else {
                listenersObj[event.eventType] += `;\n${event.textarea}`;
              }
            } else {
              listenersObj[event.eventType] = event.textarea;
            }
          }
        });
      }
      return listenersObj;
    },
    listeners() {
      let events = {};
      if (window.location.href.indexOf("mobileModel") > 0) {
        for (let key in this.getEvents) {
          events = {
            [key]: ($event) => {
              this.$nextTick(() => {
                let this_ = window.$self;
                eval(this.getEvents[key]);
              });
            }
          };
        }
      }
      return events;
    }
  },
  mounted() {
	  
  },
  methods: {},
  watch: {}
};
</script>

<style scoped>

</style>
