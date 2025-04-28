using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;

namespace WebApplication1.RequestModels
{
    public class NoteRequest
    {
        [Required]
        public string name { get; set; }
        
        [Required]
        public string color { get; set; }

        public string value { get; set; }
    }
}
