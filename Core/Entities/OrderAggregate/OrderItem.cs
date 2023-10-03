namespace Core.Entities.OrderAggregate
{
    public class OrderItem : BaseEntity
    {

        public OrderItem()
        {
        }

        public OrderItem(ProductItemOrdered itemOrdered, decimal price, int quantity, string  supplierId)
        {
            ItemOrdered = itemOrdered;
            SupplierId = supplierId;
            Price = price;
            Quantity = quantity;
        }

        public ProductItemOrdered ItemOrdered { get; set; }
        public string SupplierId { get; set; }

        
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}