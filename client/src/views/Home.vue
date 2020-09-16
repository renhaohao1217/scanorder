<template>
  <div id="home">
    <!-- 导航栏 -->
    <header>
      <h1>芝麻奶酪</h1>
      <ul>
        <li>首页</li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </header>
    <section>
      <div class="container"></div>
      <div class="container"></div>
      <div class="container"></div>
      <div class="container"></div>
    </section>
  </div>
</template>

<style scoped>
#home,
section {
  width: 100%;
  height: 100%;
}
.container {
  width: 100%;
  height: 100%;
  background-attachment: fixed;
  background-size: cover;
}
.container:nth-child(1) {
  background-image: url("../assets/images/apple-id-psp-banner-hero.image.jpg");
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
</style>
