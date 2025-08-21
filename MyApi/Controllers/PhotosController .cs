using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Models;
namespace MyApi.Controllers
{
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class PhotosController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly AppDbContext _context;

    public PhotosController(IWebHostEnvironment env, AppDbContext context)
    {
        _env = env;
        _context = context;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] string name, [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is required.");

        // Ensure folder exists
        var uploadsPath = Path.Combine(_env.ContentRootPath, "Photos");
        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        // Get extension
        var extension = Path.GetExtension(file.FileName);

        // Save file in folder
        var filePath = Path.Combine(uploadsPath, $"{name}{extension}");
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Insert into DB
        var photo = new Photo
        {
            Name = name,
            Extension = extension
        };
        _context.Photos.Add(photo);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Uploaded successfully", photo });
    }
[HttpGet]
public IActionResult GetAll()
{
    var photos = _context.Photos.ToList();
    return Ok(photos);
}

[HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    var photo = await _context.Photos.FindAsync(id);
    if (photo == null)
        return NotFound();

    // Point to custom Photos folder instead of wwwroot
    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Photos");
    var filePath = Path.Combine(uploadsPath, $"{photo.Name}{photo.Extension}");

    if (System.IO.File.Exists(filePath))
    {
        System.IO.File.Delete(filePath);
    }

    // Remove from DB
    _context.Photos.Remove(photo);
    await _context.SaveChangesAsync();

    return Ok(new { message = "Deleted successfully" });
}






}

}