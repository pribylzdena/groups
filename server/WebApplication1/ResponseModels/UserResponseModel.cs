using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class UserResponseModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string? password { get; set; }
        public string email { get; set; }
        public string? logo { get; set; }

        public UserResponseModel(User user)
        {
            this.id = user.id;
            this.name = user.name;
            this.password = user.password;
            this.email = user.email;
            this.logo = user.logo;
        }
    }

}
