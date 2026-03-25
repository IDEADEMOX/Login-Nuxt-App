import { prisma } from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
  const users = await prisma.user.findMany();
  // 这里可以添加登录逻辑
  return { success: true, message: "Users list", data: users, code: 200 };
});
