import { GemStatus, Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

export const gemsRouter = Router();

const createGemSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  imageUrl: z.string().url().optional(),
  type: z.string().min(2),
  weightCarats: z.number().positive(),
  color: z.string().min(2),
  clarity: z.string().min(2),
  origin: z.string().min(2),
  certification: z.string().optional(),
  price: z.number().positive(),
});

gemsRouter.get("/", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  const where = q
    ? {
        status: GemStatus.APPROVED,
        OR: [
          { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { type: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { origin: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : { status: GemStatus.APPROVED };

  const gems = await prisma.gem.findMany({ where, orderBy: { createdAt: "desc" } });
  return res.json(gems);
});

gemsRouter.get("/mine", requireAuth, requireRole("USER", "ADMIN"), async (req, res) => {
  const gems = await prisma.gem.findMany({
    where: { sellerId: req.user!.sub },
    orderBy: { createdAt: "desc" },
  });

  return res.json(gems);
});

gemsRouter.post("/", requireAuth, requireRole("USER", "ADMIN"), async (req, res) => {
  const parsed = createGemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const data = parsed.data;
  const gem = await prisma.gem.create({
    data: {
      sellerId: req.user!.sub,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      type: data.type,
      weightCarats: data.weightCarats,
      color: data.color,
      clarity: data.clarity,
      origin: data.origin,
      certification: data.certification,
      price: data.price,
      status: GemStatus.PENDING,
    },
  });

  return res.status(201).json(gem);
});

gemsRouter.put("/:id", requireAuth, requireRole("USER", "ADMIN"), async (req, res) => {
  const parsed = createGemSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const gem = await prisma.gem.findUnique({ where: { id: req.params.id } });
  if (!gem) {
    return res.status(404).json({ error: "Gem not found" });
  }

  if (gem.sellerId !== req.user!.sub && req.user!.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const updated = await prisma.gem.update({
    where: { id: req.params.id },
    data: parsed.data,
  });

  return res.json(updated);
});

gemsRouter.delete("/:id", requireAuth, requireRole("USER", "ADMIN"), async (req, res) => {
  const gem = await prisma.gem.findUnique({ where: { id: req.params.id } });
  if (!gem) {
    return res.status(404).json({ error: "Gem not found" });
  }

  if (gem.sellerId !== req.user!.sub && req.user!.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }

  await prisma.gem.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
