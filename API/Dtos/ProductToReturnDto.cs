namespace API.Dtos
{
    public class ProductToReturnDto
    {
     public int Id { get; set; }
     public string Name { get; set; }
     public string NameEn { get; set; }
     public decimal OldPrice { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    
    public string ProductType { get; set; }
    public string ProductBrand { get; set; }
   
    public List<PhotoDto> Photos { get; set; }
    public string PictureUrl { get; set; } 
    public bool IsExternal { get; set; } 
     public string CreatorName { get; set; }
    }
}