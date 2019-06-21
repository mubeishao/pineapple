import {service} from './axios';

//获取首页用户信息
export const getMemberInfo = () => {
  return service({
    url: '/Home/GetMemberInfo',
    method: 'post',
    // retry: 5, retryDelay: 1000
  });
};

export const reqRegister = data => {
  return service({
    url: '/Account/Register',
    method: 'post',
    data
  });
};

export const GetAccountWallet = params => {
  return service({
    url: '/History/GetFundWalletLog',
    method: 'get',
    params
  });
};

export const getSendBankCode = params => {
  return service({
    url: '/Account/SendUpdateBankCode',
    method: 'get',
    params
  });
};


// export const changeMemWalletPwd =data => {
//   return service({
//     url: '/Account/ChangeMemWalletPwd',
//     method: 'post',
//     data
//   });
// };

//游戏记录
export const getGameRecord = params => {
  return service({
    url: '/History/GetBuYuBetLog',
    method: 'get',
    params
  });
};

//百家乐
export const getBaiJiatLog = params => {
  return service({
    url: '/History/GetBaiJiaLeBetLog',
    method: 'get',
    params
  });
};
//修改昵称
export const getNickName = data => {
  return service({
    url: '/Home/ChangeNickName',
    method: 'post',
    data
  });
};

// 捕鱼游戏
export const getActionGame = () => {
  return service({
    url: '/Home/GetNewGames',
    method: 'post',
  });
};

//开始游戏
export const getStartGame = params => {
  return service({
    url: '/Home/StartGame',
    method: 'get',
    params
  });
};

//获取游戏子列表  GetDfqChildGames
export const getGameChildlist = params => {
  return service({
    url: '/Home/GetDfqChildGames',
    method: 'get',
    params
  });
};

// 獲取公告
export const getNoticeMessage = params => {
  return service({
    url: '/Home/GetNoticeMessage',
    method: 'post',
    params
  });
};
// 獲取我的郵箱
export const getMyMessage = params => {
  return service({
    url: '/Home/GetMyMessage',
    method: 'post',
    params
  });
};
// 獲取活動
export const getActivity = () => {
  return service({
    url: '/Home/GetActivity',
    method: 'post'
  });
};

//获取游戏余额
export const getGameSum = params => {
  return service({
    url: '/Payments/GetBalanceAsync',
    method: 'get',
    params
  });
};

export const getChangeMemPwd = data => {
  return service({
    url: '/Account/ChangeMemPwd',
    method: 'post',
    data
  });
};
// 發展下級
export const getReferralCode = data => {
  return service({
    url: '/Account/ReferralCode',
    method: 'post',
    data
  });
};
//提款   银行卡兑换
export const getCardTransfer = data => {
  return service({
    url: '/Payments/Exchange',
    method: 'post',
    data
  });
};

//修改安全码的短信验证码
export const getReqSafeCode = params => {
  return service({
    url: '/Account/SendWalletCode',
    method: 'get',
    params
  });
};

//获取兑换记录
export const getConversionRecord = params => {
  return service({
    url: '/Payments/GetOrderList',
    method: 'get',
    params
  });
};

//获取业绩查询的child
export const getChilds = params => {
  return service({
    url: '/AgentCenter/GetSonBetList',
    method: 'get',
    params
  });
};

//直属代理的业绩
export const getAgentChilds = params => {
  return service({
    url: '/AgentCenter/GetSonTeamBetList',
    method: 'get',
    params
  });
};


//获取下级列表数据
export const getManageChilds = params => {
  return service({
    url: '/AgentCenter/GetMemberlist',
    method: 'get',
    params
  });
};


//业绩查询
export const getfeatsum = params => {
  return service({
    url: '/AgentCenter/GetFeatSum',
    method: 'get',
    params
  });
};
//
export const getqueryChild = params => {
  return service({
    url: '/AgentCenter/GetChild',
    method: 'get',
    params
  });
};

//获取支付方式
export const getPayType = () => {
  return service({
    url: '/Payments/GetPayType',
    method: 'post',

  });
};

//获取渠道列表
export const getChannel = params => {
  return service({
    url: '/Payments/GetPlat',
    method: 'get',
    params
  });
};

//获取渠道规则
export const getPayRule = params => {
  return service({
    url: '/Payments/GetPayRule',
    method: 'get',
    params
  });
};

//充值
export const getSumbitPay = params => {
  return service({
    url: '/Payments/Pay',
    method: 'get',
    params
  });
};


export const getSearchChild = params => {
  return service({
    url: '/AgentCenter/SearchMember',
    method: 'get',
    params
  });
};

// 设置安全码
export const changeMemWalletPwd = data => {
  return service({
    url: '/Account/ChangeMemWalletPwd',
    method: 'post',
    data
  });
};
// 更改绑定手机号
export const changePhoneNumberBind = data => {
  return service({
    url: '/Account/ChangePhoneNumberBind',
    method: 'post',
    data
  });
};
//发送银行卡修改短信验证码
export const sendUpdateBankCode = params => {
  return service({
    url: '/Account/SendUpdateBankCode',
    method: 'get',
    params
  });
};
// 修改银行卡
export const getBindBankNo = data => {
  return service({
    url: '/Payments/BindBankNo',
    method: 'post',
    data
  });
};
//充值
export const getReCharge = params => {
  return service({
    url: '/Payments/Pay',
    method: 'get',
    params
  });
};

//排線碼 列表查詢
export const getTeamCode = params => {
  return service({
    url: '/TeamCode/GetTeamCodes',
    method: 'get',
    params
  });
};

//排線碼 團隊列表
export const getTeamMembers = data => {
  return service({
    url: '/TeamCode/GetTeamMembers',
    method: 'post',
    data
  });
};

//排線碼 生成
export const createTeamCode = data => {
  console.log(data);
  return service({
    url: '/TeamCode/CreateTeamCode',
    method: 'post',
    data
  });
};

//排線碼 二維碼分享
export const getShareUrl = params => {
  return service({
    url: '/TeamCode/GetShareUrl',
    method: 'get',
    params
  });
};

//排線碼 二維碼重製
export const resetTeamCode = params => {
  return service({
    url: '/TeamCode/ResetTeamCode',
    method: 'post',
    params
  });
};

//排線碼 修改排线名
export const changeTeamName = data => {
  return service({
    url: '/TeamCode/ChangeTeamName',
    method: 'post',
    data
  });
};

//取得分享抽獎資訊
export const getPrizeAboutInfo = params => {
  return service({
    url: '/Prize/GetPrizeAboutInfo',
    method: 'get',
    params
  });
};
//抽抽抽
export const luckDraw = () => {
  return service({
    url: '/Prize/LuckDraw',
    method: 'get'
  });
};
//上傳圖片
export const uploadBase64 = data => {
  return service({
    url: '/Home/UploadBase64',
    method: 'post',
    data
  });
};
