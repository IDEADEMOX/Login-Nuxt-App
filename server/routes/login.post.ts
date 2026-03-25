import { prisma } from "../../lib/prisma";
import { BcryptUtil } from "../../utils/bcrypt.util";

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
  // 这里可以添加登录逻辑
  return { success: true, message: "Login successful", code: 200, data: user };
});
