using Microsoft.EntityFrameworkCore;
using MyApi.Controllers;
using MyApi.Models;

namespace MyApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
       public DbSet<Contact> Contacts { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<State> States { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<Resume> Resumes { get; set; }
            // <-- A
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Country>().ToTable("Country");
            modelBuilder.Entity<State>().ToTable("State");
            modelBuilder.Entity<Contact>().ToTable("Contact");

             
            modelBuilder.Entity<Resume>().ToTable("Resume");
        }
    }
}