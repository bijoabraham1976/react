using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] Account login)
    {
        var connectionString = _config.GetConnectionString("DefaultConnection");

        using (MySqlConnection conn = new MySqlConnection(connectionString))
        {
            conn.Open();

            // Correct SQL query for MySQL 8
            string query = "SELECT id, username, password FROM accounts WHERE username = @username AND BINARY password = @password";

            using (MySqlCommand cmd = new MySqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@username", login.Username);
                cmd.Parameters.AddWithValue("@password", login.Password);

                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return Ok(new
                        {
                            message = "Login successful",
                            userId = reader["id"],
                            username = reader["username"]
                        });
                    }
                    else
                    {
                        return Unauthorized(new { message = "Invalid username or password" });
                    }
                }
            }
        }
    }
}
