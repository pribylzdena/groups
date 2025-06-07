using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query;
using Newtonsoft.Json;
using System.Drawing;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;
using static Google.Protobuf.Reflection.UninterpretedOption.Types;

namespace WebApplication1.Controllers
{
    [Secured]
    [Route("api")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private DB context = new DB();

        //private Models.Task? GetParent(int id)
        //{
        //    Models.Task? taskEntity = this.context.tasks.Find(id);
        //    Models.Task? parentTaskEntity = this.context.tasks.Find(taskEntity.parent_id);

        //    return parentTaskEntity;
        //}

        [HttpGet("groups/{groupId}/tasks")]
        public IActionResult FindAll(int groupId)
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);
            User currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                Console.WriteLine($"User with id: {userId} not found");
                return NotFound(new { message = "User not found" });
            }

            var group = this.context.groups.FirstOrDefault(g => g.id == groupId);
            if (group == null)
            {
                Console.WriteLine("Group not found");
                return NotFound(new { message = "Group not found" });
            }

            var tasks = this.context.tasks.Where(x => x.group_id == groupId).ToList();
            var allUsers = this.context.users.ToList();
            var allComments = this.context.task_comments.Where(t => tasks.Select(task => task.id).Contains(t.task_id) && t.deleted_at == null).ToList();
            var allAssignees = this.context.tasks_assignees.Where(t => tasks.Select(task => task.id).Contains(t.task_id)).ToList();
            var userIds = allAssignees.Select(a => a.user_id).Distinct().ToList();
            var users = this.context.users.Where(u => userIds.Contains(u.id)).ToList();

            List<TaskResponseModel> models = new List<TaskResponseModel>();
            foreach (var item in tasks)
            {
                List<TaskCommentResponseModel> comments = new List<TaskCommentResponseModel>();
                foreach (var comment in allComments)
                {
                    var comment_response = new TaskCommentResponseModel(comment, allUsers.FirstOrDefault(u => u.id == comment.created_by));
                    var respond_to_comment = allComments.FirstOrDefault(c => c.id == comment.respond_to);
                    if (respond_to_comment != null)
                    {
                        comment_response.respondTo = new TaskCommentResponseModel(respond_to_comment, allUsers.FirstOrDefault(u => u.id == respond_to_comment.created_by));
                    }

                    comments.Add(comment_response);
                }

                models.Add(new TaskResponseModel(item, item.GetParent()) { comments = comments } );
            }

            foreach (var item in models)
            {
                var taskAssignees = allAssignees.Where(a => a.task_id == item.id).ToList();
                foreach (var assignee in taskAssignees)
                {
                    var user = users.FirstOrDefault(u => u.id == assignee.user_id);
                    if (user != null)
                    {
                        item.assignees.Add(user);
                    }
                }
            }

            return Ok(models);
        }

        [HttpGet("{id}")]
        public IActionResult FindById(int id)
        {
            Models.Task? taskEntity = this.context.tasks.Find(id);
            //Models.Task? parentTaskEntity = this.context.tasks.Find(taskEntity.parent_id); 

            if (taskEntity == null)
            {
                return NotFound(new { message = "Group not found" });
            }


            var taskAssignees = this.context.tasks_assignees.Where(x => x.task_id == id).ToList();
            var taskUsers = new List<User>();
            //taskUsers.AddRange(this.context.users.Contains(id == taskAssignees.ForEach()));

            foreach (var item in taskAssignees)
            {
                var user = this.context.users.FirstOrDefault(u => u.id == item.user_id);
                if (user != null)
                {
                    taskUsers.Add(user);
                }
            }
            var task = new TaskResponseModel(taskEntity, taskEntity.GetParent());
            task.assignees = taskUsers;

            return Ok(task);
        }

        [HttpPost("groups/{groupId}/tasks")]
        public IActionResult Create(int groupId, [FromBody] TaskRequest request)
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
                description = request.description,
                status = request.status,
                deadline = request.deadline,
                priority = request.priority,
                color = request.color,
                group_id = groupId,
                created_by = currentUser.id,
                updated_by = currentUser.id,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                reminder_at = request.reminderAt,
                parent_id = request.parent != null ? request.parent.id : null,
                deleted_at = null,
            };

            this.context.tasks.Add(newTask);
            this.context.SaveChanges();

            var response = new TaskResponseModel(newTask);

            if (request.assignees != null)
            {
                foreach (var item in request.assignees)
                {
                    if (this.context.users.Contains(item))
                    {
                        var TaskAsignee = new TaskAssignee();
                        TaskAsignee.user_id = item.id;
                        TaskAsignee.task_id = newTask.id;
                        this.context.tasks_assignees.Add(TaskAsignee);
                        response.assignees.Add(item);
                    }
                }
            }

            this.context.SaveChanges();

            return CreatedAtAction(nameof(Create), response);
        }

        [HttpPut("groups/{groupId}/tasks/{id}")]
        public IActionResult Edit(int groupId, int id, [FromBody] TaskRequest request)
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(request, new JsonSerializerOptions { WriteIndented = true }));

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

            var task = this.context.tasks.FirstOrDefault(n => n.id == id);
            if (task == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            Console.WriteLine("Edit action called with data: group_id = " + groupId + " id = " + id + " userId = " + userId);

            task.name = request.name;
            task.name_alt = Helper.GetNameAlt(request.name);
            task.description = request.description;
            task.status = request.status;
            task.deadline = request.deadline;
            task.priority = request.priority;
            task.color = request.color;
            task.group_id = groupId;
            task.created_by = currentUser.id;
            task.updated_by = currentUser.id;
            task.created_at = DateTime.UtcNow;
            task.updated_at = DateTime.UtcNow;
            task.reminder_at = request.reminderAt;
            task.deleted_at = null;
            this.context.SaveChanges();

            var response = new TaskResponseModel(task);
            response.assignees = request.assignees;

            
            var assigneesToAdd = new List<User>();
            var taskAssignees = new List<TaskAssignee>();

            if (request.assignees != null)
            {
                foreach (var item in request.assignees)
                {
                    var member = new User();
                    member.email = item.email;
                    member.name = item.name;
                    member.password = item.password;
                    member.created_at = item.created_at;
                    member.logo = item.logo;
                    member.updated_at = DateTime.UtcNow;
                    assigneesToAdd.Add(member);

                    var assignee = new TaskAssignee();
                    assignee.task_id = task.id;
                    assignee.user_id = item.id;
                    taskAssignees.Add(assignee);
                }

                var assigneesForDelete = this.context.tasks_assignees
                    .Where(u => u.task_id == task.id)
                    .ToList();

                this.context.tasks_assignees.RemoveRange(assigneesForDelete);
                this.context.tasks_assignees.AddRange(taskAssignees);
            }

            this.context.SaveChanges();

            return Ok(response);
        }
    }
}
