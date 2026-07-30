<template>
  <van-nav-bar
      :id="componentConfig.id"
      :title="componentConfig.title"
      :class="'titleDirection_'+getTitleDirection"
      left-arrow
      v-on="$listeners"
  />
</template>

<script>
export default {
  name: "nva-bar-component",
  props: {
    componentConfig: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    },
    value: undefined,
    checked: undefined,
    modulePartId: String,
    id: String
  },
  data() {
    return {};
  },
  components: {},
  computed: {
    getTitleDirection(){
      return this.titleDirection||"mid"
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
