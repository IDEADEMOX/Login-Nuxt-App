import { prisma } from "../../lib/prisma";
import { BcryptUtil } from "../../utils/bcrypt.util";
import { encrypt } from "../../utils/jwt.util";
import { setCookie } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;
  // 检查用户是否存在
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  // 验证密码
  const isPasswordValid = await BcryptUtil.verify(password, user.password);
  if (!isPasswordValid) {
    return { success: false, message: "Invalid password" };
  }
  // 生成访问令牌
  const accessToken = await encrypt({ userId: user.id }, "15m");
  setCookie(event, "accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  // 生成刷新令牌
  const refreshToken = await encrypt({ userId: user.id }, "7d");
  setCookie(event, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  // 存储刷新令牌到数据库
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken,
      refreshTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // 这里可以添加登录逻辑
  return { success: true, message: "Login successful", code: 200, data: user };
});
