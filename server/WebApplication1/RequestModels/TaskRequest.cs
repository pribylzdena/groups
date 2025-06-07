using System.ComponentModel.DataAnnotations;
using WebApplication1.Models;
using WebApplication1.ResponseModels;

namespace WebApplication1.RequestModels
{
    public class TaskRequest
    {
        public int id { get; set; }
        public string name { get; set; }
        public string? description { get; set; }
        [Required]
        public string status { get; set; }
        public DateTime? deadline { get; set; }
        public string? color { get; set; }
        public string? priority { get; set; }
        public TaskRequest? parent { get; set; }
        public DateTime? reminderAt { get; set; }
        public List<User>? assignees { get; set; }
        public List<TaskCommentRequest>? comments { get; set; }
    }
}
