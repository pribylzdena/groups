using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet]
        public IActionResult FindAll()
        {
            List<TaskResponseModel> models = new List<TaskResponseModel>();

            foreach (var item in this.context.tasks)
            {
                models.Add(new TaskResponseModel(item, null));
            }

            return Ok(models);
        }
    }
}
