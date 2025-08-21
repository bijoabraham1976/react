namespace MyApi.Models
{
    public class Resume
    {
        public int Id { get; set; }
        public int ContactId { get; set; }
        public string? Description { get; set; }

        // Navigation property (optional)
        public Contact? Contact { get; set; }
    }
}
