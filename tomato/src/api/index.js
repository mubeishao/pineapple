import { ajax } from './axios'
const BASE_URL = process.env.CONFIG.BASE_URL;
const code = 0;
//用户名密码登录
export const reqPwdLogin = (type, mobile, password, smscode) => {
    return ajax({ url:'/Account/GetToken', method:'POST', data: { type, mobile, password, smscode } });
}

//发送短信验证码
export const reqSmsCode = (mobile,imgCode) => {
    return ajax({url:'/Account/GetSMSCode',method:'get', params:{mobile,imgCode} })
}

// 注册
export const reqRegister = (mobile, imgCode, smsCode, password, confirmPassword, ReferralCode, TeamCode, nickName,headUrl) =>{
    return ajax({url:`/Account/Register`,method:'POST', data:{ mobile, imgCode, smsCode, password, confirmPassword, ReferralCode, TeamCode, nickName,headUrl }});
}

//登录的短信验证码
export const reqSendCode = (mobile, imgCode) => {
    return ajax({url:'/Account/SendLoginCode', method:'get', params:{ mobile, imgCode }})
}

//充值中心
export const reqPay = (type, amount) =>{
    return ajax({url:'/Payments/Pay',method:'get',params: { type, amount }});
} 

//绑定手机号验证码
export const reqBindCode = (mobile,imgCode) =>{
    return ajax({url:'/Account/SendUpdateMobileCode', method:'get', params:{ mobile,imgCode }})
} 

//修改手机号码
export const reqMOdiPhone = (mobile, smsCode, walletPwd) =>{
    return ajax({url:'/Account/ChangePhoneNumberBind', method:'get', params:{ mobile, smsCode, walletPwd }})
} 

//修改安全码
export const reqSafeCode = (mobile) =>{
    return ajax({url:'/Account/SendWalletCode',method:'get', params: { mobile }})
} 

// 忘記密碼-校驗手機
export const checkedPhone = (mobile,imgCode) => {
    return ajax({ url:'/Account/CheckedPhone', method: 'get', params: { mobile, imgCode } })

}

// 忘記密碼-校驗驗證碼
export const checkVerifyCode = (mobile, verifyCode) => {
    return ajax({url:'/Account/CheckVerifyCode',method:'get', params: { mobile, verifyCode }})
}

// 忘記密碼-重置密碼
export const restPwd = (mobile, password, confirmPassword) => {
    return ajax({url:'/Account/RestPwd', method:'POST', data:{ mobile, password, confirmPassword }})
}