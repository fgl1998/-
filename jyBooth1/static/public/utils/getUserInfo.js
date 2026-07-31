import app_request from "./app_request";

// 获取求职者信息
const getUserInfo = (loginType = null) => {
    return new Promise((res, rej) => {
        const param = {
            loginType,
        }
        app_request.request("/api/security/token/getUserInfo.do", "post", param, true, true)
            .then((data) => {
                if (data.serviceSuccess) {
                    res(data.userInfo);
                } else {
                    res("获取用户信息失败");
                }
            }).catch(err => {
                // console.log(err,'err')
        })
    });
}

export default getUserInfo
