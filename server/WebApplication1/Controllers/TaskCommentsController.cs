using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Secured]
    [Route("api")]
    [ApiController]
    public class TaskCommentsController : ControllerBase
    {
        private DB context = new DB();

        [HttpPost("groups/{groupId}/tasks/{id}/comments")]
        public IActionResult Create(int groupId, int id, [FromBody] TaskCommentRequest request)
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            Console.WriteLine(userId);

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

            var task = this.context.tasks.FirstOrDefault(t => t.id == id);
            if (task == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            var comment = new TaskComment()
            {
                value = request.value,
                task_id = task.id,
                created_by = currentUser.id,
                updated_by = currentUser.id,
                created_at = DateTime.Now,
                updated_at = DateTime.Now,
            };

            if (request.respondTo != null)
            {
                comment.respond_to = request.respondTo.id;
            }

            this.context.task_comments.Add(comment);
            this.context.SaveChanges();

            return Ok(new TaskCommentResponseModel(comment, currentUser));
        }

        [HttpDelete("groups/{groupId}/tasks/{taskId}/comments/{id}")]
        public IActionResult Delete(int groupId, int taskId, int id)
        {
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

            var task = this.context.tasks.FirstOrDefault(t => t.id == taskId);
            if (task == null)
            {
                return NotFound(new { message = "Task not found" });
            }

            var comment = this.context.task_comments.FirstOrDefault(t => t.id == id);
            if (comment == null)
            {
                return NotFound(new { message = "Comment not found" });
            }

            comment.deleted_at = DateTime.UtcNow;
            this.context.SaveChanges();

            return NoContent();
        }

    }
}
