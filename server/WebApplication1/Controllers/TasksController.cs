using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private MyContexct context = new MyContexct();

        [HttpGet]
        public IActionResult FindAll()
        {
            List<TaskResponseModel> models = new List<TaskResponseModel>();

            foreach (var item in this.context.tasks)
            {
                models.Add(new TaskResponseModel(item));
            }

            return Ok(models);
        }
    }
}
