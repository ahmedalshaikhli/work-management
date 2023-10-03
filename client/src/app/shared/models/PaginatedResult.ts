export class PaginatedResult<T> {
    data: T[];
    pageSize: number;
    pageNum: number;
    totalCount: number;
    totalPages: number;
  
    constructor(data: T[], pageSize: number, pageNum: number, totalCount: number) {
      this.data = data;
      this.pageSize = pageSize;
      this.pageNum = pageNum;
      this.totalCount = totalCount;
      this.totalPages = Math.ceil(totalCount / pageSize);
    }
  }