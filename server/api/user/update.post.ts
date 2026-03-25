import { prisma } from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, ...rest } = body;
  // 检查用户是否存在
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!user) {
    return { success: false, message: "User not found" };
  }
  // 这里可以添加登录逻辑
  // 更新用户密码
  await prisma.user.update({
    where: {
      id,
    },
    data: rest,
  });
  return { success: true, message: "User updated", code: 200 };
});
