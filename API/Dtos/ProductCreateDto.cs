using API.Helpers;

namespace API.Dtos
{
public class ProductCreateDto
   {
   public string Name { get; set; }
    public string NameEn { get; set; }
     public decimal OldPrice { get; set; }
     public decimal Price { get; set; }
    public string Description { get; set; }
    
    public int ProductTypeId { get; set; }
    public int ProductBrandId { get; set; }
   
    public List<PhotoDto> Photos { get; set; }

    }
}