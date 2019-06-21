<template>
  <div class="changepwd">
    <header-top title="修改密码"/>
    <div class="content">
      <div class="img">
        <img src="../common/images/changepwd.png">
      </div>
      <div class="query">
        <div class="bord">
          <i class="fas fa-unlock-alt"></i>
          <input type="password" v-model="password" placeholder="输入旧密码,必须是8-16位">
        </div>
        <div class="bord">
          <i class="fas fa-lock"></i>
          <input type="password" v-model="newPassword" placeholder="输入新密码,必须是8-16位">
        </div>
        <div class="bord">
          <i class="fas fa-lock"></i>
          <input type="password" v-model="confirmPassword" placeholder="再次输入新密码,必须是8-16位">
        </div>
      </div>
      <div class="sumbit clickBtn" @click.prevent="changePwd()">确定</div>
    </div>
  </div>
</template>
<script>
import HeaderTop from "../components/Header";
import { getChangeMemPwd } from "../api/interface";
export default {
  data() {
    return {
      password: "",
      newPassword: "",
      confirmPassword: ""
    };
  },
  computed: {
    passWordSet() {
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password);
    },
    newpassWordSet() {
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(
        this.newPassword
      );
    }
  },
  methods: {
    async changePwd() {
      let {
        password,
        newPassword,
        confirmPassword,
        passWordSet,
        newpassWordSet
      } = this;
      if (password == "" || newPassword == "" || confirmPassword == "") {
        this.$toast("密码不能为空");
        return;
      }

      if (this.passWordSet == false) {
        this.$toast("登录密码必须是8-16位，包括数字+字母的组合");
        return;
      }
      if (this.newpassWordSet == false) {
        this.$toast("登录密码必须是8-16位，包括数字+字母的组合");
        return;
      }
      if (newPassword != confirmPassword) {
        this.$toast("两次密码设置的不一致");
        return false;
      }
      let data = { password, newPassword, confirmPassword };
      let res = await getChangeMemPwd(data);
      console.log(res);
      if (res.result == 1) {
        let instance = this.$toast(res.message);
        setTimeout(() => {
          instance.close();
          this.$router.go(-1);
        }, 1000);
      } else if (res.result == 0) {
        this.$toast(res.message);
      } else {
        this.$toast("请求失败");
      }
    }
  },
  components: {
    HeaderTop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.content {
  margin: remCalc(21) auto;
  width: 100%;
  text-align: center;
}
.img img {
  display: block;
  width: 2rem;
  height: 2rem;
  margin: 0 auto;
}
.query {
  width: 75%;
  margin: 0.4rem auto;
}
.bord {
  position: relative;
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding-top: 0.6rem;
  font-size: 0.24rem;
  i {
    width: 10vw;
    padding-bottom: calc(0.1rem + 1px);
  }
  input {
    background-color: transparent;
    border-bottom: 1px solid #424559;
    padding-bottom: 0.1rem;
    color: rgb(202, 202, 202);
    box-sizing: border-box;
    width: 100%;
    outline: none;
  }
}
.martop {
  margin: 0.3rem auto;
}
.sumbit {
  width: 38%;
  border-radius: 0.5rem;
  font-size: 0.24rem;
  color: #ffffff;
  margin: 0.6rem auto;
  text-align: center;
  height: 0.6rem;
  line-height: 0.6rem;
  background: linear-gradient(to right, #18cffe, #0fb4f4, #018ee5);
}
</style>
