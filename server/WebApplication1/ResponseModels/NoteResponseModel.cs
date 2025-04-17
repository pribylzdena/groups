using WebApplication1.Models;

namespace WebApplication1.ResponseModels
{
    public class NoteResponseModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public string value { get; set; }
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
