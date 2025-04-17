﻿using System.ComponentModel.DataAnnotations;

namespace WebApplication1.RequestModels
{
    public class RegisterRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required, MinLength(6)]
        public string Password { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
