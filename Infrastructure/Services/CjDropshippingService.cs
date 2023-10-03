using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Newtonsoft.Json;
using Microsoft.Extensions.Http;
namespace Infrastructure.Services
{
 
    public class CJDropshippingService : ICJDropshippingService
    {
        private readonly IHttpClientFactory _clientFactory;

        public CJDropshippingService(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        public async Task<dynamic> GetCategories()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "https://developers.cjdropshipping.com/api2.0/v1/product/getCategory");
            request.Headers.Add("CJ-Access-Token", "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5NzA1IiwidHlwZSI6IkFDQ0VTU19UT0tFTiIsInN1YiI6ImJxTG9icVEwbG1ObnlRcHhQV0xaeXRCbFR3czluUHdOanJLbmNuYkJMeE1RamRYc0JweGE3c0FkRXlBY1BxR1RzTmNqRW9GYWxhdkF1YXZNSzhMMHJKUkpuSG9ISEt5VlVBem5LZ1dmaW1BQk9veTRsNm12WDVBVzUrZVBKbXcyaFIwbWFVWk9NZnRrWTBzbExxbklVRUlPdzVhSnNCQkdCT1o3QkwrbTRJZWlCV1R1RWZ1eThLSVlFYjNHL0gwYWE2ZGtDVkV6ZGdLNHlHUGFRVkhzb25PZWR0QzdzWGtjSmdkTnVlRmdkY2tXcnZzbXdGdG4wQkFEOW1ZMXNJRVZjbDVMdDc5b2ROQ2MwM2JCUFREUDJmd2V2amZPN0FRaVhORXJ6SlBWUkYzTTV2a29xUTAwNlBnK0M1UlZTTU54In0.Xq6M1gg1QmyCGGarO9mr0YtoABbPnXvEXmM1EuCl_uw");

            var client = _clientFactory.CreateClient();
            var response = await client.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var responseJson = await response.Content.ReadAsStringAsync();
                var responseData = JsonConvert.DeserializeObject<dynamic>(responseJson);
                return responseData;
            }

            return null;
        }
public async Task<PaginatedResult<ProductExternal>> GetProductsFromExternal(string pid, string productNameEn, int pageSize, int pageNum)
{
    var request = new HttpRequestMessage(HttpMethod.Get, "https://developers.cjdropshipping.com/api2.0/v1/product/list");
    request.Headers.Add("CJ-Access-Token", "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5NzA1IiwidHlwZSI6IkFDQ0VTU19UT0tFTiIsInN1YiI6ImJxTG9icVEwbG1ObnlRcHhQV0xaeXRCbFR3czluUHdOanJLbmNuYkJMeE1RamRYc0JweGE3c0FkRXlBY1BxR1RzTmNqRW9GYWxhdkF1YXZNSzhMMHJKWHA0R043WXIvY3c5YmVRaXZzaFE3aDNjejV6N0x2ZkxraE04dDNnNS9TaFIwbWFVWk9NZnRrWTBzbExxbklVRUlPdzVhSnNCQkdCT1o3QkwrbTRJZWlCV1R1RWZ1eThLSVlFYjNHL0gwYWE2ZGtDVkV6ZGdLNHlHUGFRVkhzb25PZWR0QzdzWGtjSmdkTnVlRmdkY2tXcnZzbXdGdG4wQkFEOW1ZMXNJRVZjbDVMdDc5b2ROQ2MwM2JCUFREUDJmd2V2amZPN0FRaVhORXJ6SlBWUkYzTTV2a29xUTAwNlBnK0M1UlZTTU54In0.uCoW6POsIDn_LoSJxqws7kzf4Zdgtj-qImigUkdFu2I");

    var queryParams = new Dictionary<string, string>
    {
        { "pageNum", pageNum.ToString() },
        { "pageSize", pageSize.ToString() },
        { "productNameEn", productNameEn },
        { "pid", pid }  // Add the product name as a search parameter
        // Add any other query parameters as needed
    };

    var query = new FormUrlEncodedContent(queryParams);
    request.RequestUri = new Uri($"{request.RequestUri}?{query.ReadAsStringAsync().Result}");

    var client = _clientFactory.CreateClient();
    var response = await client.SendAsync(request);

    if (response.IsSuccessStatusCode)
    {
        var responseJson = await response.Content.ReadAsStringAsync();
        var responseData = JsonConvert.DeserializeObject<ResponseExternalData>(responseJson);
        var paginatedResult = new PaginatedResult<ProductExternal>
        {
            PageNum = pageNum,
            PageSize = pageSize,
            TotalCount = responseData?.Data?.Total ?? 0,
            Data = responseData?.Data?.List
        };
        return paginatedResult;
    }

    return null;
}


public async Task<dynamic> GetProductDetailsForExternal(string pid)
{
    var url = $"https://developers.cjdropshipping.com/api2.0/v1/product/query?pid={pid}";

    var request = new HttpRequestMessage(HttpMethod.Get, url);
    request.Headers.Add("CJ-Access-Token", "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5NzA1IiwidHlwZSI6IkFDQ0VTU19UT0tFTiIsInN1YiI6ImJxTG9icVEwbG1ObnlRcHhQV0xaeXRCbFR3czluUHdOanJLbmNuYkJMeE1RamRYc0JweGE3c0FkRXlBY1BxR1RzTmNqRW9GYWxhdkF1YXZNSzhMMHJKWHA0R043WXIvY3c5YmVRaXZzaFE3aDNjejV6N0x2ZkxraE04dDNnNS9TaFIwbWFVWk9NZnRrWTBzbExxbklVRUlPdzVhSnNCQkdCT1o3QkwrbTRJZWlCV1R1RWZ1eThLSVlFYjNHL0gwYWE2ZGtDVkV6ZGdLNHlHUGFRVkhzb25PZWR0QzdzWGtjSmdkTnVlRmdkY2tXcnZzbXdGdG4wQkFEOW1ZMXNJRVZjbDVMdDc5b2ROQ2MwM2JCUFREUDJmd2V2amZPN0FRaVhORXJ6SlBWUkYzTTV2a29xUTAwNlBnK0M1UlZTTU54In0.uCoW6POsIDn_LoSJxqws7kzf4Zdgtj-qImigUkdFu2I"); // Use your access token here

    var client = _clientFactory.CreateClient();
    var response = await client.SendAsync(request);

    if (response.IsSuccessStatusCode)
    {
        var responseJson = await response.Content.ReadAsStringAsync();
        var responseData = JsonConvert.DeserializeObject<dynamic>(responseJson);
        return responseData;
    }

    return null;
}





   

    }
    }
