<template>
	<common-layout :step-map="stepMap"></common-layout>
</template>

<script>
	import ENUMS from '@osppm/common/enum.js'
	import one from './parts/one/one.vue'
	import two from './parts/two/two.vue'
	import three from './parts/three/three.vue'
	import four from './parts/four/four.vue'
	import five from './parts/five/five.vue'
	export default {
		name: 'LoanApply',
		components: {
			one, two, three, four, five
		},
		data() {
			return {
				stepMap: [
					{
						title: '贷款关联人信息',
						component: one,
						previous: ENUMS.STEP.GO_BACK,
						next: ENUMS.STEP.ONE,
					},
					{
						title: '贷款房屋信息',
						component: two,
						previous: ENUMS.STEP.ZERO,
						next: ENUMS.STEP.TWO,
					},
					{
						title: '贷款基本信息',
						component: three,
						previous: ENUMS.STEP.ONE,
						next: ENUMS.STEP.THREE,
					},
					{
						title: '首付款转账清单',
						component: four,
						previous: ENUMS.STEP.TWO,
						next: ENUMS.STEP.FOUR,
					},
					{
						title: '抵押信息',
						component: five,
						previous: ENUMS.STEP.THREE,
						next: ENUMS.STEP.FINISH,
					},
				]
			}
		}
	}
</script>
<style scoped>
</style>
