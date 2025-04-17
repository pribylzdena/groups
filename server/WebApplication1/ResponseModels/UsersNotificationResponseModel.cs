using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class UsersNotificationResponseModel
    {
        public int id { get; set; }
        public UserResponseModel user { get; set; }
        public DateTime? readAt { get; set; }

        public UsersNotificationResponseModel(UsersNotification notification, User user)
        {
            id = notification.id;
            this.user = new UserResponseModel(user);
            readAt = notification.read_at;
        }
    }

}
