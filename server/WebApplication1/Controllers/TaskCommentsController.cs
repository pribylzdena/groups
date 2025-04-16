using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskCommentsController : ControllerBase
    {
        private MyContexct context = new MyContexct();

        [HttpGet]
        public IActionResult FindAll()
        {
            List<TaskCommentsResponseModel> models = new List<TaskCommentsResponseModel>();

            foreach (var item in this.context.task_comments)
            {
                models.Add(new TaskCommentsResponseModel(item));
            }

            return Ok(models);
        }
    }
}
