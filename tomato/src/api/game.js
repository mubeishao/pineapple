/*
游戏相关接口
 */
import {service} from './axios';

//余额获取
export const getBalance = gameId => {
    return service({
        url: '/Payments/GetBalanceAsync',
        method: 'get',
        params: { gameId }
    });
}

//钱包转账
export const transfer = (fromId, toId, amount) => {
    return service({
        url: 'Payments/TransferAmountAsync',
        method: 'post',
        data:
        {
            "transferAmount": amount,
            "transferFrom": fromId,
            "transferTo": toId,
        }
    })
}