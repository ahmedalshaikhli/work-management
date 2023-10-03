using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Google.Cloud.Translation.V2;
using Microsoft.AspNetCore.Identity;
using Core.Entities.Identity;
using API.Extensions;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
   
        private readonly ICJDropshippingService _cjDropshippingService;
        public ProductsController(UserManager<AppUser> userManager,IUnitOfWork unitOfWork, IMapper mapper , IPhotoService photoService , ICJDropshippingService cjDropshippingService)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _photoService = photoService;
             _cjDropshippingService = cjDropshippingService; 
            _userManager = userManager;
        }


[HttpPost]
/*  [Authorize]  */ // Ensure only authenticated users can create products
public async Task<ActionResult<ProductToReturnDto>> CreateProduct([FromForm] ProductDto productDto)
{
    // Map the productDto to product, without Photos
    var product = _mapper.Map<ProductDto, Product>(productDto);

    product.IsExternal = false;

    // Handle photos manually
    if (productDto.Photos != null)
    {
        product.Photos = new List<Photo>();

        foreach (var photoFile in productDto.Photos)
        {
            var photo = await _photoService.SaveToDiskAsync(photoFile);

            if (photo != null)
            {
                product.Photos.Add(photo);
            }
        }

        // Set the main photo
        var mainPhoto = product.Photos.FirstOrDefault();
        if (mainPhoto != null)
        {
            mainPhoto.IsMain = true;
            product.PictureUrl = mainPhoto.PictureUrl;
        }
    }

    // Get the current user
    var creator = await _userManager.FindUserByClaimsPrincipleWithAddress(HttpContext.User);
if (creator == null)
{
    return NotFound("User not found");
}

// Set the creator
product.CreatorId = creator.Id;

    // Save the product to the database or perform other necessary operations
    _unitOfWork.Repository<Product>().Add(product);
    var result = await _unitOfWork.Complete();

    if (result <= 0)
    {
        return BadRequest(new ApiResponse(400, "Problem creating product"));
    }

    // Map the created product to the return DTO
    var productToReturn = _mapper.Map<Product, ProductToReturnDto>(product);

    return Ok(productToReturn);
}


[HttpGet("external-products")]
public async Task<ActionResult<PaginatedResult<ProductExternal>>> GetProductsFromExternal(string pid= "", string productNameEn = "", int pageSize = 20, int pageNum = 1)
{
    var productExternals = await _cjDropshippingService.GetProductsFromExternal(pid,productNameEn, pageSize, pageNum);

    if (productExternals == null)
    {
        return NotFound();
    }

    var data = _mapper.Map<List<ProductExternal>, List<ProductExternal>>(productExternals.Data);
    var result = new PaginatedResult<ProductExternal> 
    {
        Data = data,
        PageSize = productExternals.PageSize,
        PageNum = productExternals.PageNum,
        TotalCount = productExternals.TotalCount
    };

    return Ok(result);
}


     [HttpGet("product-external-details/{pid}")]
        public async Task<IActionResult> GetProductextExternalDetails(string pid)
        {
            var productDetails = await _cjDropshippingService.GetProductDetailsForExternal(pid);

            if (productDetails == null)
            {
                return NotFound();
            }

            return Ok(productDetails);
        }
       /*  [Cached(600)] */
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
            [FromQuery]ProductSpecParams productParams)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);

            var countSpec = new ProductsWithFiltersForCountSpecification(productParams);

            var totalItems = await _unitOfWork.Repository<Product>().CountAsync(countSpec);

            var products = await _unitOfWork.Repository<Product>().ListAsync(spec);

            var data = _mapper
                .Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex, productParams.PageSize, totalItems, data));
        }
   [HttpGet("supplier/{userId}")]
public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetSupplierProducts(string userId)
{
    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
    {
        return NotFound(new { message = "User not found" });
    }

    var productParams = new ProductSpecParams
    {
        CreatorId = user.Id,
        // Add other necessary parameters here...
    };

    var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
    var countSpec = new ProductsWithFiltersForCountSpecification(productParams);

    var totalItems = await _unitOfWork.Repository<Product>().CountAsync(countSpec);
    var products = await _unitOfWork.Repository<Product>().ListAsync(spec);
    
    var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

    return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex, productParams.PageSize, totalItems, data));
}





        [Cached(600)]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);

            var product = await _unitOfWork.Repository<Product>().GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<Product, ProductToReturnDto>(product);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            return Ok(await _unitOfWork.Repository<ProductBrand>().ListAllAsync());
        }

        [Cached(1000)]
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            return Ok(await _unitOfWork.Repository<ProductType>().ListAllAsync());
        }


[HttpPut("{id}")]
/* [Authorize(Roles = "Admin")] */
public async Task<ActionResult<ProductToReturnDto>> UpdateProduct(int id, [FromForm] ProductDto productDto)
{
    var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);

    // Check if the product exists
    if (product == null)
    {
        return NotFound(new ApiResponse(404, "Product not found"));
    }

    // Assign the properties from the productDto to the existing product entity
    product.Name = productDto.Name;
    product.NameEn = productDto.NameEn;
    product.OldPrice   = productDto.OldPrice ;
    product.Price  = productDto.Price ;
    product.Description  = productDto.Description ;
    product.ProductTypeId  = productDto.ProductTypeId ;
    product.ProductBrandId  = productDto.ProductBrandId ;

     product.PictureUrl   = productDto.PictureUrl  ;

    
    // Assign other properties as needed...

    // Handle photos manually
    if (productDto.Photos != null && productDto.Photos.Count > 0)
    {
        // Delete existing photos
        foreach (var photo in product.Photos)
        {
            _photoService.DeleteFromDisk(photo);
        }

        product.Photos = new List<Photo>();

        // Save new photos
        foreach (var photoFile in productDto.Photos)
        {
            var photo = await _photoService.SaveToDiskAsync(photoFile);

            if (photo != null)
            {
                product.Photos.Add(photo);
            }
        }

        // Set the main photo
        var mainPhoto = product.Photos.FirstOrDefault();
        if (mainPhoto != null)
        {
            mainPhoto.IsMain = true;
            product.PictureUrl = mainPhoto.PictureUrl;
        }
    }

    _unitOfWork.Repository<Product>().Update(product);
    var result = await _unitOfWork.Complete();

    if (result <= 0)
    {
        return BadRequest(new ApiResponse(400, "Problem updating product"));
    }

    var productToReturn = _mapper.Map<Product, ProductToReturnDto>(product);

    return Ok(productToReturn);
}
[HttpPost("product-external/{pid}")]
public async Task<IActionResult> SaveProductFromExternal(string pid)
{
    // Fetch the product data from the external source
    var productExternalData = await _cjDropshippingService.GetProductDetailsForExternal(pid);

    if (productExternalData == null)
    {
        return BadRequest(new ApiResponse(400, "Data field is missing in the response"));
    }

    var productData = productExternalData["data"];

    if (productData == null)
    {
        return BadRequest(new ApiResponse(400, "Product data is null"));
    }

    // Check if ProductNameEn is null, if it's null then assign it to "Default Name".
    string productNameEn = productData["productNameEn"]?.ToString();
    if (string.IsNullOrEmpty(productNameEn))
    {
        return BadRequest(new ApiResponse(400, "Product name is required"));
    }

    string sellPrice = productData["sellPrice"].ToString();
    if (string.IsNullOrEmpty(sellPrice))
    {
        return BadRequest(new ApiResponse(400, "Product sellPrice is required"));
    }

    var productImage = productData["productImage"]?.ToString();
    if (string.IsNullOrEmpty(productImage))
    {
        return BadRequest(new ApiResponse(400, "Product image data is required"));
    }

    // Parse the productImage JSON array string into a list of strings
    var imageUrls = Newtonsoft.Json.JsonConvert.DeserializeObject<List<string>>(productImage);

    // Ensure there's at least one URL in the list
    if (imageUrls == null || imageUrls.Count == 0)
    {
        return BadRequest(new ApiResponse(400, "Product image URLs are missing"));
    }

    // Map the list of image URLs to a list of PhotoDto objects with IsMain set
    // Prepare the list to hold PhotoDto objects
    var photos = new List<PhotoDto>();

    // Loop through the image URLs to create PhotoDto objects
    for (int i = 0; i < imageUrls.Count; i++)
    {
        var photo = new PhotoDto
        {
            Id = i + 1, // Assuming the IDs start from 1
            PictureUrl = imageUrls[i],
            FileName = "photo" + (i + 1), // Assigning a default filename based on index
            IsMain = i == 0 // Set IsMain to true for the first URL, false for others
        };

        photos.Add(photo);
    }
    string description = productData["description"]?.ToString();
    if (string.IsNullOrEmpty(description))
    {
        return BadRequest(new ApiResponse(400, "Product description is required"));
    }

    var product = new Product
    {
        Name = "",
        NameEn  = productNameEn,
        Description = description,
        Price = 0,
        OldPrice  = decimal.TryParse(sellPrice, out decimal price) ? price : default(decimal),
        ProductBrandId = 1, // Set the default value for ProductBrandId
        ProductTypeId = 1,
        IsExternal = true, 
        Photos = new List<Photo>(), // initialize an empty list
        PictureUrl = imageUrls[0] // Set the first URL as the PictureUrl
    };
   foreach (var photo in photos)
    {
        // You can save the PhotoDto directly, but I'll convert it to the Photo entity type first
        var photoEntity = new Photo
        {
            PictureUrl = photo.PictureUrl,
            FileName = photo.FileName,
            IsMain = photo.IsMain
        };

        product.Photos.Add(photoEntity);
    }
    // Adjust the structure of photos data

    // Save the product to the database
    _unitOfWork.Repository<Product>().Add(product);
    var result = await _unitOfWork.Complete();

    if (result <= 0)
    {
        return BadRequest(new ApiResponse(400, "Problem creating product"));
    }

    return Ok(product);
}








        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);

            foreach (var photo in product.Photos)
            {
                if (photo.Id > 18)
                {
                    _photoService.DeleteFromDisk(photo);
                }
            }
            
            _unitOfWork.Repository<Product>().Delete(product);

            var result = await _unitOfWork.Complete();
            
            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem deleting product"));

            return Ok();
        }














        [HttpDelete("photos/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
{
    var photo = await _unitOfWork.Repository<Photo>().GetByIdAsync(photoId);

    if (photo == null)
    {
        return NotFound(new ApiResponse(404, "Photo not found"));
    }

    _photoService.DeleteFromDisk(photo);
    _unitOfWork.Repository<Photo>().Delete(photo);

    var result = await _unitOfWork.Complete();

    if (result <= 0)
    {
        return BadRequest(new ApiResponse(400, "Problem deleting photo"));
    }

    return Ok();
} 


 
    }

    
}