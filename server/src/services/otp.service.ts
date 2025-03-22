import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { _otp, _user } from "src/models";
import bcrypt from "bcrypt";
import otpGenerate from "otp-generator";
import nodemailer from "nodemailer";
export const createOtpService = async (email: string, otp: string) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashOtp = bcrypt.hashSync(otp, salt);
    const OTP = await _otp.create({ email, otp: hashOtp });
    return OTP ? 1 : 0;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const verifyOtpService = async (email: string, otp: string) => {
  try {
    const OTP = await _otp.find({ email });
    if (!OTP.length) {
      return {
        status: StatusCodes.NOT_FOUND,
        message: "Mã xác nhận đã hết hạn",
        element: false,
      };
    }
    const lastOtp = OTP[OTP.length - 1];
    const isMatch = bcrypt.compareSync(otp, lastOtp.otp);
    return {
      status: isMatch ? StatusCodes.OK : StatusCodes.BAD_REQUEST,
      message: isMatch ? "Mã xác nhận hợp lệ" : "Mã xác nhận không hợp lệ",
      element: isMatch,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const deleteOtpService = async (email: string) => {
  try {
    const OTP = await _otp.deleteMany({ email });
    return OTP ? 1 : 0;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const sendToEmail = async (
  email: string,
  title: string,
  html: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: title,
      html: html,
    });
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const sendOtpService = async (email: string) => {
  try {
    const isEmail = await _user.findOne({ email });
    if (!isEmail) {
      return {
        status: StatusCodes.BAD_REQUEST,
        message: "Email đã đăng ký tài khoản",
      };
    }
    const otp = otpGenerate.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const title = "goiytangqua - Mã xác nhận";
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>goiytangqua - Mã xác nhận đăng ký tài khoản</title>
</head>
<body style="font-family: Arial, sans-serif;">
    <h2>goiytangqua - Mã xác nhận đăng ký tài khoản</h2>
    <p>Mã xác nhận để xác minh email của bạn và hoàn tất quy trình đăng ký tài khoản</p>

    <p>Mã xác nhận: <strong style="font-size: 18px; background-color: #f0f0f0; padding: 5px;">${otp}</strong></p>

    <p>Mã xác nhận này có hiệu lực 1 phút kể từ thời điểm email này được gửi. Vui lòng không chia sẻ nó cho bất kỳ ai.</p>

    <p>Nếu bạn không yêu cầu đăng ký tài khoản này hoặc bạn không thực hiện hành động này, vui lòng bỏ qua email này.</p>

    <p>INếu bạn gặp bất kỳ vấn đề hoặc cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email tại <a href="mailto:goiytangqua@example.com">goiytangqua@example.com</a>.</p>

    <p>Cảm ơn.</p>

    <p>Trân trọng,</p>
    <p><strong>Nhóm hỗ trợ của chúng tôi tại goiytangqua</strong></p>

</body>
</html>
`;
    await sendToEmail(email, title, html);
    await createOtpService(email, otp);
    return {
      status: StatusCodes.OK,
      message: "Vui lòng kiểm tra email để nhận mã xác nhận",
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
