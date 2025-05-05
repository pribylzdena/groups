using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class GroupResponseModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public List<GroupMemberResponseModel> members { get; set; }


        public GroupResponseModel(Group group)
        {
            id = group.id;
            name = group.name;
            members = [];
        }

        
    }
}
