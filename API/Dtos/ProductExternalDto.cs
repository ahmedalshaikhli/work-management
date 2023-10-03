
namespace API.Dtos
{
public class ProductExternalDto
{
    public string pid { get; set; }
    public string ProductNameEn { get; set; }
    public string productSku { get; set; }
    public string productImage { get; set; }
    public decimal? sellPrice { get; set; }
    public string remark { get; set; }
}
}