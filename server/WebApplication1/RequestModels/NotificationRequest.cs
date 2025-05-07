using System.ComponentModel.DataAnnotations;
using WebApplication1.ResponseModels;

namespace WebApplication1.RequestModels
{
    public class NotificationRequest
    {
        [Required]
        public string name { get; set; }
        public string text { get; set; }
        public string subject { get; set; }
        public int type { get; set; }
        [Required]
        public List<RecipientResponseModel>? recipients { get; set; }
    }
}
