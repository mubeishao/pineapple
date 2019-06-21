<template>
  <div class="main">
    <header class="header" :class="{show:isReady}" ref="head">
      <div class="userInfo">
        <div class="avatar" @click.prevent="goBasic()">
          <img
            class="img"
            v-if="memberInfo.headUrl"
            :src="$CONFIG.HEAD_IMAGE_URL+memberInfo.headUrl"
          >
        </div>
        <div class="info">
          <p class="name">{{memberInfo.name}}</p>
          <p class="mainId">
            <span>ID:</span>
            <span>{{memberInfo.id}}</span>
          </p>
          <p class="coin">
            <span class="imgCoin">
              <img src="../common/images/coin.png">
            </span>&nbsp;
            <span>{{memberInfo.money}}</span>
          </p>
        </div>
      </div>
      <ul class="setContent">
        <!-- class="warn" -->
        <li>
          <router-link :to="{name:'message'}">
            <img src="../common/images/Info.png" class="img">
            <p class="ad">信息</p>
          </router-link>
        </li>
        <li>
          <router-link :to="{name:'activityCenter'}">
            <img src="../common/images/activity.png" class="img">
            <p class="ad">活动</p>
          </router-link>
        </li>
        <li>
          <img src="../common/images/server.png" class="img">
          <p class="ad">客服</p>
        </li>
        <li @click="isVolume">
          <img :src="volumePic" class="img">
          <p class="ad">音效</p>
        </li>
      </ul>
    </header>
    <!-- cdn.com -->
    <section class="section">
      <div class="center">
        <div class="imgone" v-for="(baseImg,index) in gameList" :key="index">  
		        <img
              :src="$CONFIG.GAME_IMAGE_URL+baseImg.gameImg+'?v=6'" 
              @click="catchfish(baseImg.typeId,baseImg.gameImg,baseImg.gameName,baseImg.status)"  
             
            >
            

		  
         
		 </div>
      </div>
    </section>
    <footer class="footer" :class="{show:isReady}">
      <ul class="bottomInfo">
        <li @click.stop="reCharge()">
          <p class="change">充值</p>
        </li>
        <li>
          <p class="change" @click.prevent="shareMakingMoney">分享赚钱</p>
        </li>
        <li>
          <div class="off" @click.prevent="getOffical()">
            <img src="../common/images/officer.png">
            <p class="hall">{{officalName}}</p>
          </div>
        </li>
        <li @click.stop="auther()">
          <p class="change">个人中心</p>
        </li>
        <li @click.stop="clubZk">
          <p class="change">俱乐部</p>
        </li>
      </ul>
    </footer>
    <app-download/>
    <AlertTip
      :alertText="alertText"
      :isCancel="false"
      v-show="alertShow"
      @confirm="confirm"
      @cancel="cancel"
    />
    <!-- <Setting v-show="settingShow" @close="settingShow= false"/> -->
  </div>
</template>

<script>
import axios from "axios";
import store from "../store";
import Storage from "../common/utils/storage";
import { getMemberInfo, getActionGame } from "../api/interface";
import { Indicator, MessageBox } from "mint-ui";
import AlertTip from "../components/AlertTip";
import AppDownload from "@/components/AppDownload.vue";
// import Setting from "../components/Setting";
export default {
  data() {
    return {
      memberInfo: {},
      gameList: [],
      catfish: {},
      pe: {},
      alertShow: false,
      alertText: "", // 提示文本
      expireInMinutes: 0,
      isReady: false,
      isLeave: false,
      // settingShow: false,
      parentName: "",
      testImg: "",
      imgsrc: "",
      avatarImage: "",
      volumePic: require("../common/images/volume_on.png"),
      audio: this.$root.$children[0].$refs.bgm,
      headUrl: "",
      officalName: "官方大厅"
    };
  },

  created() {
    this.getInfo();
    this.getGameList();
    this.phone();

    if (!localStorage.getItem("offname")) {
      this.officalName = "官方大厅";
    } else {
      this.officalName = localStorage.getItem("offname");
    }
  },
  mounted() {
    if (Storage.get("isVolume") == null) {
      Storage.set("isVolume", true);
    }
    this.volumePic =
      Storage.get("isVolume") == false
        ? require("../common/images/volume_off.png")
        : require("../common/images/volume_on.png");
  },
  beforeRouteLeave(to, from, next) {
    this.isReady = false;
    setTimeout(() => {
      next();
    }, 300);
  },
  methods: {
    cancel() {
      this.alertShow = false;
    },
    clubZk() {
      this.showAlert("敬请期待");
    },
    goBasic() {
      this.$router.push({ name: "basicDocument" });
    },
    phone() {
      var u = navigator.userAgent;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS) {
        if (screen.height == 812 && screen.width == 375) {
          this.$refs.head.style.paddingTop = "0.14rem";
        } else {
        }
      }
    },
    //获取用户信息
    async getInfo() {
      let vm = this;
      let userInfo = await getMemberInfo();
      vm.memberInfo = userInfo.data;
         
      Storage.set("userInfo", userInfo.data);
      setTimeout(() => {
        this.isReady = true;
      }, 100);
    },
    //获取游戏列表
    async getGameList() {
      let vm = this;
      let res = await getActionGame();
      if (res.result === 1) {
        vm.gameList = res.data;
        console.log(vm.gameList)
        Storage.set("gamelist", vm.gameList);
      }
    },
    showAlert(alertText) {
      this.alertText = alertText;
      this.alertShow = true;
    },
    gamePlay() {
      this.showAlert("游戏暂时未开放");
    },
    confirm() {
      this.alertShow = false;
    },
    getOffical() {
      let vm = this;
      if (vm.officalName != "官方大厅") {
        vm.$router.push("/ptaccount");
      }
    },
    catchfish(id, imgurl, name,status) {
      if(status==0){
         return
      }
      let obj = { id, name };
      localStorage.setItem("offname", name);
      localStorage.setItem("data", JSON.stringify(obj));
      this.$router.push({
        name: "PTAccount",
        query: {
          id,
          imgurl,
          name
        }
      });
    },

    enterTransfer(e) {
      let target = e.target || e.srcElement;
      if (target.nodeName.toLowerCase() == "img") {
        this.$router.push({ name: "PTAccount" });
      }
    },
    auther() {
      this.$router.push({ name: "MySelf" });
    },
    reCharge() {
      this.$router.push({ name: "ReCharge" });
    },
    shareMakingMoney() {
      this.$router.push({ name: "shareMakingMoney" });
    },
    isVolume() {
      Storage.get("isVolume") == false ? this.audio.play() : this.audio.pause();
      Storage.set("isVolume", !Storage.get("isVolume"));
      this.volumePic =
        Storage.get("isVolume") == false
          ? require("../common/images/volume_off.png")
          : require("../common/images/volume_on.png");
    }
  },
  computed: {
    isIphoneX() {
      return (
        /iphone/gi.test(navigator.userAgent) &&
        (screen.height == 812 && screen.width == 375)
      );
    },
  },
  components: {
    AlertTip,
    AppDownload
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  background: url("../common/images/mainBJ.png") no-repeat;
  background-size: 100% 100%;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
.header {
  position: fixed;
  width: 100%;
  height: 1.3rem;
  background: url("../common/images/head01.png") no-repeat;
  background-size: 100% 100%;
  background-position: top center;
  top: -2rem;
  transition: 0.6s;
  z-index: 999;
  padding-top: 0.1rem;
  &.show {
    top: 0rem;
  }
   transform: translate3d(0, 0, 0);
}
.section {
  width: 96%;
  margin: 0 auto;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 1rem;
  padding-top: 1.4rem;
  overflow-y: scroll;
}
.userInfo {
  display: flex;
  font-size: 0.24rem;
  height: 1rem;
  padding-top: 0.1rem;
  padding-left: 0.4rem;
}
.center {
  width: 100%;
  max-width: 6.4rem;
  margin: 0 auto;
  margin-top: 0.1rem;
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;
}

.imgone img {
  // height: auto;
  // width: 90%;
  margin: 0.1rem auto 0.08rem auto;
  height: 2.81rem;
  vertical-align: top;
  border: none;
}
.corcoa {
  width: calc(100% / 3);
  padding: 1%;
  box-sizing: border-box;
}
.corcoa img {
  width: 100%;
}
.paradise {
  position: relative;
  width: calc(100% / 3 * 2);
  padding: 1%;
  box-sizing: border-box;
}
.paradise img {
  width: 100%;
}

.avatar .info {
  flex: 1;
}
.avatar .img {
  width: 1rem;
  height: 1rem;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
}
.info {
  padding-left: 0.1rem;
  color: #b2a48a;
  font-size: 0.22rem;
  padding-top: 0.1rem;
}
.name {
  margin-bottom: 0.07rem;
}
.mainId {
  margin: 0.1rem auto;
}
.coin {
  background: #000000;
  height: 0.3rem;
  border-radius: 0.2rem;
  width: 1.6rem;
}
.imgCoin img {
  width: 0.3rem;
  height: 0.22rem;
}
.setContent {
  position: absolute;
  right: 0;
  top: 0.1rem;
  display: flex;
  width: 2.4rem;
}

.setContent li {
  flex: 1;
  font-size: 0;
  margin-top: 0.55rem;
  text-align: center;
}
.setContent p {
  margin-top: 0.12rem;
  transition: 0.1s;
}
.setContent li:active {
  .img {
    transform: scale(0.9);

    box-shadow: 0 0 4px 1px #e6b868;
  }
  p {
    color: #c7a98b;
    transform: scale(0.9);
  }
}
.img {
  width: 0.4rem;
  height: 0.4rem;
  transition: 0.1s;
  border-radius: 50%;
}
.ad {
  font-size: 0.2rem;
  color: #d99825;
}
.warn {
  position: relative;
}
// .warn:before {
//   content: "";
//   position: absolute;
//   right: 0.08rem;
//   top: -0.04rem;
//   background-image: url("~@/common/images/Infowarn.png");
//   background-size: 100%;
//   background-position: center;
//   width: 0.25rem;
//   height: 0.25rem;
//   pointer-events: none;
// }

.smooth {
  position: absolute;
  top: 1%;
  left: 0.08rem;
  width: 1.1rem;
  height: 1rem;
}

.race {
  display: flex;
  width: 100%;
  text-align: center;
}
.race p {
  flex: 1;
}
.car,
.lottery {
  width: 50%;
  padding: 1%;
  box-sizing: border-box;
}

.car img,
.lottery img {
  width: 100%;
}
.cartric,
.lotterytric {
  width: 50%;
  padding: 1%;
  box-sizing: border-box;
}
.cartric img,
.lotterytric img {
  width: 100%;
}
.footer {
  position: fixed;
   transform: translate3d(0, 0, 0);
  bottom: -2rem;
  left: 0;
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  background-color: #151721;
  transition: 0.6s;
  &.show {
    bottom: 0;
  }
  .off {
    position: absolute;
    bottom: 0.2rem;
    left: 50%;
    width: 1rem;
    height: 1rem;
    transform: translateX(-50%);
    // &:active {
    //   img {
    //     transform: scale(0.9);
    //     transition: transform 0.3s;
    //   }
    // }
    img {
      width: 100%;
    }
    .hall {
      width: 1rem;
      line-height: 0.3rem;
      position: absolute;
      left: 0;
      top: 0.68rem;
      font-size: 0.2rem;
      color: #000000;
      text-align: center;
    }
  }
}
.bottomInfo {
  display: flex;
  width: 90%;
  text-align: center;
  margin: 0 auto;
  overflow: hidden;
  li {
    flex: 1;
    font-size: 0.26rem;
    &:active {
      transition: 0.1s;
      // transform: scale(1.1);
      p {
        background-color: rgba(#fff, 0.2);
        transition: 0.1s;

        user-select: none;
      }
    }
  }
}
.change {
  color: #c7a98b;
}
.picfish{
   position: relative;
}
.noaction{
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 100%;
   background: #080d0b;
   position: absolute;
   top: 0;
   left: 0;
   font-size: 0.32rem;
   text-align: center;
   margin: 0 auto;
   opacity: 0.3;
   z-index: 999;   
   color: orange 
}
</style>
