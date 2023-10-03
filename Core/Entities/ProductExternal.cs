using System.Linq;

namespace Core.Entities
{
    public class ProductExternal
    {
        public string Pid { get; set; }
        public string ProductName { get; set; }
        public string ProductNameEn { get; set; }
        public string ProductSku { get; set; }
        public string ProductImage { get; set; }

        private string _productWeight;
        public string ProductWeight 
        { 
            get => _productWeight; 
            set
            {
                _productWeight = value;
                SetAverageWeight();
            }
        }

        public double AverageWeight { get; private set; }

        private void SetAverageWeight()
        {
            if (_productWeight.Contains("-"))
            {
                var weights = _productWeight.Split('-').Select(double.Parse).ToArray();
                AverageWeight = (weights[0] + weights[1]) / 2;
            }
            else
            {
                AverageWeight = double.Parse(_productWeight);
            }
        }

        public string ProductType { get; set; }
        public string ProductUnit { get; set; }

        private string _sellPrice;
        public string SellPrice
        { 
            get => _sellPrice; 
            set
            {
                _sellPrice = value;
                SetAverageSellPrice();
            }
        }

        public double AverageSellPrice { get; private set; }

        private void SetAverageSellPrice()
        {
            if (_sellPrice.Contains("--"))
            {
                var prices = _sellPrice.Split("--").Select(double.Parse).ToArray();
                AverageSellPrice = (prices[0] + prices[1]) / 2;
            }
            else
            {
                AverageSellPrice = double.Parse(_sellPrice);
            }
        }

        public string CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int SourceFrom { get; set; }
        public string Remark { get; set; }
        public string CreateTime { get; set; }
    }
}