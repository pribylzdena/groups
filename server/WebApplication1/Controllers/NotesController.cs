using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;

namespace WebApplication1.Controllers
{
    [Route("api")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet]
        public IActionResult FindAll(int groupId)
        {
            List<NoteResponseModel> models = new List<NoteResponseModel>();

            foreach (var item in this.context.notes.Where(x => x.group_id == groupId))
            {
                models.Add(new NoteResponseModel(item));
            }

            return Ok(models);
        }

        [HttpGet("{id}")]
        public ObjectResult FindById(int id)
        {
            Note noteEntity = this.context.notes.Find(id);

            if (noteEntity == null)
            {
                return NotFound(new { message = "Group not found" });
            }

            var group = new NoteResponseModel(noteEntity);

            return Ok(group);
        }


        [HttpPost]
        public IActionResult Create([FromBody] NoteRequest request)
        {
            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);
            if (currentUser == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var newNote = new Models.Note
            {
                name = request.name,
                name_alt = Helper.GetNameAlt(request.name),
                value = request.value,
                created_by = currentUser.id,
                updated_by = currentUser.id,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                deleted_at = null
            };


            this.context.notes.Add(newNote);
            this.context.SaveChanges();

            var response = new NoteResponseModel(newNote);
            return CreatedAtAction(nameof(FindById), new { id = newNote.id }, response);
        }


        [HttpPut("groups/{groupId}/notes/{id}")]
        public IActionResult Edit(int groupId, int id)
        {
            Models.Task task = this.context.tasks.Find(id);

            int userId = Convert.ToInt32(HttpContext.Items["CurrentUserId"]);

            var currentUser = this.context.users.FirstOrDefault(u => u.id == userId);

            GroupMember gm = this.context.group_members.Find(currentUser.id);


            if (task == null)
            {
                return BadRequest(new { message = "task not found" });
            }

            if (gm == null)
            {
                return BadRequest(new { message = "group not found" });
            }

            if (gm.group_id != task.group_id)
            {
                return Unauthorized();
            }

            return Ok();

        }
    }
}
