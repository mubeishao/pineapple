<template>
  <div class="faq">
    <headertop title="FAQ"/>
    <main>
      <div class="content">
        <div class="con">
          <div class="text">
            <h1>忘记用户名怎么办？</h1>
            <p>忘记会员账户名您可以及时联系我们的在线客服，7x24小时为您提供必要的协助。</p>
          </div>
          <div class="text">
            <h1>如何更改个人资料信息？</h1>
            <p>客户成功注册后，可以在个人中心基本资料里面添加个人资料。如添加完成后有需要修改密码，可以点击咨询在线客服。客服确认是账号主人之后，会再次开启编辑权限，则可以继续在个人信息页面进行编辑，提交及完成一次修改。</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import Headertop from "@/components/Header";
export default {
  components: {
    Headertop
  }
};
</script>


<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";

* {
  margin: 0;
  padding: 0;
  list-style: none;
  -webkit-tap-highlight-color: transparent;
}

img {
  display: block;
}

a {
  text-decoration: none;
}
body {
  font-family: "Microsoft Yahei";
}

.faq {
  background-color: #1f212e;
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 1.2rem;
  box-sizing: border-box;
}
main {
  width: 100%;
  position: relative;
  background: #1f212f;
  background-size: 100% 100%;
  height: 100vh;
  overflow-y: auto;
  overflow: hidden;
}
.content {
  margin: 0.1rem;
}
.con {
  margin: 0 auto;
}

.con h1 {
  font-size: 0.38rem;
  color: #bd9e5d;
  margin-bottom: 0.2rem;
}
.con p {
  font-size: 0.28rem;
  color: #70748f;
  line-height: 0.35rem;
}
.text {
  margin: 0.3rem;
}
</style>
