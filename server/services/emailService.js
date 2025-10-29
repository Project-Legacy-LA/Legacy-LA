require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });;

const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env;

  console.log(`host: ${SMTP_HOST}, port:${SMTP_PORT}, password:${SMTP_PASS}`)
  const port = SMTP_PORT ? Number(SMTP_PORT) : 587;
  const secure = typeof SMTP_SECURE !== 'undefined'
    ? SMTP_SECURE === 'true' || SMTP_SECURE === '1'
    : port === 465;

  const transportOptions = {
    host: SMTP_HOST,
    port,
    secure,
  };

  if (SMTP_USER && SMTP_PASS) {
    transportOptions.auth = {
      user: SMTP_USER,
      pass: SMTP_PASS,
    };
  }

  transporter = nodemailer.createTransport(transportOptions);
  return transporter;
}

async function sendMail({ to, subject, text, html, replyTo }) {
  if (!to) {
    throw new Error('Email "to" address is required');
  }
  if (!subject) {
    throw new Error('Email subject is required');
  }

  const transport = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  if (!from) {
    throw new Error('EMAIL_FROM or SMTP_USER must be configured to send mail');
  }

  return transport.sendMail({
    from,
    to,
    subject,
    text,
    html,
    replyTo,
  });
}

module.exports = {
  sendMail,
};
