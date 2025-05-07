using System.ComponentModel.DataAnnotations;

namespace WebApplication1.RequestModels
{
    public class UserRequestModel
    {
        [Required]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        public string password { get; set; }
        public string email { get; set; }
        public string? logo { get; set; }
    }
}
