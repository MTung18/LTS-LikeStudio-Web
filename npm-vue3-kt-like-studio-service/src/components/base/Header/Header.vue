<template>
  <header class="header">
    <div class="header__inner">
      <h1>
        <p class="visually--hidden">Like studio</p>
        <RouterLink to="/" class="header__logo">
          <IconLogo />
        </RouterLink>
      </h1>
      <nav class="header__nav-wrap">
        <ul class="header__nav-list">
          <li class="header__nav-item">
            <RouterLink to="" class="header__nav-item-inner">
              <div class="header__nav-icon-circle"></div>
              <div class="header__nav-title">템플릿</div>
            </RouterLink>
          </li>
          <li class="header__nav-item">
            <RouterLink to="" class="header__nav-item-inner">
              <div class="header__nav-icon-circle"></div>
              <div class="header__nav-title">갤러리</div>
            </RouterLink>
          </li>
          <li class="header__nav-item">
            <RouterLink to="" class="header__nav-item-inner">
              <div class="header__nav-icon-circle"></div>
              <div class="header__nav-title">매장 VMD</div>
            </RouterLink>
          </li>
          <li class="header__nav-item">
            <RouterLink to="" class="header__nav-item-inner">
              <div class="header__nav-icon-circle"></div>
              <div class="header__nav-title">고객센터</div>
            </RouterLink>
            <div class="header__two-depth-wrap">
              <ul class="header__two-depth-list">
                <li class="header__two-depth-item">
                  <RouterLink to="/customer-service/announcements"
                    >공지사항</RouterLink
                  >
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/customer-service/faq">FAQ</RouterLink>
                </li>
                <li class="header__two-depth-item">
                  <RouterLink to="/customer-service/inquiries"
                    >1:1 문의</RouterLink
                  >
                </li>
              </ul>
            </div>
          </li>
          <li class="header__nav-item">
            <RouterLink to="" class="header__nav-item-inner">
              <div class="header__nav-icon-circle"></div>
              <div class="header__nav-title">사이트 관리</div>
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class="user-action">
        <div class="user-action__list">
          <RouterLink to="" class="user-action__item">사용 매뉴얼</RouterLink>
          <RouterLink to="" class="user-action__item">저작권 규정</RouterLink>
          <RouterLink to="" class="user-action__item"
            >KT CI/BI 가이드</RouterLink
          >
        </div>
        <Button component="a" href="" color-type="primary" size="small">
          나의 스튜디오
        </Button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';

import IconLogo from '@/components/base/Header/IconLogo.vue';
import Button from '@/components/Button/Button.vue';
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 2rem 8rem;
  background-color: var(--color-neutrals-white-100);
  z-index: 9999;
}

.header__inner {
  display: flex;
  align-items: center;
}

.header__logo {
  display: inline-block;
  width: 16.2rem;
}

.header__nav-list {
  display: flex;
  gap: 0 1.4rem;
  margin-left: 6.4rem;
}

.header__nav-item {
  position: relative;
}

.header__nav-item-inner {
  display: flex;
  align-items: center;
  gap: 0 0.8rem;
  height: 4rem;
  line-height: 4rem;
  padding-left: 1.8rem;
  padding-right: 2rem;
  border-radius: 4rem;
  border: 1px solid var(--color-gray-ddd);
  font-size: var(--fz-l);
  font-weight: 500;
}

.header__nav-item:hover .header__nav-item-inner {
  border-color: var(--color-primary);
}

.header__nav-icon-circle {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 9999px;
  border: 1px solid var(--color-gray-bbb);
}

.header__nav-list.is-active .header__nav-icon-circle {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.header__two-depth-wrap {
  position: absolute;
  left: 0;
  top: 100%;
  display: none;
  width: 100%;
  padding-top: 1rem;
  background-color: var(--color-neutrals-white-100);
}

.header__nav-item:hover .header__two-depth-wrap {
  display: block;
}

.header__two-depth-list {
  padding: 1.6rem 0;
  font-size: var(--fz-l);
  text-align: center;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 2rem;
}

.header__two-depth-item {
  height: 3rem;
  line-height: 3rem;
}

.header__two-depth-item.is-active {
  color: var(--color-primary);
  font-weight: 500;
}

.user-action {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0 2rem;
}

.user-action__list {
  display: flex;
  gap: 0 3.2rem;
  font-size: var(--fz-m);
}

.user-action__item {
  position: relative;
}

.user-action__item:not(:last-child)::before {
  position: absolute;
  top: 0;
  right: -1.6rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}
</style>
