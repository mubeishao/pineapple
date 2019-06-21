<template>
  <div class="page-helper">
    <div class="page-list">
      <span class="page-item clickBtn" @click="jumpPage(1)">
        <span class="end">首页</span>
      </span>
      <div class="page2 clickBtn" :class="{'disabled': currentPage === 1}" @click="prevPage">
        <img src="../common/images/agentleft.png">
      </div>

      <span class="pageitem">{{currentPage}}/{{totalPage}}</span>

      <div
        class="page3 clickBtn"
        :class="{'disabled': currentPage === totalPage}"
        @click="nextPage"
      >
        <img src="../common/images/agentright.png">
      </div>
      <span class="page-item clickBtn" @click="jumpPage(totalPage)">
        <span class="end">尾页</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["totalCount", "PageSize", "pageNumber"],
  data() {
    return {
      currentPage: this.pageNumber,
      currentSize: this.PageSize,
      jumpPageNumber: 1,
      showPrevMore: false,
      showNextMore: false
    };
  },

  computed: {
    showPageHelper() {
      return this.totalCount > 0;
    },
    totalPage() {
      //总页数
      return Math.ceil(this.totalCount / this.PageSize);
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.jumpPage(this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPage) {
        this.jumpPage(this.currentPage + 1);
      }
    },

    jumpPage(pageNumber) {
      if (pageNumber == 0) {
        return;
      }
      if (this.currentPage !== pageNumber) {
        //点击的页码不是当前页码
        this.currentPage = pageNumber;
        //父组件通过change方法来接受当前的页码
        this.$emit("jumpPage", {
          currentPage: this.currentPage,
          currentSize: this.currentSize
        });
      }
    }
  },

  watch: {
    currentSize(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (this.currentPage >= this.totalPage) {
          //当前页面大于总页面数
          this.currentPage = this.totalPage;
        }
        this.$emit("jumpPage", {
          currentPage: this.currentPage,
          currentSize: this.currentSize
        });
      }
    }
  }
};
</script>

<style scoped>
.page-helper {
  font-weight: 500;
  height: 1rem;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #171723;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-list {
  width: 74%;
  display: flex;
  align-items: center;
  font-size: 0;
  height: 30px;
  line-height: 30px;
  margin: 0 auto;
}
.page2,
.page3 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 0.7rem;
  height: 0.46rem;
  line-height: 0.5rem;
}
.page2 img,
.page3 img {
  height: 100%;
}
.page-list span {
  flex: 1;
  font-size: 0.24rem;
  user-select: none;
}
.page-list .page-item {
  cursor: pointer;
  color: #636889;
}

.page-list .page-item .disabled {
  pointer-events: none;
  background: #ddd;
}
.end {
  padding: 0.06rem 0.12rem;
  border: 0.02rem solid #636889;
  border-radius: 0.16rem;
  color: #636889;
}
</style>
