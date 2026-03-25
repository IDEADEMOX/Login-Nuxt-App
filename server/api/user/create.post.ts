import { prisma } from "~~/lib/prisma";
import { BcryptUtil } from "~~/utils/bcrypt.util";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, ...rest } = body;
  // 检查用户是否存在
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    return { success: false, message: "User already exists" };
  }
  // 创建用户
  await prisma.user.create({
    data: {
      ...rest,
      email,
      password: await BcryptUtil.encrypt(rest.password),
    },
  });
  // 登录用户
  return { success: true, message: "User created", code: 200, data: user };
});
