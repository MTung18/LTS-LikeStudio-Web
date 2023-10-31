import AxiosBase from "./axiosBase";

class FaqApi extends AxiosBase {
 constructor(interceptors) {
  const baseUrl = getLocalAppsettings().ClientSide.LikeStudioAPI + "/api/faq";
  super(interceptors, baseUrl);
 }

 async search(param) {
   let listFaq;
   try {
    const response = await this.axiosInstance.get(
     "search",
     {
      param: {
        
      }
     }
    )
   }
 }
}