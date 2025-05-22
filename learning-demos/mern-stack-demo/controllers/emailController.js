import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "techgadgestore@gmail.com",
    pass: "mtcfvggnwrzzpfrd",
  },
});

const mailSending = async (req, res) => {
  const { code, email } = req.body;
  try {
    const info = await transporter.sendMail({
      from: '"MERN DEMO 🍪​" <techgadgestore@gmail.com>',
      to: email,
      subject: "Activate your account - NO REPLY",
      html: `Your OTP code to activate account is: <b>${code}</b>`,
    });
    return res.status(200).json({ success: `Message sent: ${info.messageId}` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default mailSending;
