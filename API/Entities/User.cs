using System;
using Microsoft.AspNetCore.Identity;
namespace API.Entities
{
    public class User : IdentityUser
    {
        public int Id { get; set; }
        public string UserName { get; set; }
    }
}
















