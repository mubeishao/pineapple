<template>
  <div class="activityCenter">
    <headertop title="活动中心"/>
    <div class="activity_area">
      <div class="activity" v-for="(a,index) in activity" :key="a.target">
        <div class="img_area" @click="toggleContent(index)">
          <img :src="a.imgUrl">
        </div>
        <a href="#" class="close_btn btn " :class="{hide:a.hide}">
          <img src="~@/common/images/close_btn.png">
        </a>
        <div class="intro_area" style="height:0">
          <div class="collaspe">
            <p>
              <span class="title">活动对象：</span>
              <span class="main">{{a.strPromotion}}</span>
            </p>
            <p>
              <span class="title">活动时间：</span>
              <span class="sub">{{a.beginTime}}-{{a.endTime}}</span>
            </p>
            <p>
              <span class="title">活动内容：</span>
              <span class="content">{{a.activityName}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Headertop from "@/components/Header";
import { getActivity } from "../api/interface";
export default {
  components: {
    Headertop
  },
  data() {
    return {
      activity: []
    };
  },
  mounted() {
    this.getActivity();
  },
  methods: {
    toggleContent(index) {
      let el = document.getElementsByClassName("intro_area")[index];
      let h = document.getElementsByClassName("collaspe")[index].clientHeight;
      if (this.activity[index].hide) {
        this.activity[index].hide = false;
        let i = 0;
        let show = () => {
          setTimeout(() => {
            i = i + 2;
            el.style.height = i + "px";
            if (i < h) {
              show();
            }
          }, 1);
        };
        show();
        // el.style.height = h + "px";
      } else {
        el.style.height = h + "px";
        this.activity[index].hide = true;
        let i = h;
        let close = () => {
          setTimeout(() => {
            i = i - 2;
            el.style.height = i + "px";
            if (i > 0) {
              close();
            }
          }, 1);
        };
        close();
        // setTimeout(() => {
        //   el.style.height = 0;
        // }, 0);
      }
    },
    async getActivity() {
      let res = await getActivity();

      if (res.result === 1) {
        for (let i = 0, l = res.data.activityDTOs.length; i < l; i++) {
          res.data.activityDTOs[i].hide = true;
        }
        this.activity = res.data.activityDTOs;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.activityCenter {
  height: 100vh;
  overflow-y: scroll;
  background-color: #1f212e;
}
.activity_area {
  padding: 0 remCalc(22);
  padding-top: remCalc(21);
  .activity {
    position: relative;
    margin-bottom: remCalc(21);
    background-color: #171723;
    padding: remCalc(2);
    box-sizing: border-box;

    .img_area {
      background-color: #aaa;
      height: remCalc(238);
      z-index: 0;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .close_btn {
      font-size: 0;
      position: absolute;
      top: remCalc(190);
      right: remCalc(21);
      width: remCalc(32);
      transition: transform 0.3s;
      pointer-events: none;
      img {
        width: 100%;
      }
      &.hide {
        transform: rotate(180deg);
      }
    }
    .intro_area {
      overflow: hidden;
      // transition: height 0.3s;
      height: 100%;
      box-sizing: border-box;
      font-size: remCalc(32);
      position: relative;
      > div {
        position: relative;
        padding: 0.05rem 0.2rem;
      }
      p {
        margin: 0.1rem 0;
        .main {
          color: #009be3;
        }
        .sub {
          color: #0e990a;
        }
        .content {
          color: #51546b;
        }
        span {
          line-height: 1.4;
        }
      }
    }
  }
}
</style>
