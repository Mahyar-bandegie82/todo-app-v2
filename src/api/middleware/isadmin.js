import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function isAdmin(req, res, next) {
    const user = req.user;
    if (!user) return res.sendStatus('404').json({ massage: "user ID not found" });
    const userInfo = await prisma.user.findUnique({
        where: { id: user }
    });
    if (!userInfo.is_admin) return res.sendStatus(404).json({massage : "this is a protected route admin users only"})
    next()
}