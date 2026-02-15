const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send email function
const sendEmail = async (options) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"CS Jargon Platform" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return info;
};

// Email Templates
const emailTemplates = {
    // Email Verification Template
    verificationEmail: (name, verificationUrl) => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                    padding: 30px;
                    text-align: center;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #fff;
                    margin-bottom: 20px;
                }
                .content {
                    background: #fff;
                    border-radius: 8px;
                    padding: 30px;
                    margin-top: 20px;
                }
                .button {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #fff !important;
                    text-decoration: none;
                    padding: 15px 40px;
                    border-radius: 30px;
                    font-weight: bold;
                    margin: 20px 0;
                    font-size: 16px;
                }
                .button:hover {
                    opacity: 0.9;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                }
                .warning {
                    background: #fff3cd;
                    border: 1px solid #ffc107;
                    border-radius: 5px;
                    padding: 10px;
                    margin-top: 20px;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">🖥️ CS Jargon Platform</div>
                <div class="content">
                    <h2>Welcome, ${name}! 🎉</h2>
                    <p>Thank you for registering with CS Jargon Platform. You're one step away from starting your journey to master Computer Science terminology!</p>
                    <p>Please verify your email address by clicking the button below:</p>
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; font-size: 14px; color: #667eea;">${verificationUrl}</p>
                    <div class="warning">
                        ⚠️ This link will expire in 24 hours. If you didn't create an account, please ignore this email.
                    </div>
                </div>
                <div class="footer">
                    <p>© 2024 CS Jargon Platform - PAF-IAST</p>
                    <p>This is an automated message. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    },

    // Password Reset Template
    passwordResetEmail: (name, resetUrl) => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    border-radius: 10px;
                    padding: 30px;
                    text-align: center;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #fff;
                    margin-bottom: 20px;
                }
                .content {
                    background: #fff;
                    border-radius: 8px;
                    padding: 30px;
                    margin-top: 20px;
                }
                .button {
                    display: inline-block;
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: #fff !important;
                    text-decoration: none;
                    padding: 15px 40px;
                    border-radius: 30px;
                    font-weight: bold;
                    margin: 20px 0;
                    font-size: 16px;
                }
                .warning {
                    background: #f8d7da;
                    border: 1px solid #f5c6cb;
                    border-radius: 5px;
                    padding: 10px;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #721c24;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">🔐 Password Reset</div>
                <div class="content">
                    <h2>Hello, ${name}</h2>
                    <p>We received a request to reset your password for your CS Jargon Platform account.</p>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetUrl}" class="button">Reset Password</a>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; font-size: 14px; color: #f5576c;">${resetUrl}</p>
                    <div class="warning">
                        ⚠️ This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                    </div>
                </div>
                <div class="footer">
                    <p>© 2024 CS Jargon Platform - PAF-IAST</p>
                    <p>This is an automated message. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    },

    // Welcome Email After Verification
    welcomeEmail: (name) => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to CS Jargon Platform</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                    border-radius: 10px;
                    padding: 30px;
                    text-align: center;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    color: #fff;
                    margin-bottom: 20px;
                }
                .content {
                    background: #fff;
                    border-radius: 8px;
                    padding: 30px;
                    margin-top: 20px;
                }
                .features {
                    text-align: left;
                    margin: 20px 0;
                }
                .feature {
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }
                .feature:last-child {
                    border-bottom: none;
                }
                .button {
                    display: inline-block;
                    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                    color: #fff !important;
                    text-decoration: none;
                    padding: 15px 40px;
                    border-radius: 30px;
                    font-weight: bold;
                    margin: 20px 0;
                    font-size: 16px;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">🎓 Welcome Aboard!</div>
                <div class="content">
                    <h2>Congratulations, ${name}! 🎉</h2>
                    <p>Your email has been verified successfully. Welcome to the CS Jargon Platform!</p>
                    
                    <div class="features">
                        <h3>What's Next?</h3>
                        <div class="feature">📝 <strong>Complete Your Profile</strong> - Tell us about your learning preferences</div>
                        <div class="feature">📊 <strong>Take Placement Test</strong> - Get placed in the right level</div>
                        <div class="feature">📚 <strong>Start Learning</strong> - Begin your jargon mastery journey</div>
                        <div class="feature">🏆 <strong>Earn Badges</strong> - Complete challenges and earn rewards</div>
                    </div>
                    
                    <a href="${process.env.FRONTEND_URL}/introduction" class="button">Complete Your Profile</a>
                </div>
                <div class="footer">
                    <p>© 2024 CS Jargon Platform - PAF-IAST</p>
                </div>
            </div>
        </body>
        </html>
        `;
    },

    // Password Changed Confirmation
    passwordChangedEmail: (name) => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Changed</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .container {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                    padding: 30px;
                    text-align: center;
                }
                .content {
                    background: #fff;
                    border-radius: 8px;
                    padding: 30px;
                    margin-top: 20px;
                }
                .success-icon {
                    font-size: 60px;
                    margin-bottom: 20px;
                }
                .warning {
                    background: #fff3cd;
                    border: 1px solid #ffc107;
                    border-radius: 5px;
                    padding: 15px;
                    margin-top: 20px;
                    text-align: left;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="content">
                    <div class="success-icon">✅</div>
                    <h2>Password Changed Successfully</h2>
                    <p>Hello ${name},</p>
                    <p>Your password has been changed successfully on ${new Date().toLocaleDateString()}.</p>
                    <div class="warning">
                        <strong>⚠️ Wasn't you?</strong>
                        <p>If you didn't change your password, please contact our support immediately and secure your account.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
    }
};

// Export functions
module.exports = {
    sendEmail,
    emailTemplates
};