using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using MyApi.Data;
using MyApi.Models;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/user
    [HttpGet]
    public IActionResult GetUsers()
    {
        return Ok(_context.Users.ToList());
    }

    // POST: api/user
    [HttpPost]
    public IActionResult AddUser([FromBody] User? user)
    {
        Console.WriteLine("DEBUG Received:");
        Console.WriteLine($"FirstName: {user?.FirstName}");
        Console.WriteLine($"LastName: {user?.LastName}");

        if (user is null)
        {
            return BadRequest("User payload is required.");
        }

        try
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(user);
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERROR: " + ex.Message);
            return StatusCode(500, ex.Message);
        }
    }

    // PUT: api/user/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, [FromBody] User? updatedUser)
    {
        if (updatedUser is null)
        {
            return BadRequest("User payload is required.");
        }

        var existingUser = _context.Users.FirstOrDefault(u => u.Id == id);
        if (existingUser is null)
        {
            return NotFound($"User with ID {id} not found.");
        }

        try
        {
            existingUser.FirstName = updatedUser.FirstName;
            existingUser.LastName = updatedUser.LastName;

            _context.SaveChanges();
            return Ok(existingUser);
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERROR: " + ex.Message);
            return StatusCode(500, ex.Message);
        }
    }

    // DELETE: api/user/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var user = _context.Users.FirstOrDefault(u => u.Id == id);
        if (user is null)
        {
            return NotFound($"User with ID {id} not found.");
        }

        try
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok(new { message = "User deleted successfully." });
        }
        catch (Exception ex)
        {
            Console.WriteLine("ERROR: " + ex.Message);
            return StatusCode(500, ex.Message);
        }
    }
}
