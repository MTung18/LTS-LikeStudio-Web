export class IAttachmentPost {
  id?: number;
  name?: string;
  filePath?: string;
  description?: string;
  updatedOn?: string;
  updatedBy?: string;
  employeeId?: number;
  documentCategoryId?: number;
  isRestricted?: boolean;
}

export const DocumentCategoryName = "General";

export class Bulletin {
  postId?: number;
  postCategoryId?: number;
  title?: string;
  updatedEmployeeFullName?: string;
  createdEmployeeFullName?: string;
  postDescription?: string;
  postContent?: string;
  thumbnailUrl?: string;
  isPublishedOnESSDashboard?: boolean;
  essDashboardPublishDate?: string;
  essDashboardExpirationDate?: string;
  categoryName?: string;
  categoryColor?: string;
  postStatusId?: number;
  viewsCount?: number;
  createdDateUTC?: string;
  updatedDateUTC?: string;
  documentCategoryName?: string = DocumentCategoryName;
  postDocumentMetadata?: IAttachmentPost[];
}
