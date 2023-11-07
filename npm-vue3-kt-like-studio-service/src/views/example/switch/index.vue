<template>
  <article class="article">
    <h2 class="article__title">Switch</h2>
    <div class="article__group">
      <div class="article__inner">
        <Switch />
      </div>
      <p class="article__select-desc">Switch-Basic</p>
      <div class="article__inner">
        <SwitchBookmark />
      </div>
      <p class="article__select-desc">Switch-bookmark</p>
      <div class="article__inner">
        <SwitchMenu :switch-data="menuData"></SwitchMenu>
      </div>
      <p class="article__select-desc">Switch-menu</p>
    </div>
  </article>
</template>

<script setup>
import Switch from '@/components/Switch/Switch.vue';
import SwitchBookmark from '@/components/SwitchBookmark/SwitchBookmark.vue';
import SwitchMenu from '@/components/SwitchMenu/SwitchMenu.vue';

const menuData = [
  {
    id: 1,
    title: '용도별',
    name: 'usage',
    checkList: [
      {
        id: 1,
        cate: '포스터',
        value: 'poster',
      },
      {
        id: 2,
        cate: '브로셔',
        value: 'brochure',
      },
      {
        id: 3,
        cate: '전단지',
        value: 'pamphlets',
      },
      {
        id: 4,
        cate: 'X배너',
        value: 'xbanner',
      },
      {
        id: 5,
        cate: 'SNS용',
        value: 'sns',
      },
      {
        id: 6,
        cate: 'PPT',
        value: 'ppt',
      },
    ],
  },
  {
    id: 2,
    title: '용도별',
    checkList: [
      {
        id: 1,
        cate: '포스터',
        value: 'poster',
      },
      {
        id: 2,
        cate: '브로셔',
        value: 'brochure',
      },
      {
        id: 3,
        cate: '전단지',
        value: 'pamphlets',
      },
      {
        id: 4,
        cate: 'X배너',
        value: 'xbanner',
      },
      {
        id: 5,
        cate: 'SNS용',
        value: 'sns',
      },
      {
        id: 6,
        cate: 'PPT',
        value: 'ppt',
      },
    ],
  },
];
</script>

<style scoped>
.article {
  padding: 4rem;
}

.article + .article {
  margin-top: 2rem;
}

.article__group {
  display: flex;
  flex-flow: column;
  border: 1px dashed #9747ff;
  border-radius: 2rem;
  padding: 50px;
  min-height: 300px;
}

.article__title {
  margin-bottom: 2rem;
  font-size: var(--ttl-l);
}

.article__select-desc {
  margin-top: 1.5rem;
  font-size: var(--fz-m);
}

.article__select-desc + .article__inner {
  margin-top: 30px;
}
</style>
