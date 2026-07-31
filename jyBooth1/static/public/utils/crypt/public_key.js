// 存储不同渠道端的公钥

const public_keys = [{
	area: 'xas',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABJV4BuS4Ywc0heLzHFLHOroY9KrLBIVihhYyWDiL4KKxuEavuPR0ROOq
KgoSwXbsT1FbH6zd1d7LFZzFyU3CD8s=`
}, {
	area: 'ytq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABPSNACpkPuWrcqXGRxg2SMt2AOk596WhhU09hbPKe5n6DeWIuKSpqe2w
2rWYy5c1CIOF++mrZ+rV18p7yf6k9dA=`
}, {
	area: 'xcq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABGZf/X3UhWbtYh1+ZLmIMsGq0Xn8UMEPqUSUX8L1X7bUwKdS6KNboGsZ
hRxnx0IRsHquaZrWBpcIg+b2wTyEbBI=`,

}, {
	area: 'lhq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABEZLYkLqnGYPDJHkeJn4C11Ko0JLDong/YZUPuoM4bfJzQtOuQoxqpmq
KN9kvExw5eRhq7qieLcSbN2pHxG7TaU=`,

}, {
	area: 'blq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABEe31QGoPsAYAqv5p3cluEiK402Z7XzeN4fxh39XrgY48x1YIgsXgT6a
clxm80Oijl1uNxNkZh65H5GyRBFrUik=`,

}, {
	area: 'wyq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABCCMVKVTazoEJm+JkkgigwejzcHEuxXHGfS44ODjqdIgI40ky1fTfLdf
StgvXo6s950G7pKbmnhPskacfQA4Cw4=`,

}, {
	area: 'bqq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABGpn1XXZFdomyaunGdt80aA9RrWjsCSJjU2zTEoxWSXb7w2EBPMGVycM
dx90yi7ZA4gbkeB35KaXnwIr9AaUCTM=`,

}, {
	area: 'ylq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABEnOHu1R3AlN3XYYMLMKA9mHuBTjGsydIqwhggM94ZgZuTeR2J9UJazO
Lg757NZIGQADHfVjlf7MeX4vJOAI/UE=`,

}, {
	area: 'caq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABAQp9yw2Eu+OnpgrSqrjqkrPsUv0O2UGqfzwuTwA+kAcPA4N0KQe9yzm
2XfZIpuHfeWfyn4bliQ+Aze699FbEAk=`,

}, {
	area: 'ltq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABDWnUfEBM9/bQ6R+xC1D5W/I/GYoxfAo89HHPVW+3asz7K2K4CPlU+yM
UFvQZ9BCyAHd1sWaQ6iXcrdbUHUHeMI=`,

}, {
	area: 'glq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABCOEd2ggNCNtyEIPFvyWQNNOq+Hgo4kKYs7h0ypBusj2tPLpaORHUN+Z
yHwvTHtcxyTynpwnmEMiFDyOYACufeA=`,

}, {
	area: 'hyq',
	public_key: `MIIBMzCB7AYHKoZIzj0CATCB4AIBATAsBgcqhkjOPQEBAiEA/////v//////////
//////////8AAAAA//////////8wRAQg/////v////////////////////8AAAAA
//////////wEICjp+p6dn140TVqeS89lCafzl4n1FauPkt28vUFNlA6TBEEEMsSu
LB8ZgRlfmQRGajnJlI/jC7/yZgvhcVpFiTNMdMe8Nzai9PZ3nFm9zuNraSFT0KmH
fMYqR0AC3zLlITnwoAIhAP////7///////////////9yA99rIcYFK1O79Ak51UEj
AgEBA0IABDcfny5Lg0/moYdWtJF7+8H3cSRxLNuW74CDyA7qm95l8A/aPSNtZas4
G++pGmYE+g3gwFL7t81kTx88HnSDwHk=
	`,

}]

/**
 * 获取渠道公钥
 * @param {Object} channelCode 例如'xas'
 */
function getPublicKeyByArea(channelCode) {
	let public_key = {}
	public_key = public_keys.find(item => item.area == channelCode)
	// 没匹配到默认返回xas公钥
	return public_key ? public_key.public_key : public_keys[0].public_key
}

export default {
	getPublicKeyByArea
}