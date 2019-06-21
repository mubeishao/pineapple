<template>
  <div class="gamerecord">
    <header-top title="游戏记录"/>
    <div class="container">
      <div class="info">
        <p class="wranInfo">
          <img src="../common/images/gameWran.png">
          <span class="detail">提示：投注明细只保留您最近的15天信息</span>
        </p>
      </div>
      <div class="gameTable" ref="gameTab">
        <ul class="gameType">
          <li
            v-for="(game,index) in gamelistArray"
            :key="index"
            @click.stop="showBack($event,game.id,index)"
            :class="currentIndex==index?'chargeBJ four':'noBJ four' "
            ref="fish"
          >{{game.name}}</li>
        </ul>
      </div>
    </div>

    <div>
      <ul class="gameContent">
        <li class="gthree">订单号</li>
        <li class="gthree">投注时间</li>
        <li class="gthree">投注金额</li>
        <li class="gthree">有效投注</li>
        <li class="gthree">输赢结果</li>
        <li class="gthree">有效状态</li>
      </ul>
      <div class="gameRecordList" ref="gameRecordList">
        <div class="record" v-show="recordArr.length">
          <ul v-for="(record,indexs) in recordArr" :key="indexs" class="gameBalance">
            <li class="gthree">
              <div class="wrap">{{record.betId}}</div>
            </li>
            <li class="gthree">
              <span>{{record.betTime|dateformat('MM-DD HH:mm')}}</span>
            </li>
            <li class="gthree">{{record.betAmount}}</li>
            <li class="gthree">{{record.validAmount}}</li>
            <li class="gthree">{{record.result}}</li>
            <li class="gthree">{{record.strStatus}}</li>
          </ul>
        </div>
        <div v-show="recordArr.length==0" class="norecord">
          <img src="../common/images/norecord.png">
        </div>
      </div>
      <div class="pation" v-show="recordArr.length">
        <Patitation
          @jumpPage="jumpPage"
          :pageNumber="pageNumber"
          :PageSize="PageSize"
          :totalCount="totalCount"
        />
      </div>
    </div>
  </div>
</template>
<script>
import HeaderTop from "../components/Header";
import Patitation from "../components/Patitation";
import Storage from "../common/utils/storage";
import { getGameRecord, getBaiJiatLog } from "../api/interface";
import { TimelineLite } from "gsap";
import BScroll from "better-scroll";

const timeline = new TimelineLite();

export default {
  name: "GameRecord",
  data() {
    return {
      showBJ: true, // 是否显示背景
      preveDiv: null,
      carryTar: null,
      recordArr: [],
      id: 1,
      pageIndex: 1, //页码
      pageSize: 10, //每页显示的条数
      currentIndex: 0,
      pageNumber: 1,
      PageSize: 10,
      totalCount: 0,
      isReady: false,
      currentGameId: 0,
      duration: 0.5, // 過場動畫時間
      isActive: false, // 正在動畫與否
      gamelistArray: []
    };
  },

  methods: {
    scrolldown() {
      this.$nextTick(() => {
        this.Scroll = new BScroll(this.$refs.gameTab, {
          click: true,
          scrollX: true
        });
      });
    },
    slideAnimationController(animeWay) {
      return new Promise((res, rej) => {
        if (!animeWay) res();
        let gameList = this.$refs.gameRecordList;
        this.isActive = true;
        timeline
          .to(gameList, this.duration, {
            x: animeWay === "left" ? window.innerWidth : -window.innerWidth
          })
          .eventCallback("onComplete", () => {
            timeline
              .to(gameList, 0.0001, {
                x: animeWay === "left" ? -window.innerWidth : window.innerWidth
              })
              .eventCallback("onComplete", () => {
                res();
              });
          });
      });
    },
    async showBack(e, gameId, index) {
      if (this.isActive) return;

      this.currentIndex = index;
      if (this.currentGameId > gameId)
        await this.slideAnimationController("left");
      if (this.currentGameId < gameId)
        await this.slideAnimationController("right");
      this.accountChange(gameId);
    },

    async jumpPage(e) {
      const { pageSize, id } = this;
      let params = {
        pageIndex: e.currentPage,
        pageSize,
        id
      };
      let res = await getGameRecord(params);
      this.recordArr = res.data.betLogDTOs;
    },
    async accountChange(gameIds) {
      this.id = gameIds;
      this.currentGameId = gameIds;
      const { pageIndex, pageSize } = this;
      let params = {
        pageIndex,
        pageSize,
        id: this.id
      };

      let res = await getGameRecord(params);
      this.recordArr = res.data.betLogDTOs;
      this.totalCount = res.data.totalCount;

      let gameList = this.$refs.gameRecordList;
      timeline
        .to(gameList, this.duration, {
          x: 0
        })
        .eventCallback("onComplete", () => {
          this.isActive = false;
        });
    }
  },

  mounted() {
    const { id } = this;
    this.accountChange((this.id = 1));
    this.gamelistArray = Storage.get("gamelist");
   
    this.scrolldown();
  },
  components: {
    HeaderTop,
    Patitation
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";

.gamerecord {
  width: 100%;
  height: 100%;
  // position: relative;
}
.container {
  overflow: auto;
  overflow-x: hidden;
  margin: remCalc(21) auto;
}
.pation {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #171723;
}
.wrap {
  width: 1.1rem;
  line-height: 0.21rem;
  display: block;
  word-wrap: break-word;
}

.spdate {
  display: block;
  flex: 0.8;
  max-width: 1rem;
  height: 1rem;
  line-height: 0.34rem;
  padding-top: 0.3rem;
}
.chargeBJ {
  color: #fff;
  border-top: 1px solid #4e5164;
  border-bottom: 1px solid #4e5164;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    width: remCalc(90);
    height: remCalc(60);
    background-color: rgba(#7777a5, 0.4);
    border-radius: 100%;
    position: absolute;
    top: 95%;
    left: 50%;
    transition: 0.3s;
    transform: translateX(-50%);
    box-shadow: 0 remCalc(-5) remCalc(40) #7777a5;
  }
}
// .black {
//   color: #000000;
// }
.noBJ {
  background: none;
  color: #4e5164;
}
.info {
  width: 100%;
  margin: 0 auto 0.2rem auto;
}
.wranInfo {
  text-align: center;
  font-size: 0.24rem;
}
.wranInfo img {
  width: 0.2rem;
  height: 0.2rem;
  vertical-align: middle;
}
.detail {
  color: #d3003b;
}
.gameTable {
  width: 100%;
  overflow: hidden;
}
.gameType {
  width: 200%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 0.6rem;
  line-height: 0.6rem;
  font-size: 0.3rem;
  border: 0.01rem solid #3b405e;
}

.five {
  color: #ffffff;
}
.two {
  border-left: 0.01rem solid #3b405e;
  color: #ffffff;
}
.three {
  border-left: 0.01rem solid #3b405e;
  border-right: 0.01rem solid #3b405e;
  color: #ffffff;
}
.four {
  flex: 1;
  border-right: 0.01rem solid #3b405e;
}
.gamefour {
  border-right: 0.01rem solid #3b405e;
}
.gameContent,
.gameBalance {
  display: flex;
  width: 100%;
  height: 0.4rem;
  line-height: 0.4rem;
  justify-content: space-between;
  align-content: space-between;
  text-align: center;
  font-size: 0.24rem;
  background: #333748;
}
.gameRecordList {
  height: calc(100vh - 2.95rem);
  position: relative;
}
.gameBalance {
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 0.5rem;
}
.gameBalance li {
  font-size: 0.26rem;
}
.game_time {
  flex: 1.2;
}
.game_sea {
  flex: 0.9;
}

.time {
  flex: 1;
  color: #7c82a6;
}
.timeOrder {
  flex: 1.5;
  color: #7c82a6;
}
.gthree1 {
  width: 2rem;
  color: #7c82a6;
}
.gthree {
  flex: 1;
  color: #7c82a6;
}
.gthree2 {
  width: 1rem;
  color: #7c82a6;
}
.gameBalance {
  background: none;
}
.norecord {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.norecord img {
  display: block;
  width: 3.4rem;
  height: 2.6rem;
}
.record {
  height: 8rem;
  overflow: auto;
  text-align: center;
}

.slide-right {
  animation: slide both;
}
.slide-left {
  animation: R-slide both;
}

@keyframes slide {
  0% {
    transform: translateX(0%);
  }
  49.999% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes R-slide {
  0% {
    transform: translateX(0%);
  }
  49.999% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
