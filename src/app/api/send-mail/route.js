import nodemailer from 'nodemailer';
import { render } from '@react-email/render'; // Correct import
import WelcomeTemplate from '@/emails/welcome'; // Ensure this path is correct
import path from 'path';



export async function POST(req) {
  try {
    // Parse request body
    const { name, email, subject, message } = await req.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
      });
    }

    // Environment variables
    const {
      EMAIL_CONTACT_USER,
      EMAIL_CONTACT_PASSWORD,
      EMAIL_PROVIDER_HOST,
      EMAIL_PROVIDER_PORT_SSL,
    } = process.env;

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_PROVIDER_HOST, // Replace with your SMTP host
      port: parseInt(EMAIL_PROVIDER_PORT_SSL, 10) || 587, // Port, defaulting to 587
      auth: {
        user: EMAIL_CONTACT_USER, // Sender email address
        pass: EMAIL_CONTACT_PASSWORD, // Sender email password
      },
    });

    // Generate email HTML using React Email template
    const emailHtml = await render(
      <WelcomeTemplate
        projectNumber="123456789"
        projectName={"This is project name"}
        projectDate={'10-10-2024'}
        nameSubcontractor={"Name Subcontractor"}
        projectCategory={"Project Category"}
        generalDetails={"General details"}
        clientPreferences={"Client Preferences"}
      />
    )


    const logoPath = path.resolve('public/logo.png');  // Resolve to absolute path
    const coloredLogoPath = path.resolve('public/colored-logo.png');  // Resolve to absolute path


    // Attach images inline using CID
    const attachments = [
      {
        filename: 'logo.png', // Image filename
        path: logoPath,  // Path to image
        cid: 'logo', // Unique Content-ID for referencing
      },
      {
        filename: 'colored-logo.png', // Image filename
        path: coloredLogoPath,  // Path to image
        cid: 'colored-logo', // Unique Content-ID for referencing
      },
    ];


    const options = {
      from: EMAIL_CONTACT_USER, // Sender email address
      to: email, // Recipient's email
      subject, // Subject
      html: emailHtml, // HTML content
      attachments: attachments,

    };


    // Send the email
    await transporter.sendMail(options);


    // Return success response
    return new Response(JSON.stringify({ message: 'Email sent successfully!' }), {
      status: 200,
    });



  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to send email', error: error.message }),
      { status: 500 }
    );
  }
}
