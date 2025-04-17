using WebApplication1.Controllers;
using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class GroupResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<GroupMemberResponseModel> members { get; set; }


        public GroupResponseModel(Group group, List<GroupMember> members)
        {
            Id = group.id;
            Name = group.name;
            members = [];
        }

        
    }
}
