import { ref, onMounted, onUnmounted, computed, reactive } from "vue"

export const useBreakpoints = () => {
    let windowWidth = ref(window.innerWidth)
  
    const onWidthChange = () => windowWidth.value = window.innerWidth
    onMounted(() => window.addEventListener('resize', onWidthChange))
    onUnmounted(() => window.removeEventListener('resize', onWidthChange))
    const responsive = reactive({
      mobile: null,
      breakpoint: null,
      screenWidth: null,
      mobileMd: null
  });
    
    responsive.breakpoint = computed(() => {
      if (windowWidth.value < 641) return 'sm'
      if (windowWidth.value >= 641 && windowWidth.value < 769) return 'md'
      if (windowWidth.value >= 769 && windowWidth.value < 1025) return 'lg'
      if (windowWidth.value > 1025) return 'xl'
      else return null; // This is an unreachable line, simply to keep eslint happy.
    })

    responsive.mobile = computed(() => {
        if (windowWidth.value < 1025) return true
        else return false;
    })

    responsive.mobileMd = computed(() => {
        if (windowWidth.value < 769) return true
        else return false;
    })

    responsive.screenWidth = computed(() => windowWidth.value)
  
    return { responsive }
  }