export interface ApiResponse {
  apiMessage?:string;
  errorMessage?: string;
  success: boolean;
  status?: number;
  data?: object | []
}
