using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{
    /* [Authorize] */
    public class OrdersController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        public OrdersController(UserManager<AppUser> userManager, IEmailSender emailSender, IOrderService orderService, IMapper mapper)
        {
            _emailSender = emailSender;
            _mapper = mapper;
            _orderService = orderService;
             _userManager = userManager;
        }

   [HttpPost]
public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
{
    var email = HttpContext.User.RetrieveEmailFromPrincipal();

    var address = _mapper.Map<AddressDto, Core.Entities.OrderAggregate.Address>(orderDto.ShipToAddress);

    var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address, orderDto.PaymentMethod);

    if (order == null) 
    {
        return BadRequest(new ApiResponse(400, "Problem creating order"));
    }

    // Email content can be improved and you can use HTML tags to style it
   /*  var emailConfirmationMessage = $"Dear customer, \n\nYour order was successfully created. \n\nOrder ID: {order.Id}"; 
    await _emailSender.SendEmailAsync(email, "Order Confirmation", emailConfirmationMessage); */

    return Ok(order);
}
/*      [HttpGet("all")]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrders()
        {
            var orders = await _orderService.GetOrdersAsync();
            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        } */
 

[HttpGet("allorders")]
public async Task<ActionResult<IEnumerable<OrderToReturnDto>>> GetOrdersAllUsers(int pageIndex = 0, int pageSize = 10, string searchTerm = "")
{
    var orders = await _orderService.GetOrdersAsync();

    // Apply search filter if a search term is provided
    if (!string.IsNullOrEmpty(searchTerm))
    {
        if (DateTime.TryParse(searchTerm, out var searchDate))
        {
            orders = orders.Where(o => o.BuyerEmail.Contains(searchTerm) || o.OrderDate.Date == searchDate.Date).ToList();
        }
        else
        {
            orders = orders.Where(o => o.BuyerEmail.Contains(searchTerm)).ToList();
        }
    }

    var totalCount = orders.Count;
    var pagedOrders = orders.Skip(pageIndex * pageSize).Take(pageSize).ToList();

    var orderDtos = _mapper.Map<List<OrderToReturnDto>>(pagedOrders);

    return Ok(new { orders = orderDtos, totalCount, totalPages = (int)Math.Ceiling((double)totalCount / pageSize) });
}

//https://localhost:5001/api/orders/email/admin@test.com
        [HttpGet("email/{email}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByEmailForUser(string email)
        {
            

            var order = await _orderService.GetOrderByEmailAsync(email);

            if (order == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<OrderToReturnDto>(order);
        }
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser()
        {
            var email = User.RetrieveEmailFromPrincipal();

            var orders = await _orderService.GetOrdersForUserAsync(email);

            return Ok(_mapper.Map<IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>> GetOrderByIdForUser(int id)
        {
            var email = User.RetrieveEmailFromPrincipal();

            var order = await _orderService.GetOrderByIdAsync(id, email);

            if (order == null) return NotFound(new ApiResponse(404));

            return _mapper.Map<OrderToReturnDto>(order);
        }

        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await _orderService.GetDeliveryMethodsAsync());
        }


        [HttpGet("allordersForSupplier")]
public async Task<ActionResult<IEnumerable<OrderToReturnDto>>> GetOrdersForSupplier(string userId,int pageIndex = 0, int pageSize = 10, string searchTerm = "")
{
    // Get the user by userId instead of using HttpContext.User
    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
    {
        return NotFound(new { message = "User not found" });
    }

    // Get orders for the specific user (now using user.Id instead of user.SupplierId)
    var orders = await _orderService.GetOrdersForSupplierAsync(user.Id);

    // Apply search filter if a search term is provided
    if (!string.IsNullOrEmpty(searchTerm))
    {
        if (DateTime.TryParse(searchTerm, out var searchDate))
        {
            orders = orders.Where(o => o.BuyerEmail.Contains(searchTerm) || o.OrderDate.Date == searchDate.Date).ToList();
        }
        else
        {
            orders = orders.Where(o => o.BuyerEmail.Contains(searchTerm)).ToList();
        }
    }

    var totalCount = orders.Count;
    var pagedOrders = orders.Skip(pageIndex * pageSize).Take(pageSize).ToList();

    var orderDtos = _mapper.Map<List<OrderToReturnDto>>(pagedOrders);

    return Ok(new { orders = orderDtos, totalCount, totalPages = (int)Math.Ceiling((double)totalCount / pageSize) });
}

    }
}