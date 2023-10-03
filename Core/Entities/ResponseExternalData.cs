namespace Core.Entities
{
  public class ResponseExternalData
    {
        public int Code { get; set; }
        public bool Result { get; set; }
        public string Message { get; set; }
        public ProductExternalData Data { get; set; }
        public string RequestId { get; set; }
    }
    }