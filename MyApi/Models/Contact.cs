
namespace MyApi.Models
{

    
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public int CountryId { get; set; }
        public Country? Country { get; set; }

        public int StateId { get; set; }
        public State? State { get; set; }

        public string Sex { get; set; }


        public DateTime? dob  { get; set; }
            
        public string Address { get; set; }

        public bool? Covid { get; set; } // maps to BIT NULL in SQL
    }



}
