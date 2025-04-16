using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    //[Secured]
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private MyContexct context = new MyContexct();

        [HttpGet]
        public IActionResult FindAll()
        {
            List<GroupResponseModel> models = new List<GroupResponseModel>();
            
            foreach(var item in this.context.groups)
            {
                models.Add(new GroupResponseModel(item));
            }

            return Ok(models);
        }
    }
}
