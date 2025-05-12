using WebApplication1.Models;
using WebApplication1.ResponseModels;

namespace WebApplication1.RequestModels
{
    public class RecipientRequest
    {
        public DateTime? readAt { get; set; }
        public UserRequestModel user { get; set; }

    }
}
