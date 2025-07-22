using System;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using API.Entities;
using Microsoft.AspNetCore.Identity;


namespace API.Controllers;

public class AccountController(SignInManager<User> signInManager) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        var user = new User { UserName = registerDto.Email, Email = registerDto.Email };
        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("Registration", error.Description);
            }
            return ValidationProblem();
        }

        await signInManager.UserManager.AddToRoleAsync(user, "Member");
        return Ok(new { Message = "User registered successfully" });
    }
}
