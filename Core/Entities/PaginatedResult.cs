namespace Core.Entities
{
    public class PaginatedResult<T>
    {
        public List<T> Data { get; set; }
        public int PageSize { get; set; }
        public int PageNum { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }
}