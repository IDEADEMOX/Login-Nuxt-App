import { prisma } from "../../lib/prisma";

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
  // 清除刷新令牌
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      refreshToken: "",
      refreshTokenExpires: new Date(Date.now() - 1),
    },
  });
  // 清除访问令牌
  deleteCookie(event, "accessToken");
  // 清除刷新令牌
  deleteCookie(event, "refreshToken");
});
