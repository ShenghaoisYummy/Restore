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

    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        // use User.Identity to check if the user is authenticated
        if (User.Identity?.IsAuthenticated == false) return NoContent();
        
        // get the user through the singInManager from the user manager
        var user = await signInManager.UserManager.GetUserAsync(User);
        
        // if the user is not found, return unauthorized
        if (user == null) return Unauthorized();

        // get roles via signInManager.UserManager
        var roles = await signInManager.UserManager.GetRolesAsync(user);

        // retrun ok with the user info and roles
        return Ok(new { user.UserName, user.Email, Roles = roles });
    }
    
    [HttpPost("logout")]
    public async Task<ActionResult> Logout(){
        // sign out the user
        await signInManager.SignOutAsync();
        // return no content
        return NoContent();
    }
    
}

