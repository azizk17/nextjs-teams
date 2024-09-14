export function sendEmail({ to, subject, template }: { to: string, subject: string, template: React.ReactNode }) {
    const from = "aa@aaa.co"

    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Template: ${template}`);
}