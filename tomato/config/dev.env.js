/*本地开发配置*/
'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CONFIG:{
    BASE_URL:'"http://dblapi.suo1688.com/api"',
    HEAD_IMAGE_URL_DEFAULT:'"http://dbl.suo1688.com/resource/HeadImage/default/"',
    HEAD_IMAGE_URL_SHOW:'"http://dbl.suo1688.com/resource/ShowImage/"',
    HEAD_IMAGE_URL:'"http://dbl.suo1688.com/resource/HeadImage/"',
    GAME_IMAGE_URL: "'http://dbl.suo1688.com/resource/GameImage/'",
    GAME_CHILD_IMAGE_URL:'"http://dbl.suo1688.com/resource/GameImage/child/"'
  }
});
