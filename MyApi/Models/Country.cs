using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Models
{
    [Table("Countries")] // ensure correct MySQL table
    public class Country
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("CountryId")]
        public int CountryId { get; set; }

        [Required]
        [Column("CountryName")]
        public string CountryName { get; set; } = "";

        // Navigation properties
        public ICollection<State> States { get; set; } = new List<State>();
        public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
    }
}
