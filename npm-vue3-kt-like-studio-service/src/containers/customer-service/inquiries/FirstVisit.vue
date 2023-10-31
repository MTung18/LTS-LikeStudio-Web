<template>
  <div class="wrap">
    <div class="wrap__img-area">
      <div class="wrap__img-inner">
        <figure class="wrap__img">
          <img src="./img/img_obj.png" alt="object" />
        </figure>
      </div>
    </div>
    <b class="wrap__title">안녕하세요! 고객님.</b>
    <p class="wrap__desc">
      라이크 스튜디오를 이용해 주셔서 감사합니다. <br />
      문의 사항을 남겨주시면 빠르고 친절한 답변 드리겠습니다.
    </p>
    <Button
      component="button"
      color-type="primary"
      size="big"
      class-bind="!min-w-[18rem]"
      isIcon
    >
      문의하기
      <Icons
        icon-name="arrow_next_bold"
        icon-color="var(--color-neutrals-white-100)"
      />
    </Button>
  </div>
</template>

<script setup>
import Button from '@/components/Button/Button.vue';
import Icons from '@/components/Icons/Icons.vue';
</script>

<style scoped>
.wrap {
  text-align: center;
  margin-top: 12rem;
}

.wrap__img-area {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrap__img-inner {
  position: relative;
}

.wrap__title {
  display: block;
  margin-top: 6.7rem;
  font-size: var(--ttl-m);
}

.wrap__desc {
  margin-top: 1.6rem;
  margin-bottom: 4rem;
  font-size: var(--fz-l);
  line-height: 1.6;
}
</style>
