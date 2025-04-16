using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Mappers;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
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
                models.Add(ResponseModelMapper.MapToGroupResponseModel(item, new GroupResponseModel()));
            }

            return Ok(models);
        }
    }
}
