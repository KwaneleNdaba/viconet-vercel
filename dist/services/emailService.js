"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRegistrationSuccessTemplate = exports.addStaffUserTemplate = exports.addToProjectTemplate = exports.companyRegistrationSuccessTemplate = exports.activateProfile = exports.resetPasswordTemplate = exports.sendMail = void 0;
const sgMail = require('@sendgrid/mail');
require('dotenv').config(); // Load environment variables from .env file
const apiKey = process.env.API_KEY;
sgMail.setApiKey(apiKey);
function sendMail(to, subject, text, html) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const msg = {
                to: to,
                from: 'dev1@webparam.org',
                subject: subject,
                text: text,
                html: html,
            };
            console.log("PPPPP", msg);
            const res = yield sgMail.send(msg);
            console.log("Res", res);
        }
        catch (e) {
            console.log("RESS", e.response.body.errors);
        }
    });
}
exports.sendMail = sendMail;
const resetPasswordTemplate = function (userName, email, otp) {
    return `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        h1 {
            color: #333333;
        }

        p {
            margin-bottom: 20px;
        }

        .link-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 10px 16px;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .link-button:hover {
            background-color: #45a049;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Dear ${userName},</h1>

        <p>We have received a request to reset the password. If you did not initiate this request, please ignore this email.</p>

        <p>To reset your password, please use the following OTP:<strong>${otp}</strong></p>

        <!-- Additional email content here -->

    </div>
</body>

</html>
`;
};
exports.resetPasswordTemplate = resetPasswordTemplate;
const activateProfile = function (username, email, otp) {
    return `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        h1 {
            color: #333333;
        }

        p {
            margin-bottom: 20px;
        }

        .link-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 10px 16px;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
        }

        .link-button:hover {
            background-color: #45a049;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Dear ${username},</h1>

        <p>To activate your viconet profile, please enter the OTP below <a href="https://viconet-dev.netlify.app/auth/otp?email=${email}">here</a>.</p>

        <p>Your OTP is:<strong>${otp}</strong></p>

        <!-- Additional email content here -->

    </div>
</body>

</html>
`;
};
exports.activateProfile = activateProfile;
const companyRegistrationSuccessTemplate = function (username, email, otp, platformURL) {
    return `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }

            h1 {
                color: #333333;
            }

            p {
                margin-bottom: 20px;
            }

            .link-button {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                text-align: center;
                padding: 10px 16px;
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.3s;
            }

            .link-button:hover {
                background-color: #45a049;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h1>Dear ${username},</h1>

            <p>We are thrilled to inform you that your registration on our platform was successful! You can now take advantage of all the features and benefits that our platform offers.</p>

            <p>Your account details are as follows:</p>
            <ul>
                <li>Username: ${email}</li>
                <li>OTP: ${otp}</li>
            </ul>

            <p>To log in to your account, please visit <a href="${platformURL}">${platformURL}</a> and enter your OTP to activate your account.</p>

            <p>If you have any questions or concerns, please do not hesitate to contact our support team.</p>

            <p>Thank you for choosing us. We look forward to serving you!</p>
        </div>
    </body>

    </html>
    `;
};
exports.companyRegistrationSuccessTemplate = companyRegistrationSuccessTemplate;
const addToProjectTemplate = function (username, platformURL) {
    return `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }

            h1 {
                color: #333333;
            }

            p {
                margin-bottom: 20px;
            }

            .link-button {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                text-align: center;
                padding: 10px 16px;
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.3s;
            }

            .link-button:hover {
                background-color: #45a049;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h1>Dear ${username},</h1>

            <p>We are thrilled to inform you that your have been invited to a project.</p>

            <p>You can accept or decline the invitation by viewing your notifications: <a href="${platformURL}"> here</a>.</p>

            <p>If you have any questions or concerns, please do not hesitate to contact our support team.</p>

            <p>Thank you for choosing us. We look forward to serving you!</p>
        </div>
    </body>

    </html>
    `;
};
exports.addToProjectTemplate = addToProjectTemplate;
const addStaffUserTemplate = function (username, organisation, platformURL, otp) {
    return `
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }

            h1 {
                color: #333333;
            }

            p {
                margin-bottom: 20px;
            }

            .link-button {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                text-align: center;
                padding: 10px 16px;
                text-decoration: none;
                border-radius: 4px;
                transition: background-color 0.3s;
            }

            .link-button:hover {
                background-color: #45a049;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h1>Dear ${username},</h1>

            <p>A staff profile for ${organisation} has been created for you.</p>

            <p>Your one time password is: ${otp}. </p> 
            
            <p>You may login <a href="${platformURL}"> here </a></p>

            <p>If you have any questions or concerns, please do not hesitate to contact our support team.</p>

           
        </div>
    </body>

    </html>
    `;
};
exports.addStaffUserTemplate = addStaffUserTemplate;
const customerRegistrationSuccessTemplate = function (username, email, password, platformURL) {
    return `
  <html>
  <head>
      <style>
          body {
              font-family: Arial, sans-serif;
          }

          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
          }

          h1 {
              color: #333333;
          }

          p {
              margin-bottom: 20px;
          }

          .link-button {
              display: inline-block;
              background-color: #4CAF50;
              color: white;
              text-align: center;
              padding: 10px 16px;
              text-decoration: none;
              border-radius: 4px;
              transition: background-color 0.3s;
          }

          .link-button:hover {
              background-color: #45a049;
          }
      </style>
  </head>

  <body>
      <div class="container">
          <h1>Dear ${username},</h1>

          <p>We are thrilled to inform you that your registration on our platform was successful! You can now take advantage of all the features and benefits that our platform offers.</p>

          <p>Your account details are as follows:</p>
          <ul>
              <li>Username: ${email}</li>
              <li>Password: ${password}</li>
          </ul>

          <p>To log in to your account, please visit <a href="${platformURL}">${platformURL}</a> and enter your email and password.</p>

          <p>If you have any questions or concerns, please do not hesitate to contact our support team.</p>

          <p>Thank you for choosing us. We look forward to serving you!</p>
      </div>
  </body>

  </html>
  `;
};
exports.customerRegistrationSuccessTemplate = customerRegistrationSuccessTemplate;
//# sourceMappingURL=emailService.js.map