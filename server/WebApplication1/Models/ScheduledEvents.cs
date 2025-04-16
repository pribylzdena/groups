namespace WebApplication1.Models
{
    public class ScheduledEvents
    {
        public int id { get; set; }
        public string name { get; set; }
        public DateTime starts_at { get; set; }
        public DateTime ends_at { get; set;}
        public int status { get; set; }
        public string? color { get; set; }
        public int? group_id { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public DateTime? deleted_at { get; set; }
    }
}
