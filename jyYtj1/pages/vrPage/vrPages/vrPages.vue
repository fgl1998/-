<template>
	<div id="viewer"></div>
</template>

<script>
	import {Viewer} from 'photo-sphere-viewer'
	import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
	import {MarkersPlugin} from 'photo-sphere-viewer/dist/plugins/markers'
	import 'photo-sphere-viewer/dist/plugins/markers.css';
	export default {
		data(){
			return{
				viewer:'',
				imgurl1:require('../../../static/images/viewer/link1.jpg'),
				imgurl2:require('../../../static/images/viewer/link2.jpg'),
				defaultImg:'',
				flag:true,
			}
		},
		onLoad(data){
			if(data.type==2){
				this.defaultImg=this.imgurl2
				this.flag=false
			}else{
				this.defaultImg=this.imgurl1
				this.flag=true
			}
		},
		mounted() {
			let _this=this;
			//创建一个全景图对象
			this.viewer=new Viewer({
				container:document.querySelector(('#viewer')),
				panorama:this.defaultImg,
				size:{
					width:'100vw',
					height:'100vh'
				},
				autorotateLat:0,
				autorotateSpeed:0.20943951023931962,//自传速度
				defaultZoomLvl:0,//默认缩放
				defaultLong:0.0027446609001040845,//经度
				defaultLat:0.015220228499811306,//纬度
				autorotateDelay:1,//1毫秒后启动自动旋转
				plugins:[
					[MarkersPlugin,{
						markers:[
							{
								id:'circle1',
								tooltip:'A circle of radius 30',
								circle:30,
								svgStyle:{
									fill:'rgba(255,255,0,0.3)',
									stroke:'yellow',
									strokeWidth:'2px',//边框
								},
								visible:_this.flag,//编辑的初始可见性，默认true
								longitude:-1.5,
								latitude:-0.28,
								anchor:'center right',
							},{
								id:'circle2',
								tooltip:'circle2',
								circle:30,//直径
								svgStyle:{
									fill:'rgba(255,255,0,0.3)',
									stroke:'red',
									strokeWidth:'2px',//边框
								},
								visible:!_this.flag,//编辑的初始可见性，默认true
								longitude:-1.6,
								latitude:-0.28,
								anchor:'center right',
							},{
								id:'circle3',
								tooltip:'circle3',
								rect:{width:100,height:100},//矩形宽高
								svgStyle:{
									fill:'rgba(194,29,18,1)',
									cursor:'help',
								},
								visible:false,//编辑的初始可见性，默认true
								longitude:-1.9,
								latitude:-0.28,
							},{
								id:'circle4',
								tooltip:'circle4',
								x:2058,
								y:1069,
								html:"HTML <b>marker</b>&heart;",
								anchor:"bootm right",
								scale:[0.5,1.5],
								style:{
									maxWidth:"100px",
									color:"white",
									fontSize:"20px",
									textAlign:"center",
								},
								visible:false,//编辑的初始可见性，默认true
							}
						]
					}]
				]
			});
			//实例化获取插件实例，从而调动插件方法和事件
			const markersPlugin=this.viewer.getPlugin(MarkersPlugin);
			//启用/禁用自动旋转是触发
			this.viewer.on('autorotate',(e,enabled)=>{
				if(!enabled){
					setTimeout(()=>{
						this.viewer.toggleAutorotate();//开启自动旋转/不旋转
					},5000)
				}
			});
			//标记点击事件
			markersPlugin.on('select-marker',(e,marker)=>{
				//console.log(marker.id);
				const markerid=marker.id;
				_this.viewer.animate({
					longitude:marker.config.longitude,
					latitude:marker.config.latitude,
					zoom:100,
					speed:'-2rpm',
				}).then(()=>{
					markersPlugin.hideMarker(marker.id);
					if(markerid=='circle1'){
						//setPanorama参数：图片地址，下一个场景的初始经纬度，transition默认（false）
						_this.viewer.setPanorama(_this.imgurl2,{longitude:6.232589417434965,latitude:0.07016253709436304},true).then(()=>{
							markersPlugin.showMarker("circle2")//显示你需要显示的marker
						});
					}
					if(markerid=='circle2'){
						//setPanorama参数：图片地址，下一个场景的初始经纬度，transition默认（false）
						_this.viewer.setPanorama(_this.imgurl1,{longitude:6.113027338614143,latitude:-2.91436084993627e-9},true).then(()=>{
							markersPlugin.showMarker("circle1")//显示你需要显示的marker
						});
					}
					_this.viewer.zoom(0)//改变缩放
				})
			});
			this.viewer.on('click',(e, data)=>{
			// console.log(`${data.rightclick?'right':''}clicked at longitude:${data.longitude} latitude:${data.latitude}`);
			// console.log(e);
			// console.log(data)
			})
		},
		beforeMount() {
			
		},
	}
</script>

<style>
</style>