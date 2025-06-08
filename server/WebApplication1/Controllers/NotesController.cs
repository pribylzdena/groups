using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using WebApplication1.Models;
using WebApplication1.RequestModels;
using WebApplication1.ResponseModels;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Secured]
    [Route("api")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private DB context = new DB();

        [HttpGet("groups/{groupId}/notes")]
        public IActionResult FindAll(int groupId)
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

            List<NoteResponseModel> models = new List<NoteResponseModel>();

            foreach (var item in this.context.notes.Where(x => x.group_id == groupId))
            {
                models.Add(new NoteResponseModel(item));
            }

            return Ok(models);
        }

        //[HttpGet("{id}")]
        //public ObjectResult FindById(int id)
        //{
        //    Note noteEntity = this.context.notes.Find(id);

        //    if (noteEntity == null)
        //    {
        //        return NotFound(new { message = "Group not found" });
        //    }

        //    var group = new NoteResponseModel(noteEntity);

        //    return Ok(group);
        //}


        [HttpPost("groups/{groupId}/notes")]
        public IActionResult Create(int groupId, [FromBody] NoteRequest request)
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

            var newNote = new Models.Note
            {
                name = request.name,
                name_alt = Helper.GetNameAlt(request.name),
                value = "",
                color = request.color,
                group_id = groupId,
                created_by = currentUser.id,
                updated_by = currentUser.id,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                deleted_at = null
            };

            this.context.notes.Add(newNote);
            this.context.SaveChanges();

            NotificationService service = new NotificationService();

            var notification = service.CreateNotification("Create", $"Note {newNote.name} has been created",
                "Note create", 2);

            var groupMembers = this.context.group_members.Where(g => g.group_id == groupId);

            foreach (var item in groupMembers)
            {
                service.SendNotification(item.user_id, notification.id);
            }

            

            var response = new NoteResponseModel(newNote);
            return CreatedAtAction(nameof(Create), response);
        }


        [HttpPut("groups/{groupId}/notes/{id}")]
        public IActionResult Edit(int groupId, int id, [FromBody] NoteRequest request)
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

            var note = this.context.notes.FirstOrDefault(n => n.id == id);
            if (note == null)
            {
                return NotFound(new { message = "Note not found" });
            }

            Console.WriteLine("Edit action called with data: group_id = " + groupId + " id = " + id + " userId = " + userId);

            note.name = request.name;
            note.name_alt = Helper.GetNameAlt(request.name);
            note.value = request.value;
            note.color = request.color;
            note.group_id = groupId;
            note.updated_by = currentUser.id;
            note.updated_at = DateTime.UtcNow;
            this.context.SaveChanges();

            //send notification

            NotificationService service = new NotificationService();

            var notification = service.CreateNotification("Edit", $"Note {note.name} has been edited", "Note edit", 2);

            var groupMembers = this.context.group_members.Where(g => g.group_id == groupId);

            foreach (var item in groupMembers)
            {
                service.SendNotification(item.user_id, notification.id);
            }

            var response = new NoteResponseModel(note);
            return Ok(response);
        }
    }
}
