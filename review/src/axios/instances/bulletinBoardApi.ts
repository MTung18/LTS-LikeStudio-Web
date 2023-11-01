import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { Bulletin } from "@/models/Bulletin";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export default class BulletinBoardApi extends AxiosBase {

  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getListOfBulletins(param?): Promise<Bulletin[]> {
    let listOfBulletins: Bulletin[];
    try {
      const response = await this.axiosInstance.get<Bulletin[]>(
        "Posts",
        {
          params: {
            Search: param,
          },
        }
      );

      if (response && response.data && response.status === 200) {
        listOfBulletins = response.data;
      } else {
        throw new Error("Failed to parse Bulletin board list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Bulletin board list.",
        error
      );
    }
    return listOfBulletins;
  }

  public async addBulletinBoard(data: Bulletin) {
    try {
      const response = await this.axiosInstance.post("Posts", data);

      if (response && response.status === 200) {
        return true;
      } else {
        throw new Error("Failed to add Bulletin board");
      }
    } catch (error) {
      return error.response.data
    }
  }

  public async deleteBulletinBoard(bulletinId: number): Promise<boolean> {
    try {
      const response = await this.axiosInstance.delete(
        `Posts/${bulletinId}`
      );
      if (response && response.status === 204) {
        return true;
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Delete error.", error);
    }
  }

  public async updateBulletinBoardDetail(postId: number, data: Bulletin) {
    try {
      const response = await this.axiosInstance.put(`Posts/${postId}`, data);

      if (response && response.status === 200) {
        return true;
      } else {
        throw new Error("Failed to update Bulletin board");
      }
    } catch (error) {
      return error.response.data
    }
  }

  public async getBulletinBoardDetail(id: string | number): Promise<Bulletin> {
    let bulletinBoardDetail: Bulletin;

    try {
      const response = await this.axiosInstance.get<Bulletin>(`Posts/${id}`);
      if (response && response.data && response.status === 200) {
        bulletinBoardDetail = response.data;
      } else {
        throw new Error("Failed to get Bulletin board detail");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Bulletin board list.",
        error
      );
    }
    return bulletinBoardDetail;
  }

  public async getListPost(): Promise<Bulletin> {
    let ListPost: Bulletin;
    try {
      const response = await this.axiosInstance.get<Bulletin>(
        "Posts/getTopRecords"
      );

      if (response && response.data && response.status === 200) {
        ListPost = response.data;
      } else {
        throw new Error("Failed to parse Bulletin board list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Bulletin board list.",
        error
      );
    }
    return ListPost;
  }

  public async checkPublish() {
    try {
      const response = await this.axiosInstance.get("Posts/checkIsPublish");

      if (response && response.data && response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to parse Bulletin board list");
      }
    } catch (error) {
      return error.response.data.detail;
    }
  }
}

export const bulletinBoardApi = new BulletinBoardApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
