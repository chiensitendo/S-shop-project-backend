const nodemailer = require("nodemailer");

async function sendMail(name, email){
    let transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false, // true for 465, false for other ports
        service: "Gmail",
        auth: {
          user: process.env.SEND_EMAIL, // generated ethereal user
          pass: process.env.SEND_EMAIL_PASSWORD, // generated ethereal password
        },
      });
      let info = await transporter.sendMail({
        from: `"SoCheap Application " <${email}>`, // sender address
        to: email, // list of receivers
        subject: "[SoCheap] Xin chào bạn!", // Subject line
        // text: "Hello world?", // plain text body
        html: `<div>
                <p>Xin chào: <b>${name}</b></p>
                <p>Chào mừng bạn đã đến với <b>SoCheap</b>. <br/>
                    Cảm ơn bạn đã đăng ký nhận bản tin của ứng dụng chúng tôi.
                    <br/>Những thông tin mới nhất cũng như những khuyến mãi hấp dẫn sẽ được thông báo cho bạn ngay tức khắc.</p>
                <p>Chúng tôi rất hân hạnh được phục vụ bạn.</p>
                <p>Truy cập website: <a href = "https://so-cheap.vercel.app">https://so-cheap.vercel.app</a>/<p>
                <img src = "https://drive.google.com/thumbnail?id=14MOdn0bAnzsa5XwEkitkkVaM8ZyfqzOP"/>
        </div>`, // html body
      });
      console.log("Message sent: %s", info.messageId);
}


module.exports = {
    sendMail: sendMail
};