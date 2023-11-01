import { AxiosInstance } from "axios";
import { useAppSecretsStore } from '@/stores/settings/appSecretsStore';

export default function setup(axiosInstance: AxiosInstance): void {

  const clientId = 'default';

  axiosInstance.interceptors.request.use(
    async (config) => {
      const fetchAppSecretsAsync = useAppSecretsStore();

      try {
        await fetchAppSecretsAsync.fetchAppSecretsAsync();
        const code = fetchAppSecretsAsync.appSecrets.clientSideSecret.fslB2CFunctionAppCode;

        config.params = { ...config.params, code, clientId }
        return config;
      } catch (e) {
        console.error('Error retrieving B2C Function App Code. ' + e);
      }
    },
    (err: any) => {
      return Promise.reject(err);
    }
  );
}