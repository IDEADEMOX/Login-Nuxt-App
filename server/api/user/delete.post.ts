import { prisma } from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;
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
  // 删除用户
  await prisma.user.delete({
    where: {
      id,
    },
  });
  return { success: true, message: "User deleted", code: 200 };
});
