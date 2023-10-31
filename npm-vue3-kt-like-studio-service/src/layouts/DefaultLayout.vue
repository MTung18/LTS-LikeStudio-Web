<template>
  <div class="root">
    <Header />
    <main class="pt-[8rem]">
      <slot></slot>
      <TopButton />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from '@/components/base/Footer/Footer.vue';
import Header from '@/components/base/Header/Header.vue';
import TopButton from '@/components/TopButton/TopButton.vue';
</script>

<style scoped></style>
