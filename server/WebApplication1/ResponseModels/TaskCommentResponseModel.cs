using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class TaskCommentResponseModel
    {
        public int id { get; set; }
        public string value { get; set; }
        public UserResponseModel user { get; set; }

        public TaskCommentResponseModel(TaskComment tc, User user)
        {
            id = tc.id;
            value = tc.value;
            this.user = new UserResponseModel(user);
        }
    }
}
