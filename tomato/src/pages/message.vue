<template>
  <div class="message">
    <headertop title="信息"/>
    <div class="top_area">
      <a
        href="#"
        class="toggle_btn left"
        :class="{active:currentPage===0}"
        @click.prevent="currentPage=0"
      >更新公告</a>
      <a
        href="#"
        class="toggle_btn right"
        :class="{active:currentPage===1}"
        @click.prevent="currentPage=1"
      >我的邮件</a>
    </div>
    <main>
      <transition name="slide-left">
        <div class="mail_area" v-show="currentPage===0">
          <div class="no-message" v-show="!noticeMessage.totalCount">暂无公告</div>
          <div class="mail" v-for="(m,i) in noticeMessage.noticeDTOs" :key="m.id">
            <div class="top">
              <div class="sender">发件人：{{m.editor}}</div>
              <div class="date">{{m.beginTime|dateformat}}</div>
            </div>
            <div class="bottom">
              <div class="title">{{m.strType}}</div>
              <div class="btn_area">
                <a href="#" class="btn clickBtn check" @click.prevent="checkNoticeMessageHandler(i)">查看</a>
              </div>
            </div>
          </div>
          <div class="bottom_height"></div>
          <Patitation
            class="pagination"
            @jumpPage="jumpPageNotice"
            :pageNumber="noticeMessagePage"
            :PageSize="noticeMessageSize"
            :totalCount="noticeMessage.totalCount"
          />
        </div>
      </transition>
      <transition name="slide-right">
        <div class="mail_area" v-show="currentPage===1">
          <div class="no-message" v-show="!myMessage.totalCount">暂无邮件</div>
          <div class="mail" v-for="(m,i) in myMessage.internalMessageDTOs" :key="m.id">
            <div class="top">
              <div class="sender">发件人：{{m.sender}}</div>
              <div class="date">{{m.createTime|dateformat}}</div>
            </div>
            <div class="bottom">
              <div class="title">{{m.subjectName}}</div>
              <div class="btn_area">
                <a href="#" class="btn check" @click.prevent="checkMyMessageHandler(i)">查看</a>
              </div>
            </div>
          </div>
          <div class="bottom_height"></div>
          <Patitation
            class="pagination"
            @jumpPage="jumpPageMy"
            :pageNumber="myMessagePage"
            :PageSize="myMessageSize"
            :totalCount="myMessage.totalCount"
          />
        </div>
      </transition>
    </main>
  </div>
</template>
<script>
import Headertop from "@/components/Header";
import { getNoticeMessage, getMyMessage } from "../api/interface";
import { setSession } from "@/common/utils/session";
import Patitation from "../components/Patitation";
export default {
  components: {
    Headertop,
    Patitation
  },
  data() {
    return {
      currentPage: 0,
      myMessagePage: 1,
      myMessageSize: 10,
      noticeMessagePage: 1,
      noticeMessageSize: 10,
      myMessage: {},
      noticeMessage: {}
    };
  },
  mounted() {
    this.getMyMessage();
    this.getNoticeMessage();
  },
  methods: {
    checkMyMessageHandler(id) {
      this.$router.push({
        name: "Mail",
        query: {
          type: "myMessage",
          id
        }
      });
    },
    checkNoticeMessageHandler(id) {
      this.$router.push({
        name: "Mail",
        query: {
          type: "noticeMessage",
          id
        }
      });
    },
    async getMyMessage(pageIndex = 1, pageSize = 10) {
      let data = {
        pageIndex,
        pageSize
      };
      let res = await getMyMessage(data);
      if (res.result === 1) {
        setSession("myMessage", res.data);
        this.myMessage = res.data;
      } else {
        this.$route.go(-1);
      }
    },
    async getNoticeMessage(pageIndex = 1, pageSize = 5) {
      let data = {
        pageIndex,
        pageSize
      };
      let res = await getNoticeMessage(data);

      if (res.result === 1) {
        setSession("noticeMessage", res.data);
        this.noticeMessage = res.data;
      } else {
        this.$route.go(-1);
      }
    },
    jumpPageNotice() {
      this.getNoticeMessage(e.currentPage, e.currentSize);
    },
    jumpPageMy(e) {
      this.getMyMessage(e.currentPage, e.currentSize);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";

.slide-right-leave-to,
.slide-right-enter {
  transform: translateX(100%);
}
.slide-left-leave-to,
.slide-left-enter {
  transform: translateX(-100%);
}
.slide-right-enter-active,
.slide-left-enter-active,
.slide-right-leave-active,
.slide-left-leave-active {
  position: absolute;
  transition: 0.5s;
}
.message {
  background-color: #1f212e;
  height: 100vh;
  width: 100vw;
  padding-bottom: 1.2rem;
  box-sizing: border-box;
}
.top_area {
  padding-top: remCalc(21);
  font-size: remCalc(32);
  display: flex;
  width: 100%;
  text-align: center;
  .toggle_btn {
    transition: color 0s;
    transition: border 0.8s;
    width: 50%;
    box-sizing: border-box;
    background-color: #171723;
    border: {
      color: #4e5164;
      top: remCalc(1);
      bottom: remCalc(1);
      style: solid;
    }
    padding: remCalc(24) 0;
    color: #4e5164;
    font-weight: bold;
    &.right {
      border-left: 0.5px solid #4e5164;
    }
    &.left {
      border-right: 0.5px solid #4e5164;
    }
    &.active {
      color: #fff;
      border-top: 1px solid #4e5164;
      border-bottom: 1px solid #4e5164;
      position: relative;
      overflow: hidden;
      &::before {
        content: "";
        width: remCalc(180);
        height: remCalc(120);
        background-color: rgba(#7777a5, 0.4);
        border-radius: 100%;
        position: absolute;
        top: 95%;
        left: 50%;
        transform: translateX(-50%);
        box-shadow: 0 remCalc(-5) remCalc(80) #7777a5;
      }
    }
  }
}
main {
  width: 100vw;
  height: calc(100% - #{remCalc(221)});
  box-sizing: border-box;
  padding-bottom: 3.5rem;
}
.mail_area {
  margin-top: remCalc(15);
  padding: 0 remCalc(20);
  font-size: remCalc(27);
  height: 100%;
  width: 100vw;
  box-sizing: border-box;
  .mail {
    box-sizing: border-box;
    border-radius: remCalc(10);
    border: 1px solid #3b4378;
    overflow: hidden;
    margin-bottom: remCalc(10);
    background-color: #1b1b28;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .sender {
        background-image: url("~@/common/images/mail_sender_deco.png");
        background-position: right top;
        background-repeat: no-repeat;
        background-size: cover;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: remCalc(12) remCalc(20);
        // padding-right: remCalc(260);
        width: 60%;
        color: #000;
        box-sizing: border-box;
      }
      .date {
        padding-right: remCalc(20);
        text-align: right;
        color: #4e5164;
        white-space: nowrap;
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: remCalc(10);
      .title {
        padding: remCalc(25) remCalc(20);
        word-break: break-all;
        width: 60%;
        box-sizing: border-box;
      }
    }
    .btn_area {
      padding: remCalc(10) remCalc(20);
      display: flex;
      align-items: center;
      .btn {
        display: block;
        padding: remCalc(15) remCalc(45);
        border-radius: remCalc(50);
        color: #fff;
        margin-left: remCalc(6);
        &.check {
          background: linear-gradient(to right, #18cffe, #0fb4f4, #018ee5);
        }
        &.dele {
          background: linear-gradient(
            to right,
            #d1b16c 0%,
            #d1b16c 0.4%,
            #bd9e5c 100%
          );
        }
      }
    }
  }
}
.bottom_height {
  height: remCalc(120);
}
.no-message {
  padding-top: 30vh;
  width: 100%;
  text-align: center;
  font-size: remCalc(70);
  color: rgb(107, 107, 107);
}
</style>
