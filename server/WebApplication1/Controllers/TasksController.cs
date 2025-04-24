using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
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

        [HttpGet]
        public IActionResult FindAll(int groupId)
        {
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

        [HttpPost]
        public IActionResult CreateTask(int groupid)
        {
            return Ok();
        }
    }
}
