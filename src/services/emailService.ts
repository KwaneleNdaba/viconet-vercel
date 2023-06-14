const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")

export async function sendMail(to:string, subject:string, text:string, html:string) {
    
const msg = {
  to: to, // Change to your recipient
  from: 'dev1@webparam.org',
  subject: subject,
  text: text,
  html:html,
};

const res = await sgMail.send(msg);
console.log("res", res)
}