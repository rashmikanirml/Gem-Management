import { OrderStatus, Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const ordersRouter = Router();

const createOrderSchema = z.object({
  gemIds: z.array(z.string().min(1)).min(1),
});

ordersRouter.post("/", requireAuth, requireRole("USER", "ADMIN"), async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const gems = await prisma.gem.findMany({
    where: {
      id: { in: parsed.data.gemIds },
      status: "APPROVED",
    },
  });

  if (!gems.length) {
    return res.status(400).json({ error: "No purchasable gems found" });
  }

  const total = gems.reduce((sum, g) => sum + Number(g.price), 0);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        buyerId: req.user!.sub,
        totalAmount: new Prisma.Decimal(total),
        status: OrderStatus.PAID,
        items: {
          create: gems.map((g) => ({
            gemId: g.id,
            price: g.price,
          })),
        },
      },
      include: { items: true },
    });

    await tx.gem.updateMany({
      where: { id: { in: gems.map((g) => g.id) } },
      data: { status: "SOLD" },
    });

    return created;
  });

  return res.status(201).json(order);
});

ordersRouter.get("/", requireAuth, requireRole("USER", "ADMIN"), async (req, res) => {
  const where = req.user!.role === "ADMIN" ? {} : { buyerId: req.user!.sub };

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return res.json(orders);
});
