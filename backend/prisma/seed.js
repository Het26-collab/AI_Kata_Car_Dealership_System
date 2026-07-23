import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo1234", 10);

  await prisma.user.createMany({
    data: [
      {
        email: "manager@globalmotors.com",
        passwordHash,
        role: "user",
      },
      {
        email: "admin@globalmotors.com",
        passwordHash,
        role: "admin",
      },
    ],
  });

  await prisma.vehicle.createMany({
    data: [
      {
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        price: 29000,
        quantity: 4,
      },
      {
        make: "Honda",
        model: "CR-V",
        category: "SUV",
        price: 34000,
        quantity: 3,
      },
      {
        make: "Ford",
        model: "F-150",
        category: "Truck",
        price: 48000,
        quantity: 2,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
