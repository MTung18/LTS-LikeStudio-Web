<template>
  <div class="circle-container" :class="[props.classBind]">
    <svg
      class="circle-wrap"
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="49"
      viewBox="0 0 48 49"
      fill="none"
    >
      <circle
        class="circle animation-order--2"
        cx="44"
        cy="24.6211"
        r="4"
        transform="rotate(-180 44 24.6211)"
        fill="#F0E1E2"
      />
      <circle
        class="circle animation-order--6"
        cx="4"
        cy="24.6211"
        r="4"
        transform="rotate(-180 4 24.6211)"
        fill="#F0E1E2"
      />
      <circle
        class="circle animation-order--4"
        cx="24"
        cy="44.6211"
        r="4"
        transform="rotate(-180 24 44.6211)"
        fill="#F0E1E2"
      />
      <circle
        class="circle animation-order--8"
        cx="24"
        cy="4.62109"
        r="4"
        transform="rotate(-180 24 4.62109)"
        fill="#F0E1E2"
      />
      <circle
        class="circle animation-order--5"
        cx="9.85791"
        cy="38.7631"
        r="4"
        transform="rotate(-135 9.85791 38.7631)"
        fill="#F0E1E2"
      />
      <circle
        class="circle animation-order--1"
        cx="38.1421"
        cy="10.4779"
        r="4"
        transform="rotate(-135 38.1421 10.4779)"
        fill="#F0E1E2"
      />
      <circle
        class="circle animation-order--7"
        cx="9.85803"
        cy="10.4785"
        r="4"
        transform="rotate(-45 9.85803 10.4785)"
        fill="#F0E1E2"
      />
      <circle
        class="circle animation-order--3"
        cx="38.1422"
        cy="38.7637"
        r="4"
        transform="rotate(-45 38.1422 38.7637)"
        fill="#F0E1E2"
      />
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  classBind: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
@keyframes rotateRed {
  0% {
    fill: #ed1c24;
  }
  100% {
    fill: #f0e1e2;
  }
}

.circle-container {
  display: flex;
  justify-content: center;
}

.circle-wrap {
  width: 4.8rem;
  height: 4.8rem;
}

.circle {
  animation: rotateRed 1.6s infinite;
}

.circle.animation-order--2 {
  animation-delay: 0.2s;
}

.circle.animation-order--3 {
  animation-delay: 0.4s;
}

.circle.animation-order--4 {
  animation-delay: 0.6s;
}

.circle.animation-order--5 {
  animation-delay: 0.8s;
}

.circle.animation-order--6 {
  animation-delay: 1s;
}

.circle.animation-order--7 {
  animation-delay: 1.2s;
}

.circle.animation-order--8 {
  animation-delay: 1.4s;
}
</style>
