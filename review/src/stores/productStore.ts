import Product from '@/models/Product';
import { acceptHMRUpdate, defineStore } from 'pinia'
import hqSuiteIcon from '../assets/images/hqLogos/HQ_Suite_Icon.svg'
import workforceHqLogo from '../assets/images/hqLogos/WorkforceHQ_Logo.svg'
import crewHqLogo from '../assets/images/hqLogos/CrewHQ_Logo.svg'
import executiveHqLogo from '../assets/images/hqLogos/ExecutiveHQ_Logo.svg'
import projectHqLogo from '../assets/images/hqLogos/ProjectHQ_Logo.svg'
import safetyHqLogo from '../assets/images/hqLogos/SafetyHQ_Logo.svg'
import { computed, ref } from 'vue';
import { azureB2CFunctionApp } from '@/axios/instances/azureB2CFunctionApp';
import { useAzureB2CAuthStore } from './azureB2CAuthStore';
import { getProductUrl } from '@/helper/hqSuite/pathHelper';

export const useProductStore = defineStore('product', () => {

  // State
  const _productsUserOwns = ref<Array<Product>>();
  const _allProducts = ref<Array<Product>>();

  // Getters
  const getAllProducts = computed(() => {
    const allowedProducts: string[] = ['PHQ', 'EHQ', 'CREW', 'WorkforceHQ', 'SHQ'];
    let allProducts: Product[] = _allProducts.value;

    if (!_allProducts.value || !_productsUserOwns.value) {
      return;
    }

    allProducts = allProducts.filter(p => allowedProducts.includes(p.productCode)).sort((a, b) => a.productName.localeCompare(b.productName));
    if (!!_productsUserOwns.value.find(p => p.productName === 'ProjectHQ') && !!_productsUserOwns.value.find(p => p.productName === 'CrewHQ')) {
      const indexOfCrew: number = allProducts.findIndex(p => p.productCode === 'CREW');
      if (indexOfCrew !== null) {
        allProducts.splice(indexOfCrew, 1);
      }
    }

    return allProducts;
  });

  const getUserProducts = computed(() => {
    const userProducts: Product[] = [];

    if (!getAllProducts.value) {
      return;
    }

    for (const product of getAllProducts.value) {
      product.productUrl = getProductUrl(product.productUrl);

      try {
        product.productImage = productImageSelector(product.productName);
      } catch {
        product.productImage = hqSuiteIcon;
      }
      const userProduct = _productsUserOwns.value.find(p => p.productGuid === product.productGuid);
      if (!!userProduct) {
        userProducts.push(product);
      }
    }

    return userProducts;
  });

  const getUserNonProducts = computed(() => {
    let userNonProducts: Product[] = [];

    if (!getAllProducts.value) {
      return;
    }

    userNonProducts = getAllProducts.value.filter(p => getUserProducts.value != null && !getUserProducts.value.includes(p));

    for (const product of userNonProducts) {
      try {
        product.productImage = productImageSelector(product.productName);
      } catch {
        product.productImage = hqSuiteIcon;
      }
      if (product.productName === 'SafetyHQ') {
        product.productUrl = 'https://mysafetyhq.com/'
      } else {
        product.productUrl = 'https://myprojecthq.com/';
      }
    }

    return userNonProducts;
  });

  const getWorkforceHQProduct = computed(() => {
    return _allProducts.value?.find((product: Product) => product.productCode === 'WorkforceHQ') || {} as Product;
  });

  const getWHQESSProduct = computed(() => {
    return _allProducts.value?.find((product: Product) => product.productCode === 'WHQESS') || {} as Product;
  });

  const getWorkforceHQProductGuid = computed(() => {
    return getWorkforceHQProduct.value.productGuid || '';
  });

  const getWorkforceHQProductUrl = computed(() => {
    return getProductUrl(getWorkforceHQProduct.value.productUrl);
  });

  const getWHQESSProductGuid = computed(() => {
    return getWHQESSProduct.value.productGuid || '';
  });

  const getWHQESSProductUrl = computed(() => {
    return getProductUrl(getWHQESSProduct.value.productUrl);
  });

  // Actions
  function productImageSelector(productName: string) {
    switch (productName) {
      case 'WorkforceHQ':
        return workforceHqLogo;
      case 'CrewHQ':
        return crewHqLogo;
      case 'ExecutiveHQ':
        return executiveHqLogo;
      case 'ProjectHQ':
        return projectHqLogo;
      case 'SafetyHQ':
        return safetyHqLogo;
    }
    return hqSuiteIcon;
  }

  async function fetchProductsByUserIdAndClientId() {
    const azureB2CAuthStore = useAzureB2CAuthStore();

    _productsUserOwns.value = await azureB2CFunctionApp.getProductsByUserIdAndClientId(azureB2CAuthStore.activeUserGuid, azureB2CAuthStore.activeUserClient?.clientGuid);
  }

  async function fetchAllProducts() {
    _allProducts.value = await azureB2CFunctionApp.getAllProducts();
  }

  return {
    _productsUserOwns,
    _allProducts,
    getAllProducts,
    getUserProducts,
    getUserNonProducts,
    getWorkforceHQProductGuid,
    getWorkforceHQProductUrl,
    getWHQESSProductGuid,
    getWHQESSProductUrl,
    fetchProductsByUserIdAndClientId,
    fetchAllProducts
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
