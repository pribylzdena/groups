namespace WebApplication1.Models
{
    public class Task_comments
    {
        public int id { get; set; }
        public string value { get; set; }
        public int task_id { get; set; }
        public int? respond_to { get; set; }
        public int created_by { get; set; }
        public int? updated_by { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public DateTime? deleted_at { get; set; }

    }
}
