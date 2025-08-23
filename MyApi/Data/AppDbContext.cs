using Microsoft.EntityFrameworkCore;
using MyApi.Models;

namespace MyApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Country> Countries { get; set; }
                public DbSet<State> States { get; set; } = null!;
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Resume> Resumes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

              modelBuilder.HasCharSet("utf8mb4").UseCollation("utf8mb4_unicode_ci");

            // Table names
            modelBuilder.Entity<Country>().ToTable("Country");
            modelBuilder.Entity<State>().ToTable("State");
            modelBuilder.Entity<Contact>().ToTable("Contact");
            modelBuilder.Entity<Resume>().ToTable("Resume");
            modelBuilder.Entity<Photo>().ToTable("Photos");
            modelBuilder.Entity<User>().ToTable("Users");

            // Column configurations for MySQL 5.1 compatibility
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd(); // auto_increment
                entity.Property(e => e.FirstName).HasColumnType("VARCHAR(50)").IsRequired(false);
                entity.Property(e => e.LastName).HasColumnType("VARCHAR(50)").IsRequired(false);
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.HasKey(e => e.CountryId);
                entity.Property(e => e.CountryId).ValueGeneratedOnAdd();
                entity.Property(e => e.CountryName).HasColumnType("VARCHAR(100)").IsRequired();
            });

           modelBuilder.Entity<State>(entity =>
{
    entity.HasKey(e => e.StateId);

    entity.Property(e => e.StateId)
          .ValueGeneratedOnAdd();

    entity.Property(e => e.StateName)
          .HasColumnType("VARCHAR(100)")
          .IsRequired();

    entity.HasOne(e => e.Country)
          .WithMany(c => c.States)   // ✅ use navigation property
          .HasForeignKey(e => e.CountryId)
          .OnDelete(DeleteBehavior.Restrict); // optional, prevents cascade delete issues
});


            modelBuilder.Entity<Contact>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Name).HasColumnType("VARCHAR(100)").IsRequired();
                entity.Property(e => e.Email).HasColumnType("VARCHAR(150)").IsRequired();
                entity.Property(e => e.Sex).HasColumnType("VARCHAR(10)").IsRequired();
                entity.Property(e => e.Address).HasColumnType("VARCHAR(255)").IsRequired(false);
                entity.Property(e => e.Covid).HasColumnType("TINYINT(1)").IsRequired(false); // boolean
            });

            modelBuilder.Entity<Resume>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Description).HasColumnType("VARCHAR(500)").IsRequired(false);
                entity.HasOne(e => e.Contact)
                      .WithMany()
                      .HasForeignKey(e => e.ContactId);
            });

            modelBuilder.Entity<Photo>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Name).HasColumnType("VARCHAR(200)").IsRequired();
                entity.Property(e => e.Extension).HasColumnType("VARCHAR(10)").IsRequired();
            });
        }
    }
}
