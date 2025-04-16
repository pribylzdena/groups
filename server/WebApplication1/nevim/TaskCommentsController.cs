using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class TaskCommentsResponseModel
    {
        public int id { get; set; }
        public string value { get; set; }
        public User user { get; set; }

        public TaskCommentsResponseModel(TaskComments tc)
        {
            id = tc.id;
            value = tc.value;
            user = new User();
        }
    }
}
