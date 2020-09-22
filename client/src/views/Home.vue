<template>
  <div id="home">
    <!-- 导航栏 -->
    <header class="header"
            ref="header">
      <nav>
        <h1>芝麻奶酪</h1>
        <ul ref="navList"
            @click="scroll">
          <li class="active"
              data-index="0">首页</li>
          <li data-index="1">功能介绍</li>
          <li data-index="2">使用教程</li>
          <li data-index="3">关于我们</li>
          <li ref="active"></li>
        </ul>
      </nav>
    </header>
    <section>
      <div class="container">
        <div class="content">
          <h1>芝麻奶酪</h1>
          <h2>微信小程序点餐系统</h2>
        </div>
      </div>
      <div class="container"></div>
      <div class="container"></div>
      <div class="container"></div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: "",
      a: 0,
      b: 0,
      // sum: 0,
    };
  },
  computed: {
    sum() {
      return a + b;
    },
  },
  watch: {
    a() {
      this.sum = a + b;
    },
  },
  methods: {
    scroll(e) {
      if (this.timer) {
        return;
      }
      // 起点位置
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // 获取网页可见区域
      let height = document.body.clientHeight;
      let { index } = e.target.dataset;
      // 设置终点位置
      let end = index * height;
      // 设置速度
      let speed = (end - scrollTop) / 0.3 / 60;
      this.timer = setInterval(() => {
        scrollTop += speed;
        if (
          (speed >= 0 && scrollTop >= end) ||
          (speed <= 0 && scrollTop <= end)
        ) {
          document.documentElement.scrollTop = end;
          this.handleScroll();
          clearInterval(this.timer);
          this.timer = null;
          return;
        }
        document.documentElement.scrollTop = scrollTop;
        this.handleScroll();
      }, 16);
    },
    handleScroll(e) {
      // 滚动条偏移量
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // 获取网页可见区域
      let height = document.body.clientHeight - 10;
      // 获取导航栏dom元素
      let header = this.$refs.header;
      // 获取导航栏列表
      let navList = this.$refs.navList.children;
      // 获取选中样式的选择框dom元素
      let active = this.$refs.active;
      // 添加固定导航栏样式
      if (scrollTop == 0) {
        header.classList.remove("fixed");
      } else if (scrollTop != 0 && !header.classList.contains("fixed")) {
        header.classList.add("fixed");
      }
      let index = parseInt(scrollTop / height);
      if (!navList[index].classList.contains("active")) {
        for (let val of navList) {
          if (val.classList.contains("active")) {
            val.classList.remove("active");
            return;
          }
        }
        navList[index].classList.add("active");
        // 移动选中框
        active.style.left = 100 * index + "px";
      }

      // console.log(scrollTop, navList);
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  height: 100%;
  user-select: none;

  .header {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    padding: 16px;
    color: #fff;
    z-index: 99;

    nav {
      width: 900px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      cursor: pointer;

      h1 {
        padding: 10px;
        font-size: 20px;
        font-weight: bold;
      }

      ul {
        display: flex;
        position: relative;

        li {
          width: 100px;
          padding: 10px 0;
          text-align: center;
        }
        li:last-child {
          position: absolute;
          height: 46px;
          left: 0;
          border-bottom: 1px solid #f33;
          box-sizing: border-box;
          transition: all 0.3s ease-in-out;
          z-index: -1;
        }
        .active {
          color: #f33;
        }
      }
    }
  }
  .fixed {
    color: #424242;
    background-color: rgba(255, 255, 255, 0.7);
  }
  section {
    width: 100%;
    height: 100%;

    .container {
      width: 100%;
      height: 100%;
      background-attachment: fixed;
      background-size: cover;
      position: relative;
    }
    .container:nth-child(1) {
      background-image: url("../assets/images/background.jpg");

      .content {
        width: 500px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #fff;

        h1 {
          width: 100%;
          font-size: 64px;
          padding: 20px 0;
        }
        h2 {
          font-size: 32px;
          padding: 20px 0;
          font-weight: 400;
        }
      }
    }
    .container:nth-child(2) {
      background-image: url("../assets/images/bannerNew.jpg");
    }
    .container:nth-child(3) {
      background-image: url("../assets/images/bannerNewTakeout2017.jpg");
    }
    .container:nth-child(4) {
      background-image: url("../assets/images/regBackground.png");
    }
  }
}
</style>
