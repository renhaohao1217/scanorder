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
    <!-- 内容区域 -->
    <section>
      <!-- 首页 -->
      <div class="container">
        <div class="content">
          <h1>芝麻奶酪</h1>
          <h2>微信小程序点餐系统</h2>
        </div>
      </div>
      <!-- 功能介绍第一页 -->
      <div class="container">
        <div class="content">
          <div class="left">
            <h2>支持扫码点餐和服务员点餐（兼顾年轻用户和传统用户）</h2>
            <p>
              <span>扫码点餐：</span>
              顾客扫码点餐，能够最大限度的减少服务员工作量，缓解用餐高峰期服务员人力的不足，提高服务员工作效率，降低运营人力成本，而且点餐过程更加方便、快捷，受到广大年轻消费者的欢迎，不但能体现餐厅的科技感，更能显著提升客户满意度，增加回头率
            </p>
            <p>
              <span>服务员点餐：</span>
              芝麻奶酪也支持传统的服务员点餐。
              有些传统顾客不习惯扫码点餐，也能轻松应对。
            </p>
          </div>
          <div class="right page">
            <div class="box"></div>
            <div class="blank"></div>
            <img src="../assets/images/1.jpg" />
          </div>
        </div>
      </div>
      <!-- 功能介绍第二页 -->
      <div class="container">
        <div class="content">
          <h2>产品功能展示</h2>
          <el-carousel :interval="5000"
                       arrow="always"
                       height="520px">
            <!-- 点餐 -->
            <el-carousel-item>
              <div class="left">
                <h3>点餐</h3>
                <p>支持桌位号点餐和流水号点餐模式</p>
              </div>
              <img src="../assets/images/6.jpg" />
            </el-carousel-item>
            <!-- 菜单 -->
            <el-carousel-item>
              <div class="left">
                <h3>菜单</h3>
                <p>人性化设计（菜单编辑所见即所得）</p>
              </div>
              <div class="right">
                <img src="../assets/images/2.jpg" />
              </div>
            </el-carousel-item>
            <!-- 任务 -->
            <el-carousel-item>
              <div class="left">
                <h3>我的任务</h3>
                <p>厨房任务显示系统</p>
              </div>
              <div class="right">
                <img src="../assets/images/3.jpg" />
              </div>
            </el-carousel-item>
            <!-- 订单 -->
            <el-carousel-item>
              <div class="left">
                <h3>订单详情</h3>
                <p>在这里进行查看，结账，等人性化操作</p>
              </div>
              <div class="right">
                <img src="../assets/images/4.jpg" />
              </div>
            </el-carousel-item>
            <!-- 报表 -->
            <el-carousel-item>
              <div class="left">
                <h3>报表</h3>
                <p>订单太多～日结算账累？经营报表帮您搞定，顺便还能知道什么菜品最畅销哦</p>
              </div>
              <div class="right">
                <img src="../assets/images/5.jpg" />
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!-- 使用教程 -->
      <div class="container">
        <div class="content">
          <h2>开通步骤</h2>
          <ul>
            <li>
              <h3>1</h3>
              <h4>注册新店</h4>
              <p>注册芝麻奶酪店铺账号</p>
            </li>
            <li>
              <h3>2</h3>
              <h4>提交开通资料</h4>
              <p>提交资料开通小程序与微信支付商户账号</p>
            </li>
            <li>
              <h3>3</h3>
              <h4>录入商品上线运营</h4>
              <p>录入销售商品，提交小程序上线运营</p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 关于我们 -->
      <div class="container">
        <!-- 视频背景 -->
        <video src="../assets/images/didi-home-video0626.mp4"
               autoplay
               muted
               loop></video>
        <!-- 内容 -->
        <div class="content">
          <div class="left">
            <h2>芝麻奶酪</h2>
            <h3>用心服务 让技术赋能线下门店</h3>
          </div>
          <div class="right">
            <img src="../assets/images/oZaeX5B1QMDulq-HAIhEeXVEojeE.jpg">
            <h2>微信小程序</h2>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: "",
    };
  },
  methods: {
    scroll(e) {
      if (this.timer) {
        return;
      }
      // 获取滑轮滚动的距离
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // 获取网页可见区域的高度
      let height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      // 获取触发事件的索引值
      let { index } = e.target.dataset;
      // 设置终点位置
      let height_arr = [0 * height, 1 * height, 3 * height, 4 * height];
      let end = height_arr[index];
      // 设置速度
      let speed = (end - scrollTop) / 0.3 / 60;
      // 移动
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
      // 获取网页可见区域的高度
      let height =
        window.innerHeight - 10 ||
        document.documentElement.clientHeight - 10 ||
        document.body.clientHeight - 10;
      // 获取导航栏dom元素
      let header = this.$refs.header;
      // 获取导航栏列表
      let navList = this.$refs.navList.children;
      // 获取选中样式的选择框dom元素
      let active = this.$refs.active;
      // 添加固定导航栏样式
      if (scrollTop == 0 || scrollTop > height * 4) {
        header.classList.remove("fixed");
      } else if (scrollTop != 0 && !header.classList.contains("fixed")) {
        header.classList.add("fixed");
      }
      // 设置导航栏选中
      let index = parseInt(scrollTop / height);
      if (index > 1) {
        index--;
      }
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
    },
  },
  mounted() {
    // 绑定滚动事件
    window.addEventListener("scroll", this.handleScroll);
    // 实现放大图片的功能
    const page = document.querySelector(".page");
    page.addEventListener("mouseenter", (event) => {
      const box = event.currentTarget.children[0];
      const blank = event.currentTarget.children[1];
      box.style.display = "block";
      blank.style.display = "block";
      const handle = (event) => {
        const rect = page.getBoundingClientRect();
        let left = event.clientX - rect.left;
        let top = event.clientY - rect.top;
        if (left < 75) {
          left = 75;
        } else if (left > 165) {
          left = 165;
        }
        if (top < 75) {
          top = 75;
        } else if (top > 445) {
          top = 445;
        }
        blank.style.left = left - 75 + "px";
        blank.style.top = top - 75 + "px";
        box.style.backgroundPosition = `-${(left - 75) * 3}px -${
          (top - 75) * 3
        }px`;
      };
      page.addEventListener("mousemove", handle);
      page.addEventListener("mouseleave", () => {
        box.style.display = "none";
        blank.style.display = "none";
        page.removeEventListener("mousemove", handle);
      });
    });
  },
  beforeDestroy() {
    // 移除滚动事件
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style lang="scss" scoped>
// 页面的样式
#home {
  width: 100%;
  height: 100%;
  user-select: none;
  // 导航栏的样式
  .header {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    color: #fff;
    z-index: 99;
    // 菜单栏
    nav {
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      // 标题
      h1 {
        padding: 10px;
        font-weight: bold;
      }
      // 列表
      ul {
        display: flex;
        position: relative;
        li {
          width: 100px;
          padding: 10px 0;
          text-align: center;
        }
        //  动画效果
        li:last-child {
          position: absolute;
          height: 46px;
          left: 0;
          border-bottom: 1px solid #f33;
          box-sizing: border-box;
          transition: all 0.3s ease-in-out;
          z-index: -1;
        }
        // 被选中的样式
        .active {
          color: #f33;
        }
      }
    }
  }
  // 固定导航栏的样式
  .fixed {
    color: #424242;
    background-color: rgba(255, 255, 255, 0.7);
  }
  // 页面容器的样式
  section {
    width: 100%;
    height: 100%;
    // 每个页面的样式
    .container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-attachment: fixed;
      background-size: cover;
      background-position: center;
      position: relative;
      // 内容通用的样式
      .content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    // 首页
    .container:nth-child(1) {
      background-image: url("../assets/images/background.jpg");
      // 内容
      .content {
        text-align: center;
        color: #fff;
        h1 {
          padding: 20px 0;
        }
        h2 {
          padding: 20px 0;
          font-weight: 400;
        }
      }
    }
    // 功能介绍第一页
    .container:nth-child(2) {
      background-image: url("../assets/images/regBackground.png");
      // 内容
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // 左边内容
        .left {
          h2 {
            color: #f33;
          }
          p {
            color: #696969;
            margin-top: 10px;
            line-height: 2;
            span {
              color: #424242;
              font-weight: bold;
            }
          }
        }
        // 右边内容
        .right {
          width: 240px;
          position: relative;
          img {
            width: 240px;
          }
          .box {
            position: absolute;
            display: none;
            left: -450px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            background: url("../assets/images/1.jpg");
            background-size: 720px;
            box-shadow: 0 0 10px #ccc;
          }
          .blank {
            position: absolute;
            width: 0;
            height: 0;
            border: 1px solid #ccc;
            display: none;
          }
        }
      }
    }
    // 功能介绍第二页
    .container:nth-child(3) {
      background-image: url("../assets/images/regBackground.png");
      // 内容
      .content {
        h2 {
          font-weight: 400;
          text-align: center;
        }
        .el-carousel__item {
          box-sizing: border-box;
          padding: 0 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // 左边内容
          .left {
            line-height: 2;
            h3 {
              color: #f33;
              font-weight: 400;
            }
            p {
              color: #424242;
            }
          }
        }
      }
    }
    // 使用教程
    .container:nth-child(4) {
      background-image: url("../assets/images/regBackground.png");
      // 内容
      .content {
        h2 {
          text-align: center;
          font-weight: 400;
        }
        ul {
          display: flex;
          justify-content: space-between;
          margin-top: 100px;
          li {
            width: 320px;
            height: 150px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            h3 {
              width: 40px;
              height: 40px;
              background-color: #07c060;
              border-radius: 50%;
              text-align: center;
              line-height: 40px;
              color: #fff;
            }
            h4 {
              font-weight: 400;
            }
            p {
              color: #424242;
            }
          }
        }
      }
    }
    // 关于我们
    .container:nth-child(5) {
      // 内容
      .content {
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // 左边内容
        .left {
          line-height: 2;
        }
        // 右边内容
        .right {
          h2 {
            text-align: center;
          }
        }
      }
    }
  }
  // pc端
  @media (min-width: 1200px) {
    // 导航栏的样式
    .header {
      padding: 16px;
      // 菜单栏
      nav {
        width: 900px;
        // 标题
        h1 {
          font-size: 20px;
        }
      }
    }
    // 页面容器的样式
    section {
      // 每个页面的样式
      .container {
        // 内容通用的样式
        .content {
          width: 900px;
        }
      }
      // 首页
      .container:nth-child(1) {
        // 内容
        .content {
          h1 {
            font-size: 64px;
          }
          h2 {
            font-size: 32px;
          }
        }
      }
      // 功能介绍第一页
      .container:nth-child(2) {
        // 内容
        .content {
          // 左边内容
          .left {
            width: 400px;
            h2 {
              font-size: 30px;
            }
          }
          .right {
            .box {
              width: 450px;
              height: 450px;
            }
            .blank {
              width: 150px;
              height: 150px;
            }
          }
        }
      }
      // 功能介绍第二页
      .container:nth-child(3) {
        // 内容
        .content {
          h2 {
            font-size: 24px;
          }
          .el-carousel__item {
            // 左边内容
            .left {
              width: 400px;
              h3 {
                font-size: 24px;
              }
            }
            // 右边内容
            img {
              width: 240px;
            }
          }
        }
      }
      // 使用教程
      .container:nth-child(4) {
        // 内容
        .content {
          h2 {
            font-size: 30px;
          }
          ul {
            li {
              width: 320px;
              height: 150px;
              h4 {
                font-size: 22px;
              }
              p {
                font-size: 14px;
              }
            }
          }
        }
      }
      // 关于我们
      .container:nth-child(5) {
        // 视频背景
        video {
          width: 100%;
        }
        // 内容
        .content {
          // 左边内容
          .left {
            h2 {
              font-size: 40px;
            }
            h3 {
              font-size: 20px;
            }
          }
          // 右边内容
          .right {
            h2 {
              font-size: 20px;
            }
            img {
              width: 150px;
              height: 150px;
            }
          }
        }
      }
    }
  }
  // 大屏端
  @media (min-width: 992px) and (max-width: 1199px) {
    // 导航栏的样式
    .header {
      padding: 16px;
      // 菜单栏
      nav {
        width: 900px;
        // 标题
        h1 {
          font-size: 24px;
        }
        // 列表
        ul {
          font-size: 20px;
        }
      }
    }
    // 页面容器的样式
    section {
      // 每个页面的样式
      .container {
        // 内容通用的样式
        .content {
          width: 900px;
        }
      }
      // 首页
      .container:nth-child(1) {
        // 内容
        .content {
          h1 {
            font-size: 80px;
          }
          h2 {
            font-size: 40px;
          }
        }
      }
      // 功能介绍第一页
      .container:nth-child(2) {
        // 内容
        .content {
          // 左边内容
          .left {
            width: 500px;
            h2 {
              font-size: 36px;
            }
            p {
              font-size: 24px;
            }
          }
        }
      }
      // 功能介绍第二页
      .container:nth-child(3) {
        // 内容
        .content {
          h2 {
            font-size: 36px;
            margin-bottom: 50px;
          }
          .el-carousel__item {
            // 左边内容
            .left {
              width: 400px;
              h3 {
                font-size: 30px;
              }
              p {
                font-size: 24px;
              }
            }
            // 右边内容
            img {
              width: 240px;
            }
          }
        }
      }
      // 使用教程
      .container:nth-child(4) {
        // 内容
        .content {
          h2 {
            font-size: 36px;
          }
          ul {
            margin-top: 100px;
            li {
              width: 30%;
              h4 {
                font-size: 26px;
              }
              p {
                font-size: 20px;
              }
            }
          }
        }
      }
      // 关于我们
      .container:nth-child(5) {
        // 视频背景
        video {
          height: 100%;
        }
        // 内容
        .content {
          // 左边内容
          .left {
            h2 {
              font-size: 40px;
            }
            h3 {
              font-size: 24px;
            }
          }
          // 右边内容
          .right {
            h2 {
              font-size: 24px;
            }
            img {
              width: 150px;
              height: 150px;
            }
          }
        }
      }
    }
  }
  // 中屏端
  @media (min-width: 768px) and (max-width: 991px) {
    // 导航栏的样式
    .header {
      padding: 16px 0;
      // 菜单栏
      nav {
        width: 700px;
        // 标题
        h1 {
          font-size: 20px;
        }
      }
    }
    // 页面容器的样式
    section {
      // 每个页面的样式
      .container {
        // 内容通用的样式
        .content {
          width: 700px;
        }
      }
      // 首页
      .container:nth-child(1) {
        // 内容
        .content {
          h1 {
            font-size: 60px;
          }
          h2 {
            font-size: 30px;
          }
        }
      }
      // 功能介绍第一页
      .container:nth-child(2) {
        // 内容
        .content {
          // 左边内容
          .left {
            width: 400px;
            h2 {
              font-size: 30px;
            }
          }
        }
      }
      // 功能介绍第二页
      .container:nth-child(3) {
        // 内容
        .content {
          h2 {
            font-size: 24px;
            margin-bottom: 50px;
          }
          .el-carousel__item {
            // 左边内容
            .left {
              h3 {
                font-size: 24px;
              }
            }
            // 右边内容
            img {
              width: 240px;
            }
          }
        }
      }
      // 使用教程
      .container:nth-child(4) {
        // 内容
        .content {
          h2 {
            font-size: 30px;
          }
          ul {
            margin-top: 100px;
            li {
              h4 {
                font-size: 24px;
              }
              p {
                font-size: 16px;
              }
            }
          }
        }
      }
      // 关于我们
      .container:nth-child(5) {
        // 视频背景
        video {
          height: 100%;
        }
        // 内容
        .content {
          // 左边内容
          .left {
            h2 {
              font-size: 40px;
            }
            h3 {
              font-size: 20px;
            }
          }
          // 右边内容
          .right {
            h2 {
              font-size: 20px;
            }
            img {
              width: 150px;
              height: 150px;
            }
          }
        }
      }
    }
  }
  // 手机端
  @media (max-width: 767px) {
    // 导航栏的样式
    .header {
      display: none;
    }
    // 页面容器的样式
    section {
      // 每个页面的样式
      .container {
        // 内容通用的样式
        .content {
          width: 100%;
        }
      }
      // 首页
      .container:nth-child(1) {
        // 内容
        .content {
          h1 {
            font-size: 36px;
          }
          h2 {
            font-size: 24px;
          }
        }
      }
      // 功能介绍第一页
      .container:nth-child(2) {
        // 内容
        .content {
          // 左边内容
          .left {
            h2 {
              font-size: 16px;
            }
            p {
              font-size: 14px;
            }
          }
          // 右边内容
          .right {
            width: 160px;
            img {
              width: 160px;
            }
          }
        }
      }
      // 功能介绍第二页
      .container:nth-child(3) {
        // 内容
        .content {
          h2 {
            font-size: 22px;
          }
          .el-carousel__item {
            display: flex;
            flex-direction: column-reverse;
            // 左边内容
            .left {
              width: 100%;
              h3 {
                font-size: 16px;
              }
              p {
                font-size: 14px;
              }
            }
            // 右边内容
            img {
              width: 200px;
            }
          }
        }
      }
      // 使用教程
      .container:nth-child(4) {
        // 内容
        .content {
          h2 {
            font-size: 24px;
          }
          ul {
            margin-top: 20px;
            li {
              width: 100%;
              height: 90px;
              margin-top: 20px;
              h3 {
                width: 30px;
                height: 30px;
                line-height: 30px;
              }
              h4 {
                font-size: 18px;
              }
              p {
                font-size: 14px;
              }
            }
          }
        }
      }
      // 关于我们
      .container:nth-child(5) {
        // 视频背景
        video {
          height: 100%;
        }
        // 内容
        .content {
          // 左边内容
          .left {
            h2 {
              font-size: 30px;
            }
            h3 {
              font-size: 16px;
            }
          }
          // 右边内容
          .right {
            h2 {
              font-size: 18px;
            }
            img {
              width: 120px;
              height: 120px;
            }
          }
        }
      }
    }
  }
}
</style>