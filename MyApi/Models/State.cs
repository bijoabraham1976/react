using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Models
{
    [Table("States")] // ensure correct MySQL table
    public class State
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("StateId")]
        public int StateId { get; set; }

        [Required]
        [Column("StateName")]
        public string StateName { get; set; } = "";

        [Required]
        [Column("CountryId")]
        public int CountryId { get; set; }

        // ✅ Explicit FK mapping
        [ForeignKey("CountryId")]
        public Country Country { get; set; }
    }
}
