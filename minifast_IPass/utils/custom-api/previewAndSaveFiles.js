import {
    showLoading,
    hideLoading,
} from '@/utils/uni-api/index.js'
/**
 * 预览并支持下载文件图片到本地，文件支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx。
 * @param {string} url 必传。文件url
 * @param {string} type 必传。文件类型
 * @support 
 * 微信小程序支持情况说明：https://developers.weixin.qq.com
 * 
 * 支付宝小程序支持情况说明：https://opendocs.alipay.com/mini/api/mwpprc
 * 
 * uniapp支持情况说明：https://uniapp.dcloud.io/api/file/file?id=opendocument
 */

const previewAndSaveFiles = (url, type) => {
    // 当前环境是否为开发环境
    const isDev = process.env.NODE_ENV === 'development'
    // 文件只支持这些类型
    const fileTypes = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx']

    let isImage = false

    fileTypes.includes(type) ? isImage = false : isImage = true

    // 预览、下载图片
    const previewImage = (url) => {
        uni.previewImage({
            urls: [url],
            longPressActions: {
                itemList: ['保存图片'],
                success: function (data) {
                    console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
                },
                fail: function (err) {
                    console.log("预览失败", err.errMsg);
                },
            },
            success: () => {
                console.log('预览成功');
            },
            fail: (err) => {
                isDev && console.log(err);
            }
        });
    }

    // 预览下载文件
    const previewFiles = (url, type) => {
        showLoading()
        //下载文件资源到本地
        uni.downloadFile({
            url: url,
            success: (res) => {
                hideLoading();
                const filePath = res.tempFilePath;
                showLoading()
                // 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx。
                uni.openDocument({
                    filePath: filePath,
                    fileType: type,
                    showMenu: true, // 允许出现分享功能
                    success: (res) => {
                        hideLoading();
                    },
                    fail: (openError) => {
                        hideLoading();
                        isDev && console.log(openError);
                    }
                });
            },
            fail: (err) => {
                hideLoading();
                isDev && console.log('fail:' + JSON.stringify(err));
            }
        });
    }

    if (isImage) {
        previewImage(url)
    } else {
        previewFiles(url, type)
    }
}

export {
    previewAndSaveFiles
}