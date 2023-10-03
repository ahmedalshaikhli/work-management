using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Http;

namespace Core.Interfaces
{
    public interface ICJDropshippingService
    {
        Task<dynamic> GetCategories();
       Task<PaginatedResult<ProductExternal>> GetProductsFromExternal(string pid, string productNameEn, int pageSize, int pageNum);
       Task<dynamic> GetProductDetailsForExternal(string pid);
    }
}