namespace API.Dtos
{
public class ProductDto
{
    public string Name { get; set; }
    public string NameEn { get; set; }
    public decimal OldPrice { get; set; }
     public decimal Price { get; set; }
    public string Description { get; set; }
   
    public int ProductTypeId { get; set; }
    public int ProductBrandId { get; set; }
  
        public List<IFormFile> Photos { get; set; }
        public string PictureUrl { get; set; } 
}
}