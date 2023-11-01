import AxiosBase from "./axiosBase";
import AzureB2CFunctionAppRequestInterceptor from "../interceptors/azureB2CfunctionApp-request-interceptor";
import { B2CClient } from "@/models/B2CClient";
import Product from "@/models/Product";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export default class AzureB2CFunctionApp extends AxiosBase {

  constructor(interceptors: Array<any>) {

    const baseUrl = getLocalAppsettings().ClientSide.B2CFunctionAppUrl + '/api';

    super(interceptors, baseUrl);
  }

  public async getClientsForUserWithAccess(userGuid: string, productGuid: string): Promise<B2CClient[]> {

    let clientList: B2CClient[] = [];

    try {
      if (!userGuid || !productGuid) {
        throw new Error('One or more required parameters are missing');
      }

      const response = await this.axiosInstance.get(`GetClientsForUserWithAccess/${userGuid}/${productGuid}`);

      if (response && response.data && response.status === 200) {
        clientList = response.data.clients
      }
      else {
        throw new Error('Failed to parse client list');
      }
    }
    catch (error) {
      console.error("Failed to get client list for active user", error);
    }

    return clientList;
  }

  public async getProductsByUserIdAndClientId(userId: string, clientId: string): Promise<Product[]> {
    const response = await this.axiosInstance.get(`GetProductsForUserAndClient/${userId}/${clientId}`);
    return response.data;
  }

  public async getAllProducts(): Promise<Product[]> {
    const response = await this.axiosInstance.get(`GetAllProducts`);

    return response.data;
  }
}

export const azureB2CFunctionApp = new AzureB2CFunctionApp(
  [AzureB2CFunctionAppRequestInterceptor]);