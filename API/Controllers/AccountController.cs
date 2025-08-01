using System;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;


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

    [HttpGet("userinfo")]
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
    
    [HttpPost("address")]
    public async Task<ActionResult<Address>> CreateOrUpdateAddress(Address address){

        // get the user who includes the address from the database by username
        var user = await signInManager.UserManager.Users
        .Include(x => x.Address)
        .FirstOrDefaultAsync(x=> x.UserName == User.Identity!.Name);

        // if the user is not found, return unauthorized
        if (user == null) return Unauthorized();

        // update the user's address
        user.Address = address;

        // update the user and get the update result
        var result = await signInManager.UserManager.UpdateAsync(user);

        // if the update is not successful, return a bad request
        if(!result.Succeeded) return BadRequest(new ProblemDetails{Title = "Problem updating address"});

        // if the update is successful, return the user's address
        return Ok(user.Address);
    }

    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<Address>> GetAddress(){
        
        // get the address by the username
        var address = await signInManager.UserManager.Users
        .Where(x => x.UserName == User.Identity!.Name)
        .Select(x => x.Address)
        .FirstOrDefaultAsync();
        // if the address is not found, return no content
        if (address == null) return NoContent();

        // return the address
        return Ok(address);
    }
}

