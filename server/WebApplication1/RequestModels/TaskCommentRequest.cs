using System.ComponentModel.DataAnnotations;
using WebApplication1.Models;

namespace WebApplication1.RequestModels
{
    public class TaskCommentRequest
    {
        public int id { get; set; }
        public string value { get; set; }
        public User user { get; set; }
        public DateTime? createdAt { get; set; }
        public TaskCommentRequest? respondTo { get; set; }
    }
}
