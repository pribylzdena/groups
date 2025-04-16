namespace WebApplication1.Models
{
    public class UsersNotifications
    {
        public int id { get; set; }
        public int notification_id { get; set; }
        public int user_id { get; set; }
        public DateTime? read_at { get; set; }
    }
}
