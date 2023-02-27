import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = (recipient_email, url) => {
  //console.log(recipient_email, url)
  // email options
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: recipient_email,
    subject: "PASSWORD RECOVERY",
    html: `<!DOCTYPE html>
        <html lang="en" >
        <head>
          <meta charset="UTF-8">
          <title>CodePen - OTP Email Template</title>
          
        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Barber Shop</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>you're receiving this email because you or 
            someone else has requested a password for your user 
            account. If you did not request a password reset, 
            you can safely ignore this message. Click the link
            to <a href=${url}>reset password</a></p>
            <p style="font-size:0.9em;">Regards,<br />Barber Shop</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>Barber Shop Inc</p>
              <p>1600 Amphitheatre Parkway</p>
              <p>California</p>
            </div>
          </div>
        </div>
        <!-- partial -->
          
        </body>
        </html>`,
  };

  // 3 create transport and send email
  sgMail.send(mailOptions);
};

export const sendInvoice = (price) => {
  const mailOptions = {
    from: "reso0208@gmail.com",
    to: "reso0208@gmail.com",
    subject: "Client Invoice",
    html: `<!DOCTYPE html>
        <html lang="en" >
        <head>
          <meta charset="UTF-8">
          <title>CodePen - OTP Email Template</title>
          
        </head>
        <body>
        <!-- partial:index.partial.html -->
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
          <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Barber Shop</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>you're receiving this email because you should be recieving a payment of $${price} from your client ...
            in 2-3 buisness days  </p>
            <p style="font-size:0.9em;">Regards, Laurisseau's invoice reminder <br />Barber Shop</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
              <p>ClientX</p>
            </div>
          </div>
        </div>
        <!-- partial -->
          
        </body>
        </html>`,
  };

  // 3 create transport and send email
  sgMail.send(mailOptions);
};
