using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskCommentsController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet]
        public IActionResult FindAll()
        {
            List<TaskCommentResponseModel> models = new List<TaskCommentResponseModel>();

            foreach (var item in this.context.TaskComments)
            {
                models.Add(new TaskCommentResponseModel(item, null));
            }

            return Ok(models);
        }
    }
}
