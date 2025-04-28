using System.ComponentModel.DataAnnotations;
using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class NoteResponseModel
    {
        [Required]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string value { get; set; }
        [Required]
        public string color { get; set; }
        public NoteResponseModel(Note note)
        {
            this.id = note.id;
            this.name = note.name;
            this.value = note.value;
            this.color = note.color;
        }
    }
}
