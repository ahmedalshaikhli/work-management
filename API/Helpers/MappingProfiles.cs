using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;
using System.Linq;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
CreateMap<ProductDto, Product>()
    .ForMember(dest => dest.ProductTypeId, opt => opt.MapFrom(src => src.ProductTypeId))
    .ForMember(dest => dest.ProductBrandId, opt => opt.MapFrom(src => src.ProductBrandId))
    .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Photos.Select(p => new Photo { FileName = p.FileName })));
     

CreateMap<Product, ProductToReturnDto>()
 .ForMember(d => d.ProductType, o => o.MapFrom(s => s.ProductType.Name))
    .ForMember(d => d.ProductBrand, o => o.MapFrom(s => s.ProductBrand.Name))
    .ForMember(d => d.Photos, o => o.MapFrom(s => s.Photos.Select(p => new PhotoDto { Id = p.Id, FileName = p.FileName, PictureUrl = p.PictureUrl})))
     .ForMember(d => d.CreatorName, o => o.MapFrom(s => s.Creator.DisplayName)) // This line is added
    .ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());
            CreateMap<Photo, PhotoDto>();
CreateMap<ProductExternalDto, Product>()
           
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.ProductNameEn))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.sellPrice ?? default(decimal)))
            .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom(src => src.productImage));
        // Map other fields as needed
    CreateMap<ProductExternal, Product>();
   
  
            CreateMap<Core.Entities.Identity.Address, AddressDto>().ReverseMap();
            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
            CreateMap<AddressDto, Core.Entities.OrderAggregate.Address>();
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
                .ForMember(d => d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price));
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s =>  s.ItemOrdered.ProductItemId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s =>  s.ItemOrdered.ProductName))
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s =>  s.ItemOrdered.PictureUrl))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<OrderItemUrlResolver>());

            CreateMap<AppUser, UserDto>()
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address));

             CreateMap<IFormFile, Photo>()
                .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.FileName));
        }
    }
}