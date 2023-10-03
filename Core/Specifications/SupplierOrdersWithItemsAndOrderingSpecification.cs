using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class SupplierOrdersWithItemsAndOrderingSpecification : BaseSpecification<Order>
    {

     public SupplierOrdersWithItemsAndOrderingSpecification() : base(null)
    {
        AddInclude(o => o.OrderItems);
        AddInclude(o => o.DeliveryMethod);
        AddOrderByDescending(o => o.OrderDate);
    }
    

           public SupplierOrdersWithItemsAndOrderingSpecification(string supplierId)
            : base(o =>  o.OrderItems.Any(item => item.SupplierId == supplierId))
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);
        }
    }
}