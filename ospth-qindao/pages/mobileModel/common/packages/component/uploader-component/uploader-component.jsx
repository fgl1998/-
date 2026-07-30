export default {
	name: "uploader-component",
	props: {
		componentConfig: {
			type: Object,
			required: true,
			default: () => {
				return {
				};
			}
		}
	},
	data() {
		return {
			fileList: [],
			eventMap: {}
		};
	},
	methods:{
		afterRead(file){
			const this_ = this.getVue()
			let result = true
			if (this.eventMap.afterRead){
				eval(this.eventMap.afterRead)
			}
			if (!result){
				return
			}
			this.fileList.push(file)
			file.status = 'uploading'
			let submitParameter = {
				// url: 'http://127.0.0.1:10086/formcenter/demo/uploadFile',
				url: this.componentConfig.uploadUrl,
				data: {
					file: file, //文件参数，可以是文件数组
				},
				//文件提交时，采用FormData方式提交参数
				isFormData: true,
			}
			this_.submit(this.componentConfig.uploadUrl, {
				file: file.file
			},(res)=>{
				if (res.success){
					file.status = 'done'
				}else {
					file.status = 'failed'
				}
			},{isFormData: true,isRemote:true})
		},
		beforeRead(file){
			let result = true
			if (this.eventMap.beforeRead){
				eval(this.eventMap.beforeRead)
			}
			return result
		},
		beforeDelete(file){
			let result = true
			if (this.eventMap.beforeDelete){
				eval(this.eventMap.beforeDelete)
			}
			return result
		},
		onOversize(file){
			Toast(`文件超过${this.componentConfig.maxSizeNum}${this.componentConfig.maxType=='2'?"MB":"KB"}，无法上传`)
		},
		onDelete(file){
			let result = true
			if (this.eventMap.beforeRead){
				eval(this.eventMap.beforeRead)
			}
			if (!result){
				return
			}
			let index = this.fileList.indexOf(file)
			if (index > -1) {
				this.fileList.splice(index, 1)
			}
		},
		setFunctions(restItem){
			if (!restItem.eventList||restItem.eventList.length<1){
				return
			}
			restItem.eventList.forEach((item)=>{
				this.eventMap[item.eventType] = item.textarea
			})
		}
	},
	render() {
		const { $listeners, $props, $attrs, $scopedSlots, } = this
		if (this.componentConfig.value == null){
			this.componentConfig.value = ''
		}
		const {
			componentConfig: {
				type,
				fieldType,
				span,
				display,
				style,
				name,
				...restItem
			},
			modulePartId,
			...restProps
		} = $props
		this.setRestItem(restItem)
		this.setFunctions(restItem)
		const event = {}
		event.oversize = this.onOversize
		event.delete = this.onDelete
		if (restItem.maxSizeNum){
			if (restItem.maxType=='2'){
				restItem.maxSize = restItem.maxSizeNum*1024*1024
			}else {
				restItem.maxSize = restItem.maxSizeNum*1024
			}
		}
		let uploadProps = {
			props: {
				...restProps,
				...restItem,
				fileList: this.fileList,
				afterRead: this.afterRead,
				beforeRead: this.beforeRead,
				beforeDelete: this.beforeDelete,
			},
			attrs: {
				...$attrs,
				style
			},
			on: {
				...event
			},
			scopedSlots: $scopedSlots,
		};
		const slots = {}
		slots.input = ()=>{

			return <van-uploader
				{...uploadProps}
			>
			</van-uploader>
		}
		let fieldProps = {
			props: {
				...restItem
			},
			on: {
				...$listeners,
			},
			scopedSlots:slots
		}
		return (
			<van-field {...fieldProps}>
			</van-field>

		);
	}
};
