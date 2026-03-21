import bcrypt from "bcryptjs";
import { GemStatus, UserRole } from "@prisma/client";
import { prisma } from "../src/db/prisma.js";

const sellerEmail = "seller.demo@gemmarket.local";

const sampleGems = [
  {
    title: "Ceylon Royal Blue Sapphire - 2.45ct",
    description:
      "Unheated natural sapphire with vivid royal blue saturation and excellent luster, ideal for a center stone.",
    type: "Sapphire",
    imageUrl:
      "https://images.unsplash.com/photo-1617713964959-d9a36bbc7b52?auto=format&fit=crop&w=1200&q=80",
    weightCarats: 2.45,
    color: "Royal Blue",
    clarity: "VS",
    origin: "Sri Lanka",
    certification: "GIA",
    price: 8200,
  },
  {
    title: "Pigeon Blood Ruby - 1.82ct",
    description:
      "Natural ruby with strong red fluorescence and rich pigeon blood tone, eye-clean and finely cut.",
    type: "Ruby",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    weightCarats: 1.82,
    color: "Vivid Red",
    clarity: "VVS",
    origin: "Mozambique",
    certification: "IGI",
    price: 11250,
  },
  {
    title: "Colombian Emerald - 3.10ct",
    description:
      "Minor-oil emerald featuring bright green body color and balanced transparency with elegant emerald cut.",
    type: "Emerald",
    imageUrl:
      "https://images.unsplash.com/photo-1523170335258-f5c7b9f5a17f?auto=format&fit=crop&w=1200&q=80",
    weightCarats: 3.1,
    color: "Intense Green",
    clarity: "SI",
    origin: "Colombia",
    certification: "Gubelin",
    price: 13800,
  },
  {
    title: "Padparadscha Sapphire - 1.36ct",
    description:
      "Rare lotus-tone sapphire with pink-orange blend and very good brilliance, suitable for bespoke jewelry.",
    type: "Sapphire",
    imageUrl:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80",
    weightCarats: 1.36,
    color: "Padparadscha",
    clarity: "VS",
    origin: "Madagascar",
    certification: "SSEF",
    price: 9650,
  },
  {
    title: "Paraiba Tourmaline - 1.04ct",
    description:
      "Neon blue-green copper-bearing tourmaline with strong glow and premium saturation in a precision oval cut.",
    type: "Tourmaline",
    imageUrl:
      "https://images.unsplash.com/photo-1566793474285-2decf0fc1821?auto=format&fit=crop&w=1200&q=80",
    weightCarats: 1.04,
    color: "Neon Blue-Green",
    clarity: "VVS",
    origin: "Brazil",
    certification: "AGL",
    price: 15400,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("SellerDemo@123", 10);

  const seller = await prisma.user.upsert({
    where: { email: sellerEmail },
    update: { name: "Demo Seller", passwordHash, role: UserRole.USER },
    create: {
      name: "Demo Seller",
      email: sellerEmail,
      passwordHash,
      role: UserRole.USER,
    },
  });

  let createdCount = 0;

  for (const gem of sampleGems) {
    const existing = await prisma.gem.findFirst({
      where: {
        sellerId: seller.id,
        title: gem.title,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.gem.update({
        where: { id: existing.id },
        data: {
          imageUrl: gem.imageUrl,
          description: gem.description,
          status: GemStatus.APPROVED,
        },
      });
      continue;
    }

    await prisma.gem.create({
      data: {
        sellerId: seller.id,
        title: gem.title,
        description: gem.description,
        imageUrl: gem.imageUrl,
        type: gem.type,
        weightCarats: gem.weightCarats,
        color: gem.color,
        clarity: gem.clarity,
        origin: gem.origin,
        certification: gem.certification,
        price: gem.price,
        status: GemStatus.APPROVED,
      },
    });

    createdCount += 1;
  }

  const approvedCount = await prisma.gem.count({ where: { status: GemStatus.APPROVED } });

  console.log(
    JSON.stringify(
      {
        sellerEmail,
        createdCount,
        totalApprovedGems: approvedCount,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
