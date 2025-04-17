using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet]
        public IActionResult FindAll()
        {
            List<NoteResponseModel> models = new List<NoteResponseModel>();

            foreach (var item in this.context.Notes)
            {
                models.Add(new NoteResponseModel(item));
            }

            return Ok(models);
        }

        [HttpGet("{id}")]
        public ObjectResult FindById(int id)
        {
            Note noteEntity = this.context.Notes.Find(id);

            if (noteEntity == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            var group = new NoteResponseModel(noteEntity);

            return Ok(group);
        }
    }
}
