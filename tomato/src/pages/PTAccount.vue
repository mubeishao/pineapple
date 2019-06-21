<template>
  <div class="ptcount">
    <div class="PT">
      <Headertop/>
      <div class="accountExtra">
        <div class="PTcount">
          <p class="acct">{{parentName}}账户余额:</p>
          <p class="font">{{balance}}</p>
        </div>
        <p class="ptImg clickBtn" @click.stop="handleRecharge()" >
          <img src="../common/images/Transm.png">
        </p>
      </div>
      <div class="select">
        <div class="selectItem" v-show="false">
          <div class="selected">
            <span>类型</span>
            <select v-model="selected">
              <option
                :value="item.unit"
                v-for="item in currencyArray"
                :key="item.unit"
              >{{item.characters}}</option>
            </select>
          </div>

          <div class="selected selected2">
            <span>类型</span>
            <select v-model="selected">
              <option
                :value="item.unit"
                v-for="item in currencyArray"
                :key="item.unit"
              >{{item.characters}}</option>
            </select>
          </div>
          <div class="selected selected3">
            <span>类型</span>
            <select v-model="selected">
              <option
                :value="item.unit"
                v-for="item in currencyArray"
                :key="item.unit"
              >{{item.characters}}</option>
            </select>
          </div>
        </div>
        <div class="contentImg">
          <div class="tentImg" v-for="(item,index) in PtaccountArr" :key="index">
            <p class="clound">
              <img
                :src="$CONFIG.GAME_CHILD_IMAGE_URL+item.gameImg"
                @click.prevent="actionGame(item.gameId,item.id)"
                ref="catchfish"
                :class="currentIndex==index ? 'border1':'border2' "
              >
            </p>
            <p class="name">{{item.gameName}}</p>
            <p class="action">
              <img
                src="../common/images/transfer_action.png"
                @click.prevent="actionGame(item.gameId,item.id)"
              >
            </p>
			 <div class="noaction" v-show="item.status==0?true:false">暂未开放</div> 
          </div>
        </div>
      </div>
      <AlertTip
        :alertText="alertText"
        :isCancel="false"
        v-show="alertShow"
        @confirm="confirm"
        @cancel="cancel"
    />
    </div>
  </div>
</template>
<script>
import Headertop from "../components/Header";
import { getGameChildlist, getGameSum, getStartGame } from "../api/interface";
import Storage from "../common/utils/storage";
import AlertTip from "../components/AlertTip";
export default {
  data() {
    return {
      selected: "any",
      PTaccount: 0,
      name: "云从龙",
      gameId: 0,
      childId: 0,
      typeId: "",
      preveDiv: null,
      showBJ: true,
      balance: 0.00, //余额
      gameName: "",
      isShow: false,
      parentName: "",
      gameParentName: [],
      PtaccountArr: [],
      alertShow:false,
      alertText: "", // 提示文本
      testImg: require("../common/images/fishOne.png"),
      pgOne: require("../common/images/peOne.png"),
      okImg: "",
      currentIndex: 0,
      currencyArray: [
        {
          unit: "any",
          characters: "全选"
        },
        {
          unit: "cny",
          characters: "单选"
        }
      ]
    };
  },
  mounted() {
    const { gameId } = this;
    // this.typeId = this.$route.query.id;
    // this.parentName = this.$route.query.parentName;
    
    let objdata = JSON.parse(localStorage.getItem('data'))
    this.typeId =objdata.id;
    this.parentName = objdata.name

    this.getChildlist();
    setTimeout(() => {
      this.isShow = true;
    }, 100);
  },
  methods: {
    handleRecharge() {
      this.$router.push({
        path: "transfer",
        query: {
          gameId: this.gameId,
          parentName: this.parentName
        }
      });
    },
    //选中游戏图片
    selectImg(e, gameId, currIndex) {
      let pre = e.currentTarget;
      this.currentIndex = currIndex;
      this.getGameBalance(gameId);
    },

    //获取余额
    async getGameBalance(gameId) {  
      
      let params = {
        gameId
      };
      let res = await getGameSum(params);
      if (res.result === 1) {
        
        this.balance = res.data;
      }
    },
    //开始游戏
    async actionGame(gameId, childId) {
      if(gameId==11){
         if(this.balance==0){
            this.gamePlay2()
            return
         }
      }
      let params = {
        gameId,
        childId
      };

      let res = await getStartGame(params);
      if (res.result==1) {
       this.$router.push({
            path:'/appFrame',
            query:{
              url:res.message,
              title:this.parentName,
              gameId:this.gameId
            }
          })
      } else {
        this.$toast(res.message);
      }
    },

    //获取游戏子列表
    async getChildlist() {
      let vm = this;
      let params = {
        typeId: this.typeId
      };

      let res = await getGameChildlist(params);
      vm.PtaccountArr = res.data;
     
      if (res.result == 1) {
        if (vm.PtaccountArr != null) {
          this.gameId = res.data[0].gameId;
          this.getGameBalance(this.gameId);
        } else if (vm.PtaccountArr == null) {
          this.$toast(res.message);
        }
      } else if (res.result == 0) {
        this.$toast(res.message);
      }
    },
    actionGame2() {
      this.$toast("游戏暂未开放");
    },
    actionGame4() {
      this.$toast("游戏暂未开放");
    },
    actionGame4() {
      this.$toast("游戏暂未开放");
    },
     gamePlay2() {
      this.showAlert("游戏余额不足");
    },
    showAlert(alertText) {
      this.alertText = alertText;
      this.alertShow = true;
    },
    confirm() {
      this.alertShow = false;
    },
    cancel() {
      this.alertShow = false;
    },
  },
  destroyed() {
    (this.testImg = ""), (this.pgOne = ""), (this.typeId = 12);
  },
  components: {
    Headertop,
    AlertTip
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.ptcount {
  width: 100%;
  height: 100vh;
}

/* .show{
      transition: 0.7s;
      transform:translateX(0);
      -webkit-transform:translateX(0);
} */

.accountExtra {
  display: flex;
  width: 94%;
  height: 0.8rem;
  line-height: 0.8rem;
  font-size: 0.3rem;
  color: #dedede;
  padding: remCalc(21) 0;
  margin: 0 auto;
}
.PTcount {
  flex: 2;
  display: flex;
}
.ptImg {
  flex: 0.8;
  text-align: right;
}
.acct {
  flex: 1.7;
}
.font {
  flex: 1;
  color: #ff0000;
  width: 1.6rem;
  font-size: 0.26rem;
}
.ptImg img {
  height: 0.5rem;
  padding-top: 0.15rem;
}
.select {
  width: 100%;
  padding: remCalc(21) 0;
  box-sizing: border-box;
  background: #171723;
}
.selectItem {
  width: 94%;
  display: flex;
  margin: 0 auto;
  justify-content: space-around;
}
.selected {
  flex: 1;
  color: #c8c8c8;
  font-size: 0.27rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.selected2,
.selected3 {
  padding-left: 0.12rem;
}

.selected select {
  width: 1.2rem;
  background: #3b405e;
  color: #dbdbdb;
  outline: none;
  border-radius: 0.04rem;
  height: 0.36rem;
  line-height: 0.36rem;
}
.contentImg {
  width: 94%;
  max-width: 8rem;
  margin: 0.2rem auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
}

.tentImg {
  width: 48%;
  vertical-align: top;
  border: none;
}
.name {
  font-size: 0.24rem;
  margin-top: 0.2rem;
  text-align: center;
}

.clound img {
  width: 100%;
  height: 2.5rem;
  // border: 0.02rem solid #c7911c;
  // box-shadow: 0 0 0.2rem #888888;
}
.border1 {
  border: 0.02rem solid #c7911c;
  box-shadow: 0 0 0.2rem #888888;
}
.border2 {
  border: none;
  box-shadow: none;
}
.action img {
  display: block;
  height: 0.6rem;
  margin: 0.2rem auto;
}
.chargeBJ {
  border: 0.01rem solid red;
}
.noBJ {
  border: none;
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
   font-size: 0.28rem;
   text-align: center;
   margin: 0 auto;
   opacity: 0.6;
   z-index: 999;   
   color: orange 
}
</style>
