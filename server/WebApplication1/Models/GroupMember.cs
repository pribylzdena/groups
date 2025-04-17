namespace WebApplication1.Models
{
    public class GroupMember
    {
        public int Id { get; set; }
        public int user_id { get; set; }
        public int group_id { get; set; }
        public string role { get; set; }
        public DateTime? created_at { get; set; }
    }
}
