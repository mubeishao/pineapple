<template>
  <div class="authentication">
    <header-top title="个人认证"/>
    <main>
      <div class="tureName">
        <div class="accout magrTop phone">
          <p class="name">银行卡实名:</p>
          <input type="text" :value="userInfo.name" readonly>
        </div>
        <div class="accout phone">
          <p class="name">银行卡账号:</p>
          <input type="text" :value="userInfo.carNo" readonly>
        </div>
      </div>
      <div class="go clickBtn" @click="bindcard()">
        <p class="bindacc">{{userInfo.isBindCard==='True'?'修改银行卡':'前进绑定'}}</p>
      </div>
    </main>
  </div>
</template>
<script>
import { mapState } from "vuex";
import HeaderTop from "../components/Header";
import Storage from "../common/utils/storage";
export default {
  data() {
    return {
      CardName: "",
      carNo: "", //银行卡账号
      userInfo: {}
    };
  },
  mounted() {
    this.userInfo = Storage.get("userInfo");
    this.userInfo.carNo = this.userInfo.carNo
      ? this.userInfo.carNo.substring(0, 7) +
        "*******" +
        this.userInfo.carNo.substring(14, 18)
      : "未绑定";
    this.userInfo.name = this.userInfo.realName
      ? this.sum(this.userInfo.realName)
      : "未绑定";
    // if (this.userInfo.realName) {
    //   this.sum(this.userInfo.realName);
    // }

    // if(localStorage.getItem('bindcard')){
    //        this.CardName = noBind;
    //        this.CardAccount = noBind;
    // }else{

    // }
  },
  computed: {
    ...mapState({
      mainInfo: state => state.mainInfo
    })
  },
  methods: {
    bindcard() {
      if (this.userInfo.isBindCard === "True") {
        this.$router.push({ name: "ChangeBankCard" });
      } else {
        this.$router.push({ name: "Bindbankcard" });
      }
    },
    sum(a) {
      // var a='abcdedfg';
      var num = a.length;
      var str = a[0];
      for (var i = 0; i < num - 1; i++) {
        str += "*";
      }
      return str;
      this.userInfo.name = str;
    }
  },
  components: {
    HeaderTop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
main {
  padding-top: remCalc(21);
}
.tureName {
  width: 100%;
  padding: 0 12.5%;
  box-sizing: border-box;
  text-align: center;
  background: #1c1b29;
  height: 2.4rem;
  margin: 0 auto;
  margin-bottom: 0.5rem;
}
.card {
  flex: 2;
  height: 0.6rem;
  line-height: 0.6rem;
  background: #13121c;
  outline: none;
  border: 0.01rem solid #3a3d55;
  margin-top: 0.2rem;
}
.magrTop {
  padding-top: 0.2rem;
}
.go img {
  display: block;
  width: 100%;
  height: 100%;
}
.phone {
  position: relative;
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding-top: 0.6rem;
  font-size: 0.28rem;
  .name {
    padding-bottom: calc(0.1rem);
    margin-right: 0.2rem;
  }
  i {
    width: 10vw;
    padding-bottom: calc(0.1rem + 1px);
  }
  input {
    padding-bottom: 0.1rem;
    color: rgb(202, 202, 202);
    box-sizing: border-box;
    flex-grow: 1;
    font-size: 0.24rem;
    background: none;
    outline: none;
    padding: remCalc(8) remCalc(10);
    &.withGetCode {
      padding-right: 1.4rem;
    }
  }
  .getCode {
    box-sizing: border-box;
    position: absolute;
    right: 0;
    bottom: calc(0.1rem + 1px);
    border-radius: 0.4rem;
    text-align: center;
    background: #3b405e;
    border: none;
    outline: none;
    height: 0.33rem;
    font-size: 0.2rem;
    & ~ input {
      background-color: #fff;
    }
  }
}
.bindacc {
  width: 75%;
  border-radius: 0.5rem;
  font-size: 0.28rem;
  color: #ffffff;
  margin: 0.6rem auto;
  text-align: center;
  height: 0.7rem;
  line-height: 0.7rem;
  background: linear-gradient(to right, #18cffe, #0fb4f4, #018ee5);
}
</style>
