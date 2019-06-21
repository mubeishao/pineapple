import {
  RECEIVE_USER_INFO,
  GET_USER_INFO,
  MAIN_USER_INFO,
  GAME_RECORD_INFO
} from './mutation-types';
export default {
  [RECEIVE_USER_INFO](state, { userInfo }) {
    state.userInfo = userInfo;
  },

  [GET_USER_INFO](state, { getRegisterInfo }) {
    state.getRegisterInfo = getRegisterInfo;
  },

  [MAIN_USER_INFO](state, { mainInfo }) {
    state.mainInfo = mainInfo;
  },

  [GAME_RECORD_INFO](state, { gameRecordInfo }) {
    state.gameRecordInfo = gameRecordInfo;
  },
  NEW_AUDIO(state, status){
    state.bgm = status
  },
};
