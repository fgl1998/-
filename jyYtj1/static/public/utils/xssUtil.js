import he from 'he'
// 将转义后的html标签转义回来，并且排除不安全的标签。
function decodeSafeHTML(encodedString) {
    // 解码所有 HTML 实体字符
     let decodedString = he.decode(encodedString);

     // 定义不安全标签的黑名单
     const blacklistedTags = ['script', 'iframe', 'object', 'embed', 'link', 'style'];
 
     // 构造正则表达式，匹配所有 HTML 标签
     const tagRegex = /<(\/?)([a-zA-Z0-9]+)(\s[^>]*?)?(\s*\/?)>/gi;
 
     // 过滤黑名单标签
     decodedString = decodedString.replace(tagRegex, (match, slash, tagName, attrs, selfClosing) => {
         if (blacklistedTags.includes(tagName.toLowerCase())) {
             return ''; // 直接移除黑名单标签
         }
         return `<${slash}${tagName}${attrs || ''}${selfClosing || ''}>`;
     });
 
     return decodedString;
}

export default {
    decodeSafeHTML
}


