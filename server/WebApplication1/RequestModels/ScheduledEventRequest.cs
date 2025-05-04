using System.ComponentModel.DataAnnotations;

namespace WebApplication1.RequestModels
{
    public class ScheduledEventRequest
    {
        [Required]
        public string name { get; set; }
        [Required]
        public DateTime starts_at { get; set; }
        [Required]
        public DateTime ends_at { get; set; }
        [Required]
        public int status { get; set; }
        [Required]
        public string? color { get; set; }
    }
}
