<template>
  <section class="section section-01">
    <div class="section__inner">
      <Sec1Slider />
    </div>
  </section>

  <section class="section section-02">
    <div>
      <HomeSectionTop>
        <HomeTitle title="따끈따끈한 뉴페이스" desc="지금 만나러 갑니다" />
        <figure
          class="absolute top-[-4.6rem] right-[calc(100%_-_-11.4rem)] w-[17rem]"
        >
          <img src="@/assets/img/home/img_obj_01.png" alt="Too Hot" />
        </figure>
        <figure
          class="absolute top-[4rem] left-[calc(100%+14.6rem)] w-[23.4rem]"
        >
          <img src="@/assets/img/home/img_obj_02.png" alt="New Template" />
        </figure>
      </HomeSectionTop>
      <Sec2Rolling />
    </div>
  </section>

  <section class="section section-03 bg-[#F0E7FD]">
    <div class="section__inner">
      <HomeSectionTop>
        <HomeTitle title="이달의 공식 템플릿" desc="손 댈 데가 1도 없네" />
        <figure
          class="absolute bottom-[12.4rem] left-[calc(100%_-_-31.56rem)] w-[22.8rem]"
        >
          <img src="@/assets/img/home/img_obj_03.png" alt="오브젝트 3" />
        </figure>
      </HomeSectionTop>
      <Sec3Slider />
    </div>
  </section>
  <section class="section section-04">
    <div class="section__inner">
      <HomeSectionTop>
        <HomeTitle title="우리들의 최애 템플릿" desc="팀장님 취향 저격" />
        <figure
          class="absolute bottom-[6.9rem] right-[calc(100%_-_-21.4rem)] w-[28.7rem]"
        >
          <img src="@/assets/img/home/img_obj_04.png" alt="오브젝트 4" />
        </figure>
      </HomeSectionTop>
      <Sec4Slider />
    </div>
  </section>
  <section class="section section-05 bg-[#E5F9E8]">
    <div class="section__inner">
      <HomeSectionTop>
        <HomeTitle
          title="그거 말고 이거 쓰세요"
          desc="나만 알고 싶었던 매출상승 비밀"
        />
        <figure
          class="absolute bottom-[8.8rem] left-[calc(100%_-_-31.56rem)] w-[26.9rem]"
        >
          <img src="@/assets/img/home/img_obj_05.png" alt="오브젝트 5" />
        </figure>
        <figure
          class="absolute top-[5.2rem] right-[calc(100%_-_-19.4rem)] w-[13.6rem]"
        >
          <img src="@/assets/img/home/img_obj_06.png" alt="오브젝트 6" />
        </figure>
      </HomeSectionTop>
      <Sec5Slider />
    </div>
  </section>

  <section class="section section-06 bg-[#F4F5F6]">
    <div class="section__inner">
      <div class="link-card">
        <RouterLink to="/" class="link-card__item link-card__item--manual">
          <figure class="link-card__img">
            <div class="link-card__img-area">
              <img
                src="@/assets/img/home/img_manual_obj.png"
                alt="사용 메뉴얼"
              />
            </div>
            <div class="link-card__icon-button">
              <Icons
                :width="2.4"
                :height="2.4"
                icon-name="arrow_next_bold"
                icon-color="var(--color-primary)"
              />
            </div>
          </figure>
          <div class="link-card__text-box">
            <span class="link-card__title">사용매뉴얼</span>
            <p class="link-card__desc">
              LIKE STUDIO 사용법에 대해<br />자세히 알려 드립니다.
            </p>
          </div>
        </RouterLink>

        <RouterLink to="/" class="link-card__item link-card__item--faq">
          <figure class="link-card__img">
            <div class="link-card__img-area">
              <img src="@/assets/img/home/img_faq_obj.png" alt="faq" />
            </div>
            <div class="link-card__icon-button">
              <Icons
                :width="2.4"
                :height="2.4"
                icon-name="arrow_next_bold"
                icon-color="#528DFF"
              />
            </div>
          </figure>
          <div class="link-card__text-box">
            <span class="link-card__title">FAQ</span>
            <p class="link-card__desc">
              서비스 이용 관련 자주 묻는 질문들을<br />모았습니다.
            </p>
          </div>
        </RouterLink>
        <HomeNoticeCard />
      </div>
    </div>
  </section>
</template>

<script setup>
import Icons from '@/components/Icons/Icons.vue';
import HomeNoticeCard from '@/containers/home/HomeNoticeCard.vue';
import HomeSectionTop from '@/containers/home/HomeSectionTop.vue';
import HomeTitle from '@/containers/home/HomeTitle.vue';
import Sec1Slider from '@/containers/home/Sec1Slider/Sec1Slider.vue';
import Sec2Rolling from '@/containers/home/Sec2Rolling/Sec2Rolling.vue';
import Sec3Slider from '@/containers/home/Sec3Slider/Sec3Slider.vue';
import Sec4Slider from '@/containers/home/Sec4Slider/Sec4Slider.vue';
import Sec5Slider from '@/containers/home/Sec5Slider/Sec5Slider.vue';
</script>

<style scoped>
.section-01 {
  padding-top: 11rem;
  padding-bottom: 9rem;
}

.section-02,
.section-03,
.section-04,
.section-05 {
  padding-top: 14rem;
  padding-bottom: 14rem;
}

.section-06 {
  padding-top: 16rem;
  padding-bottom: 16rem;
}

.section__inner {
  position: relative;
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 8rem;
}

.link-card {
  display: flex;
  gap: 0 3rem;
  justify-content: center;
  max-width: 1462px;
  width: 100%;
  margin: 0 auto;
}

.link-card__item {
  flex: 1;
}

.link-card__item--manual .link-card__img {
  background-color: #c4b9fa;
}

.link-card__item--faq .link-card__img {
  background-color: #d6e8fd;
}

.link-card__img {
  position: relative;
  height: 0;
  padding-bottom: 62.44019%;
  border-radius: 2.4rem;
  overflow: hidden;
}

.link-card__img-area {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 4.7rem;
}

.link-card__icon-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.6rem;
  height: 4.6rem;
  border-radius: 9999px;
  background-color: var(--color-neutrals-white-100);
}

.link-card__text-box {
  margin-top: 4rem;
}

.link-card__title {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background-color: #7761ff;
  font-size: var(--ttl-s);
  font-weight: 700;
  color: var(--color-neutrals-white-100);
  border-radius: 0.7rem;
}

.link-card__desc {
  font-size: var(--ttl-m);
  font-weight: 700;
  margin-top: 2rem;
}
</style>
