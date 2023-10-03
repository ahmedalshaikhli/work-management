namespace API.Dtos
{
    public class UserDto
    {
        public string id { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        
        public string Token { get; set; }

         public AddressDto Address { get; set; }
        public string UserProfilePhoto { get; set; }
        public List<string> Roles { get; set; }
    }
}