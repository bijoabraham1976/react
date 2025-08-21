using MailKit.Net.Smtp;
using MimeKit;

namespace MyApi.Services
{
    public class EmailService
    {
        public void SendContactEmail(string name, string email)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("My API", "no-reply@orangeblack.com")); 
            message.To.Add(new MailboxAddress("Admin", "bijo@orangeblack.com"));
            message.Subject = "New Contact Added";

            message.Body = new TextPart("plain")
            {
                Text = $"A new contact has been added:\n\nName: {name}\nEmail: {email}"
            };

            using (var client = new SmtpClient())
            {
                client.Connect("smtp.yourmailserver.com", 587, false); // change to your SMTP
                client.Authenticate("smtp-username", "smtp-password");
                client.Send(message);
                client.Disconnect(true);
            }
        }
    }
}
