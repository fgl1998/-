<template>
	<div>
		<div class="header">
			<div></div>
			<div>{{date}}</div>
		</div>
		<div class="content">
			<div class="contentBox">
				<div class=top>
					<div class="top-left">
						<div>
							<div>
								<div class="nan"></div>
								<div>男厕所</div>
							</div>
							<div>
								<div class="nv"></div>
								<div>女厕所</div>
							</div>
						</div>
						<div>
							<div class="qian"></div>
							<div>前室</div>
						</div>
					</div>
					<div class="top-main">
						<div>此区域为大楼外侧区域</div>
						<div>（无内容显示）</div>
					</div>
					<div class="top-right">
						<div class="louti"></div>
						<div>楼梯</div>
					</div>
				</div>
				<div class="main">
					<div class="main-left">
						<div>
							<div class="louti"></div>
							<div>楼梯</div>
						</div>
						<div>
							<div class="zhao"></div>
							<div>招聘面试室</div>
						</div>
						<div>
							<div class="zhao"></div>
							<div>招聘面试室</div>
						</div>
						<div>
							<div class="qia"></div>
							<div>洽谈室</div>
						</div>
						<div>
							<div class="qia"></div>
							<div>洽谈室</div>
						</div>
					</div>
					<div class="main-main">
						<div class="main-main-top">
							<ul>
								<li @click="showVR(1)">
									<div></div>
									<div>VIP招聘室1</div>
								</li>
								<li @click="showVR(1)">
									<div></div>
									<div>VIP招聘室2</div>
								</li>
								<li @click="showVR(1)">
									<div></div>
									<div>VIP招聘室3</div>
								</li>
								<li @click="showVR(1)">
									<div></div>
									<div>VIP招聘室4</div>
								</li>
								<li @click="showVR(1)">
									<div></div>
									<div>VIP招聘室5</div>
								</li>
								<li @click="showVR(1)">
									<div></div>
									<div>VIP招聘室6</div>
								</li>
								<li @click="showVR(2)">
									<div></div>
									<div>直播间</div>
								</li>
								<li>
									<div></div>
									<div>洽谈室</div>
								</li>
							</ul>
							<div>
								<ul class="uls">
									<li>
										<div></div>
										<div>自动一体机</div>
									</li>
									<li>
										<div></div>
										<div>自动一体机</div>
									</li>
									<li>
										<div></div>
										<div>自动一体机</div>
									</li>
									<li>
										<div></div>
										<div>自动一体机</div>
									</li>
									<li>
										<div></div>
										<div>自动一体机</div>
									</li>
									<li>
										<div></div>
										<div>自动一体机</div>
									</li>
								</ul>
							</div>
						</div>
						<div class="main-main-bot">
							<div class="main-sleep">
								<div>
									<div></div>
									<div>休息等待区域</div>
								</div>
								<div>
									<ul>
										<li></li>
										<li></li>
										<li></li>
										<li></li>
										<li></li>
										<li></li>
										<li></li>
									</ul>
								</div>
							</div>
							<div>此区域为过道区域</div>
						</div>
					</div>
					<div class="main-right">
						<div>
							<div></div>
							<div>电子显示屏</div>
						</div>
						<div>
							<div class="main-dai">
								<div></div>
								<div>接待室</div>
								<ul>
									<li></li>
									<li></li>
									<li></li>
									<li></li>
									<li></li>
									<li></li>
								</ul>
							</div>
							<div class="main-ping">
								<div></div>
								<div>项目评估室兼会议室</div>
								<div></div>
							</div>
							<div class="main-chu">
								<div></div>
								<div>储藏室</div>
							</div>
						</div>
					</div>
				</div>
				<div class="footer">
					<ul>
						<li>
							<div></div>
							<div>人事档案室</div>
						</li>
						<li class="footer-main">
							<div>
								<div></div>
								<div>仓库</div>
							</div>
							<div>
								<div></div>
								<div>人事代理办</div>
							</div>
							<div>
								<div></div>
								<div>市场招聘办</div>
							</div>
						</li>
						<li>
							<div></div>
							<div>楼梯</div>
						</li>
						<li>
							<div class="foot-main">
								<div>
									<div></div>
									<div>前室</div>
								</div>
								<div class="rencai">
									<div>
										<div></div>
										<div>人才中心（68人）</div>
									</div>
									<div>
										<div v-for="item in person" :key="item"></div>
									</div>
								</div>
								<div class="hou">
									<div>
										<div></div>
										<div>人事候考室</div>
									</div>
									<div>
										<div v-for="item in person1" :key="item"></div>
									</div>
								</div>
							</div>
							<div class="foot-bottom"></div>
						</li>
						<li>
							<div>电井</div>
						</li>
						<li>
							<div></div>
							<div>消防前室</div>
						</li>
						<li>
							<div></div>
							<div>楼梯</div>
							<div>+</div>
							<div>电梯</div>
						</li>
						<li>
							<div>
								<div>
									<div></div>
									<div>二号计算机教室（34人）</div>
								</div>
								<div>
									<div v-for="item in person2" :key="item"></div>
								</div>
							</div>
							<div></div>
						</li>
						<li>
							<div class="ban-Room">
								<div></div>
								<div>办公室</div>
							</div>
							<div class="ban-Room">
								<div></div>
								<div>办公室</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!--电子社保卡-->
		<uni-popup ref="electronicSocialPopup" type="center" :animation="false">
			<div class="popup-box2">
				<div class="code-box">
					<iframe id="qrIframe" :src="imgUrl" width="1200" height="800" scrolling="no" frameborder="0"></iframe>
				</div>
				<button class="btn btn-blue" @click="close">关闭</button>
			</div>
		</uni-popup>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				date:'2020-12-09',
				person:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
				person1:[1,2,3,4,5,6,7,8,9,10,11,12],
				person2:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
				imgUrl:'',
			}
		},
		methods:{
			toPage(type){
				this.$utils.navigateTo('/pages/vrPage/vrPages/vrPages?type='+type);
				// if (!this.isLogin) {
				// 	this.$utils.showModal("提示", "当前处于[游客模式],是否进行用户登录?", true, succ => {
				// 		this.$utils.navigateToLogin();
				// 	}, fail => {
				
				// 	})
				// } else {
				// 	this.$utils.navigateTo('/pages/vrPage/vrPages/vrPages?type='+type);
				// }
			},
			close() {
				this.$refs.electronicSocialPopup.close();
			},
			showVR(type){
				if(type==1){
					this.imgUrl='http://localhost:8080/minifast/template/gzytj/#/pages/vrPage/vrPages/vrPages?type=1'
				}else{
					this.imgUrl='http://localhost:8080/minifast/template/gzytj/#/pages/vrPage/vrPages/vrPages?type=2'
				}
				// 打开全景图弹窗
				this.$refs.electronicSocialPopup.open()
			}
		}
	}
</script>

<style lang="scss" scoped>
	ul>li{
		list-style-type: none;
	}
	.header{
		width: 1920px;
		height: 100px;
		background-image: url('../../../static/images/viewer/header.png');
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0px 40px 0px 40px;
	}
	.header>div:first-child{
		width: 499px;
		height: 40px;
		background-image: url('../../../static/images/viewer/title.png');
		background-repeat: no-repeat;
	}
	.header>div:last-child{
		width: 235px;
		height: 40px;
		color: #ffffff;
		font-size: 24px;
	}
	.content{
		width: 1920px;
		height: 956px;
		background-color: #d8edff;
		padding-top: 35px;
	}
	.contentBox{
		width: 1839px;
		height: 920px;
		background-image: url('../../../static/images/viewer/boxBg.png');
		background-repeat: no-repeat;
		background-size: cover;
		margin: 0 auto;
	}
	.top{
		padding: 25px 0px 0px 35px;
		display: flex;
		align-items: center;
		text-align: center;
	}
	.top-left{
		width: 157px;
		height: 177px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.top-left>div:first-child>div{
		width: 85px;
		height: 71px;
		background-image: url('../../../static/images/viewer/sex.png');
		padding-top: 13px;
		color: #333333;
		font-size: 18px;
	}
	.top-left>div:first-child>div:first-child{
		margin-bottom: 9px;
	}
	.top-left>div:last-child{
		width: 65px;
		height: 117px;
		background-image: url('../../../static/images/viewer/bg_qianshi.png');
		padding-top: 60px;
	}
	.nan{
		background-image: url('../../../static/images/viewer/nan.png');
	}
	.nv{
		background-image: url('../../../static/images/viewer/nv.png');
	}
	.nan,
	.nv,
	.qian,
	.louti,
	.zhao,
	.qia,
	.main-main-top>ul>li>div:first-child,
	.uls>li>div:first-child,
	.main-sleep>div:first-child>div:first-child,
	.main-right>div:first-child>div:first-child,
	.main-dai>div:first-child,
	.main-ping>div:first-child,
	.main-chu>div:first-child,
	.footer>ul>li:first-child>div:first-child,
	.footer-main>div>div:first-child,
	.footer>ul>li:nth-child(3)>div:first-child,
	.foot-main>div:first-child>div:first-child,
	.rencai>div:first-child>div:first-child,
	.hou>div:first-child>div:first-child,
	.footer>ul>li:nth-child(6)>div:first-child,
	.footer>ul>li:nth-child(7)>div:first-child,
	.footer>ul>li:nth-child(8)>div:first-child>div:first-child>div:first-child,
	.ban-Room>div:first-child{
		width: 30px;
		height: 30px;
		background-size: cover;
		margin: 0 auto;
		background-repeat: no-repeat;
	}
	.qian{
		background-image: url('../../../static/images/viewer/qianshi1.png');
	}
	.louti{
		background-image: url('../../../static/images/viewer/louti.png');
	}
	.top-main{
		width: 1401px;
		height: 100px;
		margin-left: 39px;
		background-image: url('../../../static/images/viewer/dalou.png');
		padding-top: 77px;
	}
	.top-main>div:first-child{
		font-weight: bolder;
		color: #333333;
	}
	.top-main>div:last-child{
		font-size: 12px;
		color: #999999;
	}
	.top-right{
		width: 84px;
		height: 120px;
		margin-left: 100px;
		background-image: url('../../../static/images/viewer/bg_louti1.png');
		padding-top: 52px;
	}
	.main{
		display: flex;
		text-align: center;
		padding: 16px 0px 0px 35px;
	}
	.main-left{
		width: 157px;
	}
	.main-left>div{
		width: 122px;
		height: 69px;
		padding-top: 10px;
		background-image: url('../../../static/images/viewer/bg_qia.png');
		background-size: cover;
		margin-top: 12px;
	}
	.main-left>div:first-child{
		background-image: url('../../../static/images/viewer/bg_louti1.png');
		height: 78px;
		padding-top: 22px;
		width: 157px;
		margin-top: 0px;
	}
	.zhao{
		background-image: url('../../../static/images/viewer/zhao.png');
	}
	.qia{
		background-image: url('../../../static/images/viewer/qia.png');
	}
	.main-main{
		width: 1401px;
		height: 130px;
		margin-left: 39px;
	}
	.main-right{
		width: 154px;
		margin-left: 30px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.main-main-top>ul,
	.uls,
	.main-sleep>div:last-child>ul,
	.main-dai>ul,
	.footer>ul{
		overflow: hidden;
		padding-inline-start:0px;
	}
	.main-main-top>ul>li{
		float: left;
		width: 153px;
		height: 60px;
		background-image: url('../../../static/images/viewer/bg_zhao.png');
		margin-right: 7px;
		overflow: hidden;
		padding: 24px 0px 0px 15px;
	}
	.main-main-top>ul>li:nth-child(7),.main-main-top>ul>li:nth-child(8){
		padding-left: 35px;
		width: 133px;
	}
	.main-main-top>ul>li>div:first-child{
		float: left;
		background-image: url('../../../static/images/viewer/zhao1.png');
	}
	.main-main-top>ul>li>div:last-child{
		height: 30px;
		line-height: 25px;
		float: left;
		margin-left: 12px;
		color: #333333;
		font-size: 18px;
	}
	.uls>li{
		float: left;
		width: 152px;
		height: 41px;
		background-image: url('../../../static/images/viewer/bg_auto.png');
		margin-right: 7px;
		margin-top: 12px;
		overflow: hidden;
		padding: 9px 0px 0px 16px;
	}
	.uls>li>div{
		float: left;
	}
	.uls>li>div:first-child{
		background-image: url('../../../static/images/viewer/auto.png');
		margin-right: 15px;
	}
	.main-main-bot{
		padding-top: 54px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.main-main-bot>div:first-child{
		width: 692px;
		height: 234px;
		background-image: url('../../../static/images/viewer/bg_sleep.png');
	}
	.main-main-bot>div:last-child{
		width: 690px;
		height: 233px;
		background-image: url('../../../static/images/viewer/guodao.png');
		font-size: 16px;
		font-weight: bolder;
		color: #333333;
		text-align: center;
		line-height: 233px;
	}
	.main-sleep>div:first-child{
		padding-top: 25px;
		overflow: hidden;
	}
	.main-sleep>div:first-child>div:first-child{
		background-image: url('../../../static/images/viewer/sleep.png');
		margin-left: 268px;
		float: left;
	}
	.main-sleep>div:first-child>div:last-child{
		float: left;
		font-size: 18px;
		color: #333333;
		margin-left: 12px;
	}
	.main-sleep>div:last-child>ul{
		padding-top: 25px;
	}
	.main-sleep>div:last-child>ul>li{
		float: left;
		width: 63px;
		height: 112px;
		background-image: url('../../../static/images/viewer/zhuoyi.png');
		margin-left: 33px;
	}
	.main-sleep>div:last-child>ul>li:first-child{
		margin-left: 25px;
	}
	.main-right>div:first-child{
		width: 58px;
		height: 193px;
		background-image: url('../../../static/images/viewer/bg_dianzi.png');
		padding-top: 22px;
	}
	.main-right>div:first-child>div:first-child{
		background-image: url('../../../static/images/viewer/dianzi.png');
	}
	.main-right>div:first-child>div:last-child{
		width: 30px;
		margin: 14px auto 0 auto;
	}
	.main-right>div:last-child{
		width: 85px;
	}
	.main-dai{
		height: 174px;
		padding-top: 12px;
		background-image: url('../../../static/images/viewer/bg_jie.png');
		margin-bottom: 12px;
	}
	.main-dai>div:first-child{
		background-image: url('../../../static/images/viewer/jie.png');
		margin-bottom: 5px;
	}
	.main-dai>ul{
		width: 58px;
		height: 87px;
		margin: 12px auto 0 auto;
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
	}
	.main-dai>ul>li{
		width: 21px;
		height: 21px;
		background-image: url('../../../static/images/viewer/tea.png');
	}
	.main-ping{
		height: 165px;
		padding-top: 29px;
		background-image: url('../../../static/images/viewer/bg_ping.png');
	}
	.main-chu{
		height: 68px;
		margin-top: 12px;
		padding-top: 8px;
		background-image: url('../../../static/images/viewer/bg_chu.png');
	}
	.main-ping>div:first-child{
		background-image: url('../../../static/images/viewer/dianzi.png');
	}
	.main-ping>div:nth-child(2){
		width: 55px;
		margin: 6px auto 11px auto;
	}
	.main-ping>div:last-child{
		width: 49px;
		height: 18px;
		background-image: url('../../../static/images/viewer/tou.png');
		margin: 0 auto;
	}
	.main-chu>div:first-child{
		background-image: url('../../../static/images/viewer/chu.png');
	}
	.footer>ul>li{
		float: left;
		text-align: center;
		font-size: 18px;
	}
	.footer>ul>li:first-child{
		width: 73px;
		height: 180px;
		background-image: url('../../../static/images/viewer/bg_dang.png');
		margin-left: 35px;
		padding-top: 23px;
	}
	.footer>ul>li:first-child>div:first-child{
		background-image: url('../../../static/images/viewer/dang.png');
	}
	.footer>ul>li:first-child>div:last-child{
		width: 30px;
		margin: 10px auto 0px auto;
	}
	.footer>ul>li:nth-child(2){
		padding-top: 40px;
	}
	.footer-main{
		overflow: hidden;
	}
	.footer-main>div{
		width: 89px;
		height: 108px;
		background-image: url('../../../static/images/viewer/bg_daili.png');
		padding-top: 25px;
		float: left;
		margin-left: 11px;
	}
	.footer-main>div:first-child{
		width: 73px;
		height: 124px;
		background-image: url('../../../static/images/viewer/bg_cang.png');
		padding-top: 39px;
	}
	.footer-main>div:first-child>div:first-child{
		background-image: url('../../../static/images/viewer/cang.png');
	}
	.footer-main>div:nth-child(2)>div:first-child{
		background-image: url('../../../static/images/viewer/daili.png');
	}
	.footer-main>div:nth-child(3)>div:first-child{
		background-image: url('../../../static/images/viewer/shichang.png');
	}
	.footer>ul>li:nth-child(3){
		width: 68px;
		height: 137px;
		background-image: url('../../../static/images/viewer/bg_louti1.png');
		margin-left: 12px;
		padding-top: 55px;
	}
	.footer>ul>li:nth-child(3)>div:first-child{
		background-image: url('../../../static/images/viewer/louti.png');
	}
	.footer>ul>li:nth-child(3)>div:last-child{
		width: 30px;
		margin: 9px auto 0px auto;
	}
	.foot-main{
		overflow: hidden;
	}
	.foot-main>div{
		float: left;
	}
	.foot-main>div:first-child{
		width: 65px;
		height: 122px;
		background-image: url('../../../static/images/viewer/bg_qianshi.png');
		margin-left: 11px;
		padding-top: 40px;
	}
	.foot-main>div:first-child>div:first-child{
		background-image: url('../../../static/images/viewer/qianshi1.png');
	}
	.foot-main>div:first-child>div:last-child{
		width: 30px;
		margin: 6px auto 0px auto;
	}
	.rencai{
		width: 364px;
		height: 145px;
		background-image: url('../../../static/images/viewer/bg_rencai.png');
		padding-top: 17px;
		margin-left: 11px;
	}
	.rencai>div:first-child{
		overflow: hidden;
		margin-left: 92px;
	}
	.rencai>div:first-child>div{
		float: left;
	}
	.rencai>div:first-child>div:first-child{
		background-image: url('../../../static/images/viewer/rencai.png');
	}
	.rencai>div:last-child{
		width: 311px;
		height: 76px;
		margin: 11px auto 0px auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.rencai>div:last-child>div{
		background-image: url('../../../static/images/viewer/rencai1.png');
		background-repeat: no-repeat;
		width: 40px;
		height: 20px;
		background-position: center;
		margin-bottom: 8px;
	}
	.hou{
		width: 171px;
		height: 162px;
		background-image: url('../../../static/images/viewer/bg_hou.png');
		margin-left: 11px;
	}
	.hou>div:first-child{
		overflow: hidden;
		padding-top: 16px;
		margin-left: 17px;
	}
	.hou>div:first-child>div{
		float: left;
	}
	.hou>div:first-child>div:first-child{
		background-image: url('../../../static/images/viewer/hou.png');
	}
	.hou>div:last-child{
		width: 134px;
		height: 83px;
		margin: 12px auto 0px auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.hou>div:last-child>div{
		width: 30px;
		height: 25px;
		background-image: url('../../../static/images/viewer/houPerson.png');
		background-repeat: no-repeat;
		background-position: center;
		margin-bottom: 8px;
	}
	.foot-bottom{
		width: 621px;
		height: 26px;
		background-image: url('../../../static/images/viewer/2.png');
		margin-left: 11px;
		margin-top: 4px;
	}
	.footer>ul>li:nth-child(5){
		width: 78px;
		height: 93px;
		background-image: url('../../../static/images/viewer/jing.png');
		margin-left: 12px;
		padding-top: 98px;
	}
	.footer>ul>li:nth-child(5)>div{
		width: 30px;
		margin-left: 29px;
	}
	.footer>ul>li:nth-child(6),
	.footer>ul>li:nth-child(7){
		width: 78px;
		background-image: url('../../../static/images/viewer/bg_louti1.png');
		margin-left: 11px;
	}
	.footer>ul>li:nth-child(6){
		height: 158px;
		padding-top: 34px;
	}
	.footer>ul>li:nth-child(7){
		height: 137px;
		padding-top: 55px;
	}
	.footer>ul>li:nth-child(6)>div:first-child{
		background-image: url('../../../static/images/viewer/fang.png');
	}
	.footer>ul>li:nth-child(6)>div:last-child{
		width: 30px;
		margin: 6px auto;
	}
	.footer>ul>li:nth-child(7)>div:first-child{
		background-image: url('../../../static/images/viewer/dianti.png');
	}
	.footer>ul>li:nth-child(8){
		width: 349px;
		height: 163px;
		background-image: url('../../../static/images/viewer/bg_classRoom.png');
		margin-left: 6px;
	}
	.footer>ul>li:nth-child(8)>div:first-child{
		overflow: hidden;
		padding-top: 17px;
	}
	.footer>ul>li:nth-child(8)>div:first-child>div:first-child>div{
		float: left;
	}
	.footer>ul>li:nth-child(8)>div:first-child>div:first-child>div:first-child{
		background-image: url('../../../static/images/viewer/classRoom.png');
		margin-right: 13px;
		margin-left: 57px;
	}
	.footer>ul>li:nth-child(8)>div:first-child>div:last-child{
		width: 296px;
		height: 79px;
		margin: 16px auto 0px auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.footer>ul>li:nth-child(8)>div:first-child>div:last-child>div{
		width: 42px;
		height: 21px;
		background-image: url('../../../static/images/viewer/nao.png');
		background-repeat: no-repeat;
		background-position: center;
		margin-bottom: 8px;
	}
	.ban-Room{
		width: 84px;
		height: 75px;
		background-image: url('../../../static/images/viewer/bg_room1.png');
		margin-left: 5px;
		text-align: center;
		padding-top: 15px;
		margin-top: 8px;
		margin-bottom: 2px;
	}
	.ban-Room>div:first-child{
		background-image: url('../../../static/images/viewer/ban1.png');
	}
	.popup-box2 {
	background: #FFFFFF;
	border-radius: 14px;
	padding: 20px;
	
		.login-code{
			display: none;
			position: fixed;
			top:0;
			left:0;
			right:0;
			bottom: 0;
			background: rgba(0,0,0,.5);
			z-index: 99;
		}
		
		.code-dialog{
			background: #ffffff;
			border-radius: 8px;
			padding:24px;
			position: absolute;
			top:50%;
			left:50%;
			transform: translate(-50%,-50%);
		}
		
		.code-close{
			position: absolute;
			right:10px;
			top:10px;
			width: 30px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			color:#666666;
			border: 1px solid #eeeeee;
			border-radius: 4px;
		}
		
		.code-box{
		
		}
	
		.btn {
			width: 160px;
		}
	}
</style>