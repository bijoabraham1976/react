using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace MyApi.Models
{
    public class Resume
    {

         [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int ContactId { get; set; }
        public string? Description { get; set; }

        // Navigation property (optional)
        public Contact? Contact { get; set; }
    }
}
