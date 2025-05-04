using System.ComponentModel.DataAnnotations;

namespace WebApplication1.RequestModels
{
    public class CreateGroupRequest
    {
        [Required]
        public string name { get; set; }
    }
}
