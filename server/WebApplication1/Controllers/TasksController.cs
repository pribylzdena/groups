using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private DB context = new DB();

        private Models.Task? GetParent(int id)
        {
            Models.Task? taskEntity = this.context.tasks.Find(id);
            Models.Task? parentTaskEntity = this.context.tasks.Find(taskEntity.parent_id);

            return parentTaskEntity;
        }

        [HttpGet("groups/{groupId}/tasks")]
        public IActionResult FindAll(int groupId)
        {
            int userId = 1/*Convert.ToInt32(HttpContext.Items["CurrentUserId"])*/;

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var group = this.context.groups.FirstOrDefault(g => g.id == groupId);
            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }


            List<TaskResponseModel> models = new List<TaskResponseModel>();

            foreach (var item in this.context.tasks.Where(x => x.group_id == groupId))
            {
                
                models.Add(new TaskResponseModel(item, GetParent(item.id)));
            }

            return Ok(models);
        }

        [HttpGet("{id}")]
        public IActionResult FindById(int id)
        {
            Models.Task? taskEntity = this.context.tasks.Find(id);
            Models.Task? parentTaskEntity = this.context.tasks.Find(taskEntity.parent_id); 

            if (taskEntity == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            var task = new TaskResponseModel(taskEntity, GetParent(taskEntity.id));

            return Ok(task);
        }

        [HttpPost("groups/{groupId}/tasks")]
        public IActionResult CreateTask(int groupId, [FromBody] TaskRequest request)
        {
            Console.WriteLine("Create task incialize");


            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var group = this.context.groups.FirstOrDefault(g => g.id == groupId);
            if (group == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            var newTask = new Models.Task
            {
                name = request.name,
                name_alt = Helper.GetNameAlt(request.name),
                description = "",
                status = request.status,
                deadline = request.deadline,
                priority = request.priority,
                color = request.color,
                group_id = groupId,
                created_by = currentUser.id,
                updated_by = currentUser.id,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                reminder_at = request.reminder_at,
                
                deleted_at = null,
            };
            if (!(request.parent_id == newTask.id || request.parent_id == null))
                newTask.parent_id = request.parent_id;

            this.context.tasks.Add(newTask);
            this.context.SaveChanges();

            foreach (var item in request.asignees)
            {
                if (this.context.users.Contains(item))
                {
                    var TaskAsignee = new TaskAssignee();
                    TaskAsignee.user_id = item.id;
                    TaskAsignee.task_id = newTask.id;
                    this.context.tasks_assignees.Add(TaskAsignee);
                }
            }

            
            this.context.SaveChanges();

            return Ok();
        }
    }
}
