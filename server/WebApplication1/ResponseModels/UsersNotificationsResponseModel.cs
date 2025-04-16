using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class UsersNotificationsResponseModel
    {
        public int id { get; set; }
        public User user { get; set; }
        public DateTime? readAt { get; set; }

        public UsersNotificationsResponseModel(UsersNotifications notification)
        {
            id = notification.id;
            user = new User();
            readAt = notification.read_at;
        }
    }

}
