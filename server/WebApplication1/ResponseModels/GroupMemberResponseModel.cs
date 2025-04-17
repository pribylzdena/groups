using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class GroupMemberResponseModel
    {
        public int Id { get; set; }
        public string role { get; set; }
        public UserResponseModel User { get; set; }

        public GroupMemberResponseModel(GroupMember model, User user)
        {
            this.Id = model.Id;
            this.role = model.role;
            this.User = new UserResponseModel(user);
        }
    }
}
