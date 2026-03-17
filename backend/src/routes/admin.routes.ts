import { GemStatus } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("ADMIN"));

adminRouter.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json(users);
});

adminRouter.put("/gems/:id/approve", async (req, res) => {
  const gem = await prisma.gem.update({
    where: { id: req.params.id },
    data: { status: GemStatus.APPROVED },
  });

  return res.json(gem);
});

adminRouter.put("/gems/:id/reject", async (req, res) => {
  const gem = await prisma.gem.update({
    where: { id: req.params.id },
    data: { status: GemStatus.REJECTED },
  });

  return res.json(gem);
});
