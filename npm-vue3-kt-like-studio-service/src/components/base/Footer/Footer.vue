<template>
  <footer class="footer">
    <div class="footer__inner">
      <figure class="footer__logo">
        <IconKTLogo />
      </figure>
      <ul class="footer__site-info-list">
        <li class="footer-site-info-item footer-site-info-item--bar">
          (주)케이티 대표이사 김영섭
        </li>
        <li class="footer-site-info-item footer-site-info-item--bar">
          사업자등록번호 102-81-42945
        </li>
        <li class="footer-site-info-item">
          13606 경기도 성남시 분당구 불정로 90 (정자동 206번지)
        </li>
        <li class="footer-site-info-item">
          Copyright © 2023 kt corp. All rights reserved.
        </li>
      </ul>

      <ul class="footer__popup-list">
        <li class="footer__popup-item">
          <RouterLink to="">이용약관</RouterLink>
        </li>
        <li class="footer__popup-item--bold">
          <RouterLink to="">개인정보처리방침</RouterLink>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import IconKTLogo from '@/components/base/Footer/IconKTLogo.vue';
</script>

<style scoped>
.footer {
  padding: 0 8rem;
  border-top: 1px solid #e9e9e9;
}

.footer__inner {
  display: flex;
  align-items: center;
  height: 12.6rem;
}

.footer__logo {
  width: 4.1rem;
}

.footer__site-info-list {
  display: flex;
  gap: 1rem 2.8rem;
  flex-wrap: wrap;
  max-width: 69rem;
  margin-left: 10.8rem;
  font-size: var(--fz-s);
  color: var(--color-gray-777);
}

.footer-site-info-item {
  position: relative;
}

.footer-site-info-item--bar::after {
  position: absolute;
  top: 0;
  right: -1.4rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.footer__popup-list {
  display: flex;
  gap: 0 2.3rem;
  margin-left: auto;
  font-size: var(--fz-m);
}

.footer__popup-item--bold {
  font-weight: 700;
}
</style>
