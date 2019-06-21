import {
  RECEIVE_USER_INFO,
  GET_USER_INFO,
  MAIN_USER_INFO,
  GAME_RECORD_INFO,
} from './mutation-types';

export default {
  //同步用户信息
  recordUser({ commit }, userInfo) {
    commit(RECEIVE_USER_INFO, { userInfo });
  },

  // 同步存记录信息

  gameRecordInfo({ commit }, gameRecordInfo) {
    commit(GAME_RECORD_INFO, { gameRecordInfo });
  },

  //首页获取用户信息接口
  async getRegInfo({ commit }) {
    const res = await reqGetUserInfo({});
    if (res.result === 1) {
      let getRegisterInfo = res.data;
      commit(GET_USER_INFO, { getRegisterInfo });
    }
  },

  //同步首页的用户信息
  recordMainInfo({ commit }, mainInfo) {
    commit(MAIN_USER_INFO, { mainInfo });
  },
  // 新增音量
  newAudio(context, status) {
    context.commit('NEW_AUDIO', status)
  }
};

