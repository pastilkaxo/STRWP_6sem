const sendmail = require("sendmail")({ silent: true });

sendmail({
  from: "vlad.lemeshok@gmail.com",
  to: "vlad.lemeshok@gmail.com",
  subject: "test",
  text: "Hello world!",
});
