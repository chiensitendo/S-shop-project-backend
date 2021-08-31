const nodemailer = require("nodemailer");
const { FRONT_END_URL, SEND_EMAIL, SEND_EMAIL_PASSWORD } = require("../libs/const");

async function sendMail(name, email){
    let transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false, // true for 465, false for other ports
        service: "Gmail",
        auth: {
          user: SEND_EMAIL, // generated ethereal user
          pass: SEND_EMAIL_PASSWORD, // generated ethereal password
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

async function sendMailToMe(name, email){
  let transporter = nodemailer.createTransport({
      // host: "smtp.ethereal.email",
      // port: 587,
      // secure: false, // true for 465, false for other ports
      service: "Gmail",
      auth: {
        user: SEND_EMAIL, // generated ethereal user
        pass: SEND_EMAIL_PASSWORD, // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
      from: `"SoCheap Application " <s.socheap247@gmail.com>`, // sender address
      to: "s.socheap247@gmail.com", // list of receivers
      subject: `[Subscribe] ${name} đã subscribe!`, // Subject line
      // text: "Hello world?", // plain text body
      html: `<div>
              <p>Bạn <b>${name}</b> vừa mới subscribe!</p>
              <p>Tên(name): ${name}</p>
              <p>Email(email): ${email}</p>
              <p>Truy cập website: <a href = "https://so-cheap.vercel.app">https://so-cheap.vercel.app</a>/<p>
              <img src = "https://drive.google.com/thumbnail?id=14MOdn0bAnzsa5XwEkitkkVaM8ZyfqzOP"/>
              </div>`, // html body
    });
    console.log("Message sent: %s", info.messageId);
}

async function sendVerifyMail(name, email, id, verifyToken){
  let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: SEND_EMAIL, // generated ethereal user
        pass: SEND_EMAIL_PASSWORD, // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
      from: `"SoCheap Application " <${email}>`, 
      to: email, 
      subject: "[SoCheap] Xác thực email của bạn!",
      html: `<div>
                <p>Xin chào: <b>${name}</b></p>
                <p>Chào mừng bạn đã đến với <b>SoCheap</b>. <br/>
                    Cảm ơn bạn đã đăng ký ứng dụng chúng tôi.</p>
                <p>Để hoàn tất việc đăng ký, vui lòng xác nhận bằng cách nhấn vào liên kết bên dưới: (Lưu ý mã này sẽ có hiệu lực trong 30 ngày)<p>
                <a href = "${FRONT_END_URL}/auth/verify?id=${id}&verifyToken=${verifyToken}"><p>${FRONT_END_URL}/auth/verify?id=${id}&verifyToken=${verifyToken}</p></a>
                <img src = "https://drive.google.com/thumbnail?id=14MOdn0bAnzsa5XwEkitkkVaM8ZyfqzOP"/>
            </div>`, // html body
    });
    console.log("Verified message sent: %s", info.messageId);
}

async function sendWelcomeMail(name, email){
  let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: SEND_EMAIL, // generated ethereal user
        pass: SEND_EMAIL_PASSWORD, // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
      from: `"SoCheap Application " <${email}>`, 
      to: email, 
      subject: "[SoCheap] Chào mừng bạn đến với SoCheap!",
      html: `<div>
                  <p>Xin chào: <b>${name}</b></p>
                  <p>Chào mừng bạn đã đến với <b>SoCheap</b>. <br/>
                      Cảm ơn bạn đã đăng ký ứng dụng chúng tôi.</p>
                  <p>SoCheap là một trang thương mại điện tử - nơi có những mặt hàng hấp dẫn để bạn lựa chọn,
                  những mặt hàng này đã được kiểm soát chất lượng một cách chặt chẽ từ các của hàng với sự nhiệt huyết, cẩn thận và tỉ mỉ. Ngoài ra, SoCheap còn mang đến cho người dùng một trải nghiệm mới lạ với những tính năng của riêng biệt, hấp dẫn.
                  </p>
                  <p><b>Hi vọng bạn sẽ hài lòng với SoCheap!</b></p>
                  <div style = "display:flex;justify-content: center;align-items:center">
                        <a href = "${FRONT_END_URL}" style = "text-decoration: none;color:#fff"><div style = "background-color:#EA5B2A;width:fit-content;text-align: center;padding: 15px 40px;">Trang Chủ</div></a>
                  </div>
                  <br/>
                  <p style = "font-style: italic;">- Mọi thắc mắc vui lòng liên hệ qua email: <a href = "mailto:sang9c.nguyendu@gmail.com">sang9c.nguyendu@gmail.com</a> . Chúc tôi sẵn sàng phục vụ bạn.</p>
                  <br/>
                  <p>Cảm ơn bạn,</p>
                  <p style = "text-decoration: underline;font-style: italic;font-weight:bold;color:#EA5B2A">SoCheap Team</p>
                  <img src = "https://drive.google.com/thumbnail?id=14MOdn0bAnzsa5XwEkitkkVaM8ZyfqzOP"/>
            </div>`, // html body
    });
    console.log("Welcome Message sent: %s", info.messageId);
}



module.exports = {
    sendMail: sendMail,
    sendMailToMe: sendMailToMe,
    sendVerifyMail: sendVerifyMail,
    sendWelcomeMail: sendWelcomeMail
};