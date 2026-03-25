import { prisma } from "~~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = await prisma.user.findUnique({
    where: {
      id: body.id,
    },
  });
  return { success: true, message: "Profile retrieved", code: 200, data: user };
});
