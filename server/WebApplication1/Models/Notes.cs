namespace WebApplication1.Models
{
    public class Notes
    {
        public int id { get; set; }
        public string name  { get; set; }
        public string name_alt { get; set; }
        public int group_id { get; set; }
        public string value { get; set; }
        public int created_by { get; set; }
        public string color { get; set; }
        public int updated_by { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public DateTime deleted_at { get; set; }
    }
}
