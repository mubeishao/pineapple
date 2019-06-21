<template>
  <div class="basic">
    <Headertop title="基本资料"/>
    <div class="document">
      <ul class="content">
        <li class="name">
          <span>昵称：</span>
          <input v-model="nickName">
        </li>
        <li class="sex">
          <span>性别：</span>
          <img :src="genderImageMan" @click.prevent="selectGender(0)" class="man">
          <img :src="genderImageWoman" @click.prevent="selectGender(1)" class="woman">
        </li>
      </ul>
      <div class="circle">
        <div
          v-for="(img,i) in headImgMan"
          v-show="gender===0"
          :key="img.name+i"
          @click="selectImageMan(i,img.name)"
          :class="showBJ?'chargeBJ':'noBJ'"
        >
          <img :src="img.url">
        </div>
        <div
          v-for="(img,i) in headImgWoman"
          v-show="gender===1"
          :key="img.name+i"
          @click="selectImageWoman(i,img.name)"
          :class="showBJ?'chargeBJ':'noBJ'"
        >
          <img :src="img.url">
        </div>
      </div>
      <div class="avatar">
        <div class="avatarImg" :style="`background-image: url(${url})`">
          <input
            type="file"
            class="inputfile"
            accept="image/png, image/jpeg"
            @change="onFileChange"
            ref="files"
          >
        </div>
        <img src="../common/images/setsumbit.png" class="sumbit clickBtn" @click.prevent="sumbit()">
      </div>
    </div>
  </div>
</template>
<script>
import Headertop from "../components/Header";
import { getNickName, uploadBase64 } from "../api/interface";
import Storage from "../common/utils/storage";
export default {
  data() {
    return {
      showSelected: false,
      gender: 0,
      preveDiv: null,
      showBJ: true,
      nickName: Storage.get("userInfo").name,
      headUrl: "",
      url: require("@/common/images/avatarshang.png"),
      isUploading: false,
      headImgMan: [
        {
          name: "m_01.png",
          url: this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + "m_01_h.png"
        },
        {
          name: "m_02.png",
          url: this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + "m_02_h.png"
        },
        {
          name: "m_03.png",
          url: this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + "m_03_h.png"
        },
        {
          name: "m_04.png",
          url: this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + "m_04_h.png"
        }
      ],
      headImgWoman: [
        {
          name: "w_01.png",
          url: this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + "w_01_h.png"
        },
        {
          name: "w_02.png",
          url: this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + "w_02_h.png"
        },
        {
          name: "w_03.png",
          url: this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + "w_03_h.png"
        },
        {
          name: "w_04.png",
          url: this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + "w_04_h.png"
        }
      ],
      loadImage: require("blueimp-load-image"),
      base64data: ""
    };
  },
  mounted() {
    this.url = `${this.$CONFIG.HEAD_IMAGE_URL}${
      Storage.get("userInfo").headUrl
    }`;
    this.headUrl = Storage.get("userInfo").headUrl;
    this.gender = Storage.get("userInfo").Gender
      ? Storage.get("userInfo").Gender
      : 0;
  },
  computed: {
    genderImageMan() {
      return this.gender === 0
        ? require("@/common/images/sexman.png")
        : require("@/common/images/sexman1.png");
    },
    genderImageWoman() {
      return this.gender === 1
        ? require("@/common/images/sexwoman.png")
        : require("@/common/images/sexwoman2.png");
    }
  },
  methods: {
    // 翻轉圖片
    rotation(file) {
      var vm = this;
      // console.log(this.$EXIF);
      var orientation;
      this.$EXIF.getData(file, function() {
        vm.$EXIF.getAllTags(this);
        orientation = vm.$EXIF.getTag(this, "Orientation");
      });

      return new Promise(res => {
        var reader = new FileReader();
        reader.onload = function(readerEvent) {
          var face_image = new Image();
          face_image.onload = function() {
            let canvas = document.createElement("canvas");
            vm.drawPhotoImage(this, canvas, face_image, orientation);
            vm.base64data = canvas.toDataURL("image/jpeg", 0.8);
            res();
          };
          face_image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
      });
    },
    drawPhotoImage(image, canvas, face_image, orientation) {
      var max_size = 544,
        rate = face_image.width / face_image.height,
        width = 100,
        height = width * rate;
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }

      canvas.width = width;
      canvas.height = height;
      // if (navigator.userAgent.match(/iphone/i)) {
      if (orientation != "" && orientation != 1) {
        switch (orientation) {
          case 6:
            this.rotateImg(image, "left", canvas, width, height);
            break;
          case 8:
            this.rotateImg(image, "right", canvas, width, height);
            break;
          case 3:
            /*
          //原资料中旋转180度方法为调用两遍90度 但是我这边不起作用 所以增加一种新的方式 => right2
          rotateImg(image, 'right', canvas, width, height);
          rotateImg(image, 'right', canvas, width, height);*/
            this.rotateImg(image, "right2", canvas, width, height);
            break;
          default:
            canvas.getContext("2d").drawImage(face_image, 0, 0, width, height);
            break;
        }
      } else {
        canvas.getContext("2d").drawImage(face_image, 0, 0, width, height);
      }
      // } else if (get_ua_info()) {
      //   this.rotateImg(image, "left", canvas, width, height);
      // } else {
      //   canvas.getContext("2d").drawImage(face_image, 0, 0, width, height);
      // }
    },
    rotateImg(img, direction, canvas, width, height) {
      var min_step = 0;
      var max_step = 3;
      if (img == null) {
        return;
      }
      var step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        step > max_step && (step = min_step);
      } else if (direction == "right2") {
        step = 2;
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      var degree = (step * 90 * Math.PI) / 180;
      var ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height, width, height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height, width, height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0, width, height);
          break;
      }
    },
    // 選擇圖片時上傳圖片
    async onFileChange(e) {
      this.isUploading = true;
      var file = e.target.files[0];

      await this.rotation(file);

      // var imgData = new FormData();
      // imgData.append(file.name, file);
      // console.log(3);

      // this.$axios({
      //   url: this.$CONFIG.BASE_URL+"/Home/UploadBase64",
      //   method: "post",
      //   timeout: 5000,
      //   // data: imgData,
      //   data: {
      //     base64img: this.base64data
      //   },
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("token"),
      //     "Content-Type": "application/json"
      //   }
      // })
      //   .then(res => {
      //     console.log(res);
      //     if (res.data.result === 1) {
      //       // this.url = URL.createObjectURL(file);
      //       this.url = this.base64data;
      //       this.headUrl = res.data.data
      //       // console.log(this.url);
      //     }
      //     this.$toast(res.data.message);
      //     this.isUploading = false;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.isUploading = false;
      //   });

      // 正式
      uploadBase64({base64img:this.base64data})
        .then(res => {
          console.log(res);
          // this.headUrl = res.data.data;

          if (res.result === 1) {
            // this.url = URL.createObjectURL(file);
            this.url = this.base64data;
            this.headUrl = res.data
            // console.log(this.url);
          }
          this.$toast(res.message);
          this.isUploading = false;
        })
        .catch(err => {
          console.log(err);
          this.isUploading = false;
        });
    },
    //選擇性別
    selectGender(gender) {
      this.gender = gender;
      if (gender === 0) {
        for (let index = 0; index < this.headImgWoman.length; index++) {
          this.headImgWoman[index].url =
            this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + `w_0${index + 1}_h.png`;
        }
      }
      if (gender === 1) {
        for (let index = 0; index < this.headImgMan.length; index++) {
          this.headImgMan[index].url =
            this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + `m_0${index + 1}_h.png`;
        }
      }
    },
    async sumbit() {
      if (this.isUploading) {
        this.$toast("请等图片上传再进行操作");
        return;
      }
      const { nickName, gender, headUrl } = this;
      if (!nickName) {
        this.$toast("请先设置昵称");
        return;
      }
      if (!(gender === 1 || gender === 0)) {
        this.$toast("请先选择性别");
        return;
      }
      if (!headUrl) {
        this.$toast("请先选择头像");
        return;
      }

      let dataArr = {
        nickName,
        gender,
        headUrl
      };

      let res = await getNickName(dataArr);
      if (res.result == 1) {
        console.log(res);
        this.$toast(res.message);
        setTimeout(() => {
          this.$router.push({ name: "Main" });
        }, 1000);
      }
    },
    // 選默認頭像圖片
    selectImageMan(i, name) {
      if (
        this.headImgMan[i].url ===
        this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + `m_0${i + 1}.png`
      ) {
        return false;
      }
      this.headUrl = name;
      for (let index = 0; index < this.headImgMan.length; index++) {
        this.headImgMan[index].url =
          this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + `m_0${index + 1}_h.png`;
      }
      if (this.headImgMan[i]) {
        this.headImgMan[i].url =
          this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + `m_0${i + 1}.png`;
      }
      this.url = this.headImgMan[i].url;
    },
    selectImageWoman(i, name) {
      if (
        this.headImgWoman[i].url ===
        this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + `w_0${i + 1}.png`
      ) {
        return false;
      }
      this.headUrl = name;
      for (let index = 0; index < this.headImgWoman.length; index++) {
        this.headImgWoman[index].url =
          this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + `w_0${index + 1}_h.png`;
      }
      if (this.headImgWoman) {
        this.headImgWoman[i].url =
          this.$CONFIG.HEAD_IMAGE_URL_DEFAULT + `w_0${i + 1}.png`;
      }
      this.url = this.headImgWoman[i].url;
    }
  },
  components: {
    Headertop
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/scss/variable.scss";
.basic {
  height: 100vh;
  width: 100%;
  background-color: #1f212e;
}
.document {
  width: 100%;
  margin: 0 auto;
  margin-top: 1.3rem;
  padding-top: remCalc(21);
  text-align: center;
}
.circle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10%;
  height: 1.2rem;
  line-height: 1.2rem;
  background: #1c1b29;
  text-align: center;
  margin: 0 auto;
}
.circle div {
  margin: 0 0.3rem;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  box-sizing: border-box;
  border: 0.01rem solid #7e7e7e;
  overflow: hidden;
  position: relative;
}
.circle div img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.content {
  width: 90%;
  margin: 0 auto;
  font-size: 0.24rem;
}
.content li {
  border-bottom: 0.01rem solid #424559;
  margin-bottom: 0.4rem;
}

.name,
.sex {
  display: flex;
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 0.24rem;
}
.chargeBJ {
  border: 0.04rem solid #816118;
}
.noBJ {
  border: 0.03rem solid #7e7e7e;
}
.name span {
  padding: 0 0.2rem;
  width: 1rem;
  text-align: left;
}
.name input {
  background: none;
  outline: none;
  border: none;
}
.sex span {
  padding: 0 0.2rem;
  width: 1rem;
  text-align: left;
}
.sex img {
  width: 1.1rem;
  height: 0.4rem;
}
.man {
  width: 1rem;
  height: 0.4rem;
}
.woman {
  width: 1rem;
  height: 0.4rem;
  margin-left: 0.3rem;
}

.avatar {
  width: 100%;
  margin: 0.5rem auto;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
}

.avatar img {
  display: block;
}
.avatarImg {
  width: 2.4rem;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  height: 2.4rem;
  margin: 0.6rem auto;
}
.avatarImg input {
  display: block;
  width: 2.4rem;
  height: 2.4rem;
  margin: 0 auto;
  max-width: 3rem;
}
.sumbit {
  display: block;
  width: 3.5rem;
  height: 0.8rem;

  margin: 0 auto;
}
.inputfile {
  width: 2.3rem;
  height: 2.2rem;
  border-radius: 50%;
  border: none;
  outline: none;
  font-size: 0.2rem;
  opacity: 0;
  background-size: 100% 100%;
}
</style>
