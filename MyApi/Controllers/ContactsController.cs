using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;
using MyApi.Models;
using MyApi.Services;

namespace MyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetContacts()
        {
            var contacts = await _context.Contacts
                .Include(c => c.Country)
                .Include(c => c.State)
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Email,
                    c.CountryId,
                    c.StateId,
                    CountryName = c.Country.CountryName,
                    StateName = c.State.StateName,
                    c.Sex,
                    c.dob,
                    c.Address,
                    c.Covid
                })
                .ToListAsync();

            return Ok(contacts);
        }


 [HttpPost("add")]
        public async Task<IActionResult> AddContact([FromBody] Contact contact)
        {
            Console.WriteLine("AddContact hit ✅");
            Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(contact));

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            
    // Send email notification
   // var emailService = new EmailService();
   // emailService.SendContactEmail(contact.Name, contact.Email);

            return Ok(contact);
        }







        [HttpPut("{id}")]
public async Task<IActionResult> UpdateContact(int id, [FromBody] Contact contact)
{
    if (id != contact.Id) return BadRequest("Id mismatch");

    _context.Entry(contact).State = EntityState.Modified;
    await _context.SaveChangesAsync();
    return Ok(contact);
}

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null) return NotFound();

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
            return Ok();
        }
   
   
    // GET: api/contact
     
   
   
   
   
   
    }
}
