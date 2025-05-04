using System.ComponentModel.DataAnnotations;
using WebApplication1.Models;
using WebApplication1.ResponseModels;

namespace WebApplication1.RequestModels
{
    public class EditGroupRequest
    {
        [Required]
        public string name { get; set; }
        [Required]
        public List<GroupMember> groupMembers { get; set; }

    }
}
