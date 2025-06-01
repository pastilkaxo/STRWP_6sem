const nodemailer = require("nodemailer");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
const reciever = "vlad.lemeshok@gmail.com";

let send = (str) => {
  const mailer = nodemailer.createTransport({
    service: config.smtp.service,
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.auth.user,
      pass: config.smtp.auth.pass,
    },
  });

  mailer.sendMail(
    {
      from: config.smtp.auth.user,
      to: reciever,
      subject: str,
      text: str,
    },
    (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(info.response);
    }
  );
};

module.exports = send;
