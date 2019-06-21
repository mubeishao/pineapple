/*正式站点配置*/
'use strict';
module.exports = {
  NODE_ENV: '"production"',
  CONFIG:{
    BASE_URL:'"https://api.aihuicheng.com/api"',//api
    HEAD_IMAGE_URL_DEFAULT:'"/resource/HeadImage/default/"',//默认用户头像
    HEAD_IMAGE_URL:'"/resource/HeadImage/"',//用户上传头像
    GAME_IMAGE_URL: '"/resource/GameImage/"',//首屏游戏
    GAME_CHILD_IMAGE_URL:'"/resource/GameImage/child/"'//子游戏
  }
};
