


namespace API.Dtos
{
    public class UpdateUserDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public List<string> Roles { get; set; }
       /*  public IFormFile UserProfilePhoto { get; set; } */
    }
}