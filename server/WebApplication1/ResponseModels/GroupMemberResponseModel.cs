using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class GroupMemberResponseModel
    {
        public int id { get; set; }
        //public int group_id { get; set; }
        public string role { get; set; }
        public UserResponseModel User { get; set; }

        public GroupMemberResponseModel(GroupMember model, User user)
        {
            this.role = model.role;
            id = model.id;
            //group_id = model.group_id;
            this.User = new UserResponseModel(user);
        }
    }
}
