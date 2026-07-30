<!--  -->
<template>
  <div class="materialuploadtable">
    <ta-big-table border show-overflow :data="materailList">
      <ta-big-table-column field="yap521" title="材料名称" show-overflow>
        <template #default="{ row }">
          {{ row.yap521 }}
          <ta-popover v-if="row.yap522" trigger="hover" placement="right">
            <ta-icon slot="reference" type="info-circle" />
            <template slot="content">
              <div>
                <span v-for="item, i in row.yap522.split('\n')" :key="i">
                  {{ item }}<br>
                </span>
              </div>
            </template>
          </ta-popover>
        </template>
      </ta-big-table-column>
      <ta-big-table-column field="yap524" title="是否必需" collection-type="yesorno" show-overflow />
      <ta-big-table-column field="yap529" title="上传要求"
        :title-help="{ message: '当“是否必需”为“是”或者已经至少上传了一个文件时，“上传要求”所描述的限制才会生效。' }" :formatter="formatRequirement"
        show-overflow />
      <ta-big-table-column field="satisfied" title="是否已满足上传要求" show-overflow>
        <template #default="{ row }">
          {{ row.satisfied ? '是' : '否' }}
        </template>
      </ta-big-table-column>
      <ta-big-table-column field="status" title="状态" show-overflow>
        <template #default="{ row }">
          {{ row.total === 0 ? '未上传' : '已上传' + row.total + '个文件' }}
        </template>
      </ta-big-table-column>
      <ta-big-table-column field="operate" title="操作">
        <template #default="{ row }">
          <template>
            <!-- 始终显示上传按钮，无论是否为编辑模式 -->
            <ta-upload name="file" :multiple="true" :accept="accept" :action="uploadUrl"
              :before-upload="(file) => beforeUpload(file, row)" :showUploadList="false" :headers="uploadHeader"
              @change="handleChange($event, row)">
              <ta-button type='default' style="color: #3e82c7;border-color: #3e82c7;">上传</ta-button>
            </ta-upload>
            <!-- 始终显示查看按钮，无论是否为编辑模式 -->
            <ta-button type='default' v-if="row.total > 0" style="color: #44c7ba;border-color: #44c7ba;"
              @click="handlePreview(row)">查看</ta-button>
            <ta-button v-else type='default' :disabled="true">无可操作项</ta-button>
          </template>
        </template>
      </ta-big-table-column>
    </ta-big-table>

    <!-- viewer图片预览（隐藏的图片列表，点击查看时打开） -->
    <ul v-show="false" :id="viewerId">
      <li v-for="(item, index) in viewerItems" :key="index">
        <img :alt="item.alt" :data-original="item.imgSrc" :src="item.imgSrc" />
      </li>
    </ul>
    <!-- 悬浮操作按钮：删除 / 下载（跟随viewer当前图片） -->
    <div v-if="previewActionVisible" class="viewer-action">
      <span v-if="!currentIsImage" class="not-support">该文件不支持预览， 你可以下载原文件到你的设备来打开</span>
      <ta-icon type="delete" style="font-size: 18px;color: #606266;margin-right: 10px;cursor: pointer"
        @click="handleDeleteCurrent" />
      <ta-icon type="download" style="font-size: 18px;color: #606266;cursor: pointer" @click="handleDownloadCurrent" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'materialUploadTable',
  props: {
    yda020: {
      type: String,
      required: true,
    },
    yda031: {
      type: String,
      default: ""
    },
    visit: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ".jpg,.jpeg,.png,.gif,.bmp,.webp"
    },
    // 外部传入的材料数据，用于编辑模式下显示已有材料
    externalMaterialData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      materailList: [],
      previewImage: '',
      previewVisible: false,
      previewRow: {},
      viewer: null,
      previewActionVisible: false,
      viewerCurrentIndex: 0,
      viewerItems: [],
      currentIsImage: true,
      uploadUrl: this.Base.getBasePath() + '/api/file/uploadFileByUcm', // 图片上传地址
      previewUrl: this.Base.getBasePath() + '/api/file/downloadFileByUcm', // 图片预览地址
      uploadHeader: {
        // 材料上传header
        'TERMINAL-JTOKEN': this.Base.getCookie('TERMINAL-JTOKEN') || '',
        channelCode: this.Base.getChannelCode(),
      },
      viewerId: '', // 唯一的viewer容器ID
    }
  },
  created() {
    // 生成唯一的viewer容器ID（使用时间戳+随机数组合，避免依赖Vue内部属性）
    this.viewerId = 'materialViewer_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
  },

  watch: {
    yda020: {
      handler(newVal, oldVal) {
        // 只有当外部没有提供材料数据时，才调用接口获取
        if (!this.externalMaterialData || this.externalMaterialData.length === 0) {
          this.getMaterailList();
        }
      },
      immediate: true,
    },
    // 监听外部传入的材料数据变化
    externalMaterialData: {
      handler(newData) {
        if (newData && newData.length > 0) {
          console.log('使用外部传入的材料数据:', newData);
          // 处理外部传入的数据，确保数据结构一致
          const processedData = newData.map((item) => {
            // 确保files数组存在
            if (item.files === undefined) {
              item.files = [];
            }
            // 初始化fileList数组
            if (item.fileList === undefined) {
              item.fileList = [];
            }
            // 设置文件总数
            item.total = item.files.length;
            // 计算是否满足上传要求
            this.extendSatisfied(item);
            console.log(item,'item??????');
            return item;
          });
          this.materailList = processedData;
          console.log('处理后的材料列表:', this.materailList);
        }
      },
      immediate: true,
      deep: true // 深度监听，确保数组内的对象变化也能被捕获
    }
  },
  methods: {
    getMaterailList() {
      // 如果有外部传入的数据，优先使用外部数据
      if (this.externalMaterialData && this.externalMaterialData.length > 0) {
        console.log('已有外部材料数据，跳过接口调用');
        return;
      }

      let param = {
        no: "005-0002",
        data: JSON.stringify({ yda020: this.yda020, yda031: this.yda031 })
      }
      this.Base.sendRequest("", param, (res) => {
        if (res.serviceSuccess) {
          res.data.forEach((item) => {
            // 为组件数据填充是否已满足上传要求字段
            if (item.files === undefined) {
              item.files = [];
            }
            if (item.fileList === undefined) {
              item.fileList = [];
            }
            item.total = item.files.length;
            this.extendSatisfied(item);
          })
          this.materailList = res.data;
        }
      })
    },
    // 重置组件状态
    reset() {
      this.materailList = [];
      this.previewImage = '';
      this.previewVisible = false;
      this.previewRow = {};
      this.viewerItems = [];
      this.currentIsImage = true;
      // 如果有外部数据，重新处理外部数据
      if (this.externalMaterialData && this.externalMaterialData.length > 0) {
        this.$nextTick(() => {
          const processedData = this.externalMaterialData.map((item) => {
            const newItem = { ...item };
            if (newItem.files === undefined) {
              newItem.files = [];
            }
            if (newItem.fileList === undefined) {
              newItem.fileList = [];
            }
            newItem.total = newItem.files.length;
            this.extendSatisfied(newItem);
            return newItem;
          });
          this.materailList = processedData;
        });
      }
    },
    // 为组件数据填充是否已满足上传要求字段
    extendSatisfied(row) {
      const { total, yap524 } = row;
      if (yap524 === '0') {
        if (total === 0) {
          row.satisfied = true;
        } else {
          this.formatSatisfied(row);
        }
      } else {
        if (total === 0) {
          row.satisfied = false;
        } else {
          this.formatSatisfied(row);
        }
      }
    },
    formatSatisfied(row) {
      const { total, yap528, yap529 } = row;
      if (!yap529 || yap529 <= 0) {
        row.satisfied = true;
      } else {
        if (yap528 === 'eq') {
          row.satisfied = yap529 === total;
        } else if (yap528 === 'ge') {
          row.satisfied = total >= yap529
        } else if (yap528 === 'le') {
          row.satisfied = total <= yap529;
        } else {
          row.satisfied = true;
        }
      }
    },
    // 是否图片文件
    isImageFile(file) {
      const name = (file && (file.name || file.fileName)) || '';
      const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
      return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
    },
    // 图片预览（统一在 viewer 弹框内提示非图片）
    handlePreview(row) {
      console.log(row,'999999999');
      const files = row.files || [];
      this.previewRow = { ...row };
      const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="white"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="%23606266">该文件不支持预览</text></svg>';
      this.viewerItems = files.map((f) => {
        const isImg = this.isImageFile(f);
        const fileId = f.fileid || f.fileId;
        const imgSrc = isImg ? (this.previewUrl + '?isFile=false&fileId=' + fileId) : placeholder;
        return { isImage: isImg, imgSrc, alt: f.name || '文件' };
      });
      this.$nextTick(() => {
        const el = document.getElementById(this.viewerId);
        if (!el) return;
        if (this.viewer) { try { this.viewer.destroy(); } catch (e) { } this.viewer = null; }
        const self = this;
        this.viewer = new Viewer(el, {
          url: 'data-original',
          toolbar: true,
          navbar: true,
          title(e) { return e.alt; },
          viewed() {
            self.previewActionVisible = true;
            self.viewerCurrentIndex = self.viewer.index || 0;
            const item = self.viewerItems[self.viewerCurrentIndex];
            self.currentIsImage = !!(item && item.isImage);
          },
          hide() { self.previewActionVisible = false; }
        });
        this.viewer.show();
      });
    },
    beforeUpload(file, item) {
      return new Promise((resolve, reject) => {
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isLt20M) {
          this.$message.error(`${file.name} 文件大小不能超过 20MB!`);
          reject(); // 不允许上传
        } else {
          resolve(); // 允许上传
        }
      })
    },
    handleChange({ file, fileList }, item) {
      console.log('上传状态:', file.status, file, fileList);
      if (file.status === 'uploading') {
        console.log('文件正在上传...');
      }
      if (file.status === 'done') {
        item.fileList = fileList;
        const { code, message, data } = file.response || {};
        if (code === 200) {
          this.$message.success('上传成功');
          // 添加新上传的文件到files数组
          item.files.push({ ...file.response.data, name: file.name });
          // 更新total和satisfied状态
          item.total = item.files.length;
          this.extendSatisfied(item);
          console.log('上传后文件总数:', item.total, '是否满足要求:', item.satisfied);
        } else {
          this.$message.error(message || '上传失败');
          item.fileList = fileList.filter((f) => f.uid !== file.uid);
        }
      }
      if (file.status === 'error') {
        this.$message.error('上传出错');
        item.fileList = fileList.filter((f) => f.uid !== file.uid);
      }
    },
    check() {
      for (let i = 0; i < this.materailList.length; i++) {
        const { yap524, yap521, files, total, satisfied } = this.materailList[i];
        const length = files && files.length ? files.length : 0;
        if (yap524 == '1' && length !== total) {
          this.$message.error(`${yap521}是否上传完整，请检查！`);
          return false;
        }
        if (!satisfied) {
          this.$message.error(`必传材料：[${yap521}]未上传！`);
          return false;
        }
      }
      // 移除不必要的字段，返回材料列表
      const filteredList = this.materailList.map(item => {
        const filtered = { ...item };
        delete filtered.fileList;
        return filtered;
      });
      console.log('材料验证成功，返回的材料列表:', filteredList);
      return filteredList;
    },
    // 填充上传要求字段
    formatRequirement({ row }) {
      const { yap528, yap529 } = row;
      if (!yap529 || yap529 <= 0) {
        return '暂无要求';
      }
      switch (yap528) {
        case 'eq':
          return `必须且只能上传${yap529}个文件`;
        case 'ge':
          return `至少要上传${yap529}个文件`;
        case 'le':
          return `上传文件数不能超过${yap529}个`;
        default:
          return '暂无要求';
      }
    },
    handleDelete(index, file) {
      // 如果不存在yda030，说明还没上传到服务器，前端直接删除
      if (!file.yda030) {
        this.previewRow.files.splice(index, 1);
        this.viewerItems.splice(index, 1);
        this.previewRow.total = this.previewRow.files.length;
        this.extendSatisfied(this.previewRow);
        // 同步更新到 materailList
        this.syncPreviewRowToMaterailList();
        this.$message.success('删除成功');
        if (this.previewRow.files.length === 0) {
          try { this.viewer && this.viewer.hide(); } catch (e) { }
        } else {
          this.$nextTick(() => {
            try {
              this.viewer && this.viewer.update();
              const nextIndex = Math.min(index, this.previewRow.files.length - 1);
              this.viewer && this.viewer.view(nextIndex);
              const item = this.viewerItems[nextIndex];
              this.currentIsImage = !!(item && item.isImage);
            } catch (e) { }
          });
        }
        return;
      }
      let param = {
        no: '005-0003',
        data: JSON.stringify({ yda030: file.yda030, id: file.fileid })
      }
      this.Base.sendRequest("", param, (res) => {
        if (res.serviceSuccess) {
          this.previewRow.files.splice(index, 1);
          this.viewerItems.splice(index, 1);
          this.previewRow.total = this.previewRow.files.length;
          this.extendSatisfied(this.previewRow);
          // 同步更新到 materailList
          this.syncPreviewRowToMaterailList();
          this.$message.success('删除成功');
          if (this.previewRow.files.length === 0) {
            try { this.viewer && this.viewer.hide(); } catch (e) { }
          } else {
            this.$nextTick(() => {
              try {
                this.viewer && this.viewer.update();
                const nextIndex = Math.min(index, this.previewRow.files.length - 1);
                this.viewer && this.viewer.view(nextIndex);
                const item = this.viewerItems[nextIndex];
                this.currentIsImage = !!(item && item.isImage);
              } catch (e) { }
            });
          }
        }
      })
    },
    handleDownload(file) {
      const url = this.previewUrl;
      const fileId = file.fileid || file.fileId;
      const fileName = file.name || (this.previewRow.yap521 ? `${this.previewRow.yap521}` : '下载文件');
      this.Base.downloadFile({
        type: 'application/octet-stream',
        fileName: fileName,
        url: url,
        options: {
          isFile: false,
          fileId: fileId
        },
      }).then(() => {
        this.$message.success('下载成功');
      }).catch(() => {
        this.$message.error('下载失败');
      })
    },
    // 悬浮按钮：删除当前预览图片
    handleDeleteCurrent() {
      const index = this.viewerCurrentIndex || 0;
      const file = this.previewRow.files && this.previewRow.files[index];
      if (!file) return;
      this.handleDelete(index, file);
    },
    // 悬浮按钮：下载当前预览图片
    handleDownloadCurrent() {
      const index = this.viewerCurrentIndex || 0;
      const file = this.previewRow.files && this.previewRow.files[index];
      if (!file) return;
      this.handleDownload(file);
    },
    // 将previewRow的更新同步到materailList中对应的项
    syncPreviewRowToMaterailList() {
      if (!this.previewRow || !this.previewRow.yap521) return;
      // 在materailList中查找对应的项
      const targetIndex = this.materailList.findIndex(item => item.yap521 === this.previewRow.yap521);
      if (targetIndex !== -1) {
        // 更新materailList中的对应项
        this.materailList[targetIndex].files = [...this.previewRow.files];
        this.materailList[targetIndex].total = this.previewRow.total;
        this.materailList[targetIndex].satisfied = this.previewRow.satisfied;
      }
    },
  },
}
</script>
<style lang="less" scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.item-name {
  position: relative;
  margin-bottom: 5px;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 700;
}

.item-name-red::before {
  content: '*';
  color: red;
  position: absolute;
  left: -10px;
  top: -5px;
}

/* viewer 悬浮操作按钮样式 */
.viewer-action {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.not-support {
  margin-right: 12px;
  color: #606266;
}
</style>
