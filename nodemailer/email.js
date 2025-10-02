const transporter = require('./email.config.js'); 

const sendWelcomeEmail = async (email, name, ticket_number) => {
    const subject = "Welcome to MegaSolutions - Your Ticket Confirmation";

    const mailOptions = {
        from: '"MegaSolutions Support" <authtimoth@gmail.com>', 
        to: email, 
        subject,
        text: `Hello ${name},\n\nThank you for your request.\nYour ticket number is: ${ticket_number}\n\nWe’ll get back to you shortly.\n\nMegaSolutions Team`, 
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Welcome, ${name}!</h2>
                <p>Thank you for reaching out to <strong>MegaSolutions</strong>.</p>
                <p>Your request has been received successfully.</p>
                <p><strong>Ticket Number:</strong> <span style="color: #1a73e8;">${ticket_number}</span></p>
                <p>We’ll get back to you shortly. If you have any questions, reply to this email.</p>
                <br>
                <p>Best regards,</p>
                <p><strong>MegaSolutions Support Team</strong></p>
            </div>
        `
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email} (Ticket: ${ticket_number})`, response.messageId);
        return response;
    } catch (error) {
        console.error(`Failed to send confirmation email to ${email} (Ticket: ${ticket_number})`, error.message);
        throw new Error(`Error sending confirmation email: ${error.message}`);
    }
};

module.exports = {
    sendWelcomeEmail
};
