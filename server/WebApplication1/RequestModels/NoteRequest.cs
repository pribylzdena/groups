using System.ComponentModel.DataAnnotations;

namespace WebApplication1.RequestModels
{
    public class NoteRequest
    {
        [Required]
        public string name { get; set; }
        [Required]
        public string value { get; set; }



    }
}
