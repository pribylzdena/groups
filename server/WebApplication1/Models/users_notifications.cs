namespace WebApplication1.Models
{
    public class users_notifications
    {
        public int Id { get; set; }
        public int notification_id { get; set; }
        public int user_id { get; set; }
        public DateTime read_at { get; set; }
    }
}
