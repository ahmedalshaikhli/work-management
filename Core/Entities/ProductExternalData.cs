namespace Core.Entities
{
 public class ProductExternalData
    {
        public int PageNum { get; set; }
        public int PageSize { get; set; }
        public int Total { get; set; }
        public List<ProductExternal> List { get; set; }
    }
    }