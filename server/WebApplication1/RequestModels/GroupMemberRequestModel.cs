using System.ComponentModel.DataAnnotations;
using WebApplication1.ResponseModels;

namespace WebApplication1.RequestModels
{
    public class GroupMemberRequestModel
    {
        [Required]
        public string role { get; set; }
        [Required]
        public UserRequestModel user { get; set; }
    }
}
