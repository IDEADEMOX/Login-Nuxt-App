import { prisma } from "../../lib/prisma";
import { BcryptUtil } from "../../utils/bcrypt.util";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { confirmPassword, ...restBody } = body;
  // 保存用户到数据库
  await prisma.user.create({
    data: {
      ...restBody,
      password: await BcryptUtil.encrypt(restBody.password),
    },
  });
  // 这里可以添加注册逻辑
  return { success: true, message: "Register successful", code: 200 };
});
