export interface Category {
  postCategoryId?: number;
  isDeleted?: boolean;
  isActive?: boolean;
  categoryName?: string;
  categoryColor?: string;
}



export interface BodyCreateCategory {
  postCategoryId?: number;
  isDeleted?: boolean;
  isActive?: boolean;
  categoryName: string;
  categoryColor: string;
}

export interface DataAddOrEditCategory {
  isOpen: boolean;
  type: string;
  category: {
    categoryName: string;
    categoryColor: string;
  };
  error: string;
}

export interface ResponseAddOrEditError {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  traceId?: string;
  success?: boolean;
}
