<template>
  <div class="mail">
    <headertop title="查看邮件"></headertop>
    <main>
      <div class="top_area">
        <div class="sender">发件人：{{sender}}</div>
        <div class="title">主題: {{subjectName}}</div>
      </div>
      <p class="content" v-html="warpSpaceMessage"></p>
    </main>
  </div>
</template>
<script>
import headertop from "@/components/Header";
import { getSession } from "@/common/utils/session";
export default {
  components: {
    headertop
  },
  data() {
    return {
      sender: "",
      message: "",
      subjectName: ""
    };
  },
  mounted() {
    switch (this.$route.query.type) {
      case "myMessage":
        this.getMyMessage();
        break;
      case "noticeMessage":
        this.getNoticeMessage();
        break;
    }
  },
  methods: {
    getMyMessage() {
      let data = getSession("myMessage").internalMessageDTOs[
        Number(this.$route.query.id)
      ];
      let { sender, message, subjectName } = data;
      // this = { sender, message, subjectName }
      this.sender = sender;
      this.message = message;
      this.subjectName = subjectName;
    },
    getNoticeMessage() {
      let data = getSession("noticeMessage").noticeDTOs[
        Number(this.$route.query.id)
      ];
      let { editor, noticeContent, strType } = data;
      // this = { sender, message, subjectName }
      this.sender = editor;
      this.message = noticeContent;
      this.subjectName = strType;
    }
  },
  computed: {
    warpSpaceMessage() {
      let val = this.message;
      if (!val) return "";
      val = val.toString();
      return val.replace(/\n/gi, "<br/>");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.mail {
  height: 100vh;
  background-color: #1f212e;
}
main {
  font-size: 0.24rem;
  padding-top: remCalc(21);
  margin: 0 remCalc(20);
  .top_area {
    background-color: #2e3249;
    padding: 0 remCalc(20);
  }
  .sender,
  .title {
    padding: remCalc(20) 0;
    color: #fff;
  }
  .sender {
    padding-top: remCalc(35);
    color: #fea100;
    box-shadow: 0px 0.5px 0px #000;
  }
  .content {
    padding: remCalc(45) remCalc(20);
    line-height: remCalc(24);
    font-size: remCalc(24);
    background-color: #171723;
    color: #959595;
  }
}
</style>
