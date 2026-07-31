<template>
	<view>
		<!-- 展示地图 -->
		<view  class="map">
			<!-- <busmap :lineCode="lineCode" ></busmap> -->
			<baidu-map style="width: 375px; height:800px; z-index: 1;" :center="startposition" :zoom="7"
				:scroll-wheel-zoom="true">
				
				<bm-marker :position="markerPoint" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" :icon="{url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif', size: {width: 300, height: 157}}">
					<bm-info-window :show="infoWindowShow" >我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门我爱北京天安门</bm-info-window>
				</bm-marker>
			</baidu-map>
			 
			<view @click="test" class="test" >
				
				<uni-segmented-control :current="current" :values="items" :style-type="styleType"
						:active-color="activeColor" @clickItem="onClickItem" />
			</view>
		</view>
	</view>
</template>

<script>
	import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
	import BmView from 'vue-baidu-map/components/map/MapView'; //地图视图
	import BmLocalSearch from 'vue-baidu-map/components/search/LocalSearch'; //搜索
	import BmMarker from 'vue-baidu-map/components/overlays/Marker'; //点标注
	import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'; //标注弹窗
	export default {
		data() {
			return {
				
				//地图相关
				startposition: {
					lng: 87.617733,
					lat: 43.792818
				},
				
				markerPoint: {
					lng: 87.617733,
					lat: 43.792818
				},
				infoWindowShow: false,
				
				//选项卡
				items: ['招聘岗位', '选项卡2', '选项卡3'],
				current: 0,
				styleType: 'button',
				activeColor: '#007aff',
			}
		},
		
		mounted() {
		},
		
		methods: {
			test(){
				let point = {
					lng:104.09055, 
					lat:30.59498
				}
				
				this.startposition = point
				this.markerPoint = point
				this.infoWindowShow = true
			},
			
		}
	}
</script>

<style>
.map {
	position: relative;
}

.test{
	position: absolute;
	top: 10px;
	right: 136px;
	z-index: 2;
	
	height: 500px;
	width: 400px;
	background-color: #ffffff;
}

</style>
