using System.Runtime.CompilerServices;
using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class RecipientResponseModel
    {
        public int id { get; set; }
        public DateTime? readAt { get; set; }
        public UserResponseModel user { get; set; }

        public RecipientResponseModel(UsersNotification data, User user)
        {
            this.id = data.id;
            this.readAt = data.read_at;
            this.user = new UserResponseModel(user);
        }
    }
}
