export default class EmployeeRenderedDocumentInformation {
    public Name: string;
    public DateSignatureUTC: string;
    public ReportGuid: string;
  
    constructor(init?: Partial<EmployeeRenderedDocumentInformation>) {
      if (init) {
        Object.assign(this, init);
      }
    }
}
  