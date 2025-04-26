using System;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("not-found")]
    public IActionResult GetNotFound()
    {
        return NotFound("This is not found");
    }

    [HttpGet("bad-request")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("This is a bad request");
    }

    [HttpGet("Unauthorized")]
    public IActionResult GetUnauthorised()
    {
        return Unauthorized("This is not authorized");
    }

    [HttpGet("validation-error")]
    public IActionResult GetValidationError()
    {
        return BadRequest(new ProblemDetails
        {
            Title = "This is a validation error",
            Status = 400
        });
    }

    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        throw new Exception("This is a server error");
    }
}
