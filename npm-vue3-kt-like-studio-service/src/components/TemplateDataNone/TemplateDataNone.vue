<template>
  <div class="wrap">
    <div class="wrap__img-area">
      <div class="wrap__img-inner">
        <figure class="wrap__img">
          <img src="./img/cloud.png" alt="cloud" />
        </figure>
        <figure class="wrap__img img-txt">
          <img src="./img/txt.png" alt="where is my data?" />
        </figure>
      </div>
    </div>
    <b class="wrap__title">데이터가 없습니다.</b>
  </div>
</template>

<script setup></script>

<style scoped>
.wrap {
  text-align: center;
  margin-top: 12rem;
  margin-bottom: 12rem;
}

.wrap__img-area {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrap__img-inner {
  position: relative;
}

.wrap__img.img-txt {
  position: absolute;
  top: 12.4rem;
  left: 9.2rem;
  width: 24rem;
  height: 9rem;
}

.wrap__title {
  display: block;
  margin-top: 9rem;
  font-size: var(--ttl-m);
}
</style>
