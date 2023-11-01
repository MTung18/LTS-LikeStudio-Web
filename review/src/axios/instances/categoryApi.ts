import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import {
  Category,
  BodyCreateCategory,
  ResponseAddOrEditError,
} from "@/models/Category";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export default class CategoryApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getCategories(): Promise<Category[]> {
    let categoryList: Array<Category> = [];

    try {
      const response = await this.axiosInstance.get("PostCategories");
      if (response && response.data && response.status == 200) {
        categoryList = response.data;
      }
    } catch (error) {
      console.log(error);
    }

    return categoryList;
  }

  public async createCategory(
    body: BodyCreateCategory
  ): Promise<ResponseAddOrEditError> {
    const _body: BodyCreateCategory = {
      categoryName: body.categoryName,
      categoryColor: body.categoryColor,
    };

    try {
      const response = await this.axiosInstance.post(
        "PostCategories",
        _body
      );
      if (response && response.status == 200) {
        return response.data;
      } else {
        throw new Error("Fail to add category");
      }
    } catch (error) {
      return error.response.data;
    }
  }

  public async editCategory(
    body: BodyCreateCategory
  ): Promise<ResponseAddOrEditError> {
    const id = body.postCategoryId;
    const _body: BodyCreateCategory = {
      categoryName: body.categoryName,
      categoryColor: body.categoryColor,
    };

    try {
      const response = await this.axiosInstance.put(
        `PostCategories/${id}`,
        _body
      );
      if (response && response.status == 200) {
        return response.data;
      } else {
        throw new Error("Fail to edit category");
      }
    } catch (error) {
      return error.response.data;
    }
  }

  public async deleteCategory(id: number): Promise<boolean> {
    try {
      const response = await this.axiosInstance.delete(
        `PostCategories/${id}`
      );

      if (response && response.status == 204) {
        return true;
      } else {
        false;
      }
    } catch (error) {
      return false;
    }
  }

  public async createDefaultCategories(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post('PostCategories/seedDefaultCategories');
      if (response && response.data && response.status == 200) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}

export const categoryApi = new CategoryApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
