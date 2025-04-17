using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class TaskResponseModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string status { get; set; }
        public DateTime? deadline { get; set; }
        public string? color { get; set; }
        public string? priority { get; set; }

        public DateTime? reminderAt { get; set; }
        public string? description { get; set; }

        public TaskResponseModel? parent { get; set; }
        public List<User>? assignees { get; set; }

        public TaskResponseModel(Models.Task task, Models.Task? parent)
        {
            this.id = task.id;
            this.name = task.name;
            this.status = task.status;
            this.deadline = task.deadline;
            this.color = task.color;
            this.priority = task.priority;
            this.reminderAt = task.reminder_at;
            this.description = task.description;
            this.parent = new TaskResponseModel(parent, null); //TODO vnoreni parent tasku
            this.assignees = [];
        }

    }
}
