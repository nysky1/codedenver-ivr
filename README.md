<a href='https://www.codedenver.com'>Denver App Developers</a> IVR System
<br/><br/>
This is an interactive voice response system, also known as a phone tree application.  The application uses Twilio's API to handle communication between the caller and the application.  Twilio is a low-cost alternative to many of the other providers and rates can be as low as one 1c per minute.  Technologies used on the platform include:<br/>
<ul>
<li>Node.js</li>
<li>JavaScript</li>
<li>Twilio</li>
<li>Jest,Mocha</li>
<li>ngrok</li>
</ul>
<h3>Environment Setup</h3>
Environment variables needs to be set up to protect your AWS keys. Create a file in the root folder which looks like this below and from a terminal window, type source FILE_NAME:<br/>
export SES_KEY='YOUR_AWS_KEY'<br/>
export SES_SECRET='YOUR_AWS_SECRET'<br/>
export ERROR_EMAIL_ADDR='bob@gmail.com'
<br/><br/>
Make sure you add your keys to Travis and your production app.
<br/><br/>
Use <a href="https://ngrok.com">ngrok</a> to obtain a public URL to your dev box for testing.  Add that URL to your Twilio phone number (use 1 phone number for dev and 1 phone number for production).