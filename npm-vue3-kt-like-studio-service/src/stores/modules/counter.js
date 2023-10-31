import { defineStore } from 'pinia';
import { ref } from 'vue';

const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  console.log('count', count.value);

  function increment() {
    console.log('증가');
    count.value += 1;
    console.log('count', count.value);
  }

  function reduction() {
    console.log('감소');
    count.value -= 1;
  }

  function reset() {
    console.log('초기화');
    count.value = 0;
  }

  return { count, increment, reduction, reset };
});

export default useCounterStore;
