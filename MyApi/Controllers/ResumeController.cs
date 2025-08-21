using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Models;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResumeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ResumeController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ POST: api/resume
        [HttpPost]
        public async Task<ActionResult<Resume>> CreateResume(Resume resume)
        {
            if (resume == null)
                return BadRequest("Invalid resume data.");

            _context.Resumes.Add(resume);   // ✅ use Resumes
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetResumeById), new { id = resume.Id }, resume);
        }

        // ✅ GET: api/resume/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Resume>> GetResumeById(int id)
        {
            var resume = await _context.Resumes   // ✅ use Resumes
                                       .Include(r => r.Contact)
                                       .FirstOrDefaultAsync(r => r.Id == id);

            if (resume == null)
                return NotFound();

            return resume;
        }

        [HttpGet("contacts")]
public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
{
    return await _context.Contacts.ToListAsync();
}

        // ✅ GET: api/resume
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resume>>> GetAllResumes()
        {
            return await _context.Resumes   // ✅ use Resumes
                                 .Include(r => r.Contact)
                                 .ToListAsync();
        }
    }
}
