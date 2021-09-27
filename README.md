## Description
This email service allows user to send email using Gmail as an email provider. This API requires basic authentication where the username and password will be the user's email credentials.

## Prerequisites
1. Gmail account - turn on "Less secure app access" in the account security section.
2. Machine installed with Node.js and NPM

### Steps to run
1. Checkout source code.
2. Open a Terminal.
3. Install all dependencies using "npm install" command.
4. Build the project using "npm run build" command.
5. Run the project using "npm run start" command.

### Swagger API documentation
Go to http://localhost:3000/api/docs.

### Things to improve
- Improve authorization such as using OAuth.
- Extend email service to include other email features such as bcc, cc, etc.
- Extend email service to be processed using Google Task Queue (or other equivalent tools by other providers) so that email can be queued for processing. This will ensure that the quicker response from the endpoint and also able to leverage the features of Task Queue such as configurable concurrent rate limit, max retries and etc.
- Email address validation for request "sender" and "recepient".
- Support other email provider such as O365 calendar.
- Implement a proper logging.
