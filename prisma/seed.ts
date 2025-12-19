import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prismaClient = new PrismaClient();

async function main() {
  // Admin
  const admin = await prismaClient.user.upsert({
    where: { email: "dueno@barberagenda.com" },
    update: {},
    create: {
      name: "Owner",
      email: "dueno@barberagenda.com",
      passwordHash: await bcrypt.hash("Admin123!", 10),
      role: "ADMIN",
      isActive: true,
    },
  });

  // Barbers
  const barbers = await Promise.all([
    prismaClient.user.upsert({
      where: { email: "pedro@barberagenda.com" },
      update: {},
      create: {
        name: "Pedro",
        email: "pedro@barberagenda.com",
        passwordHash: await bcrypt.hash("Barber123!", 10),
        role: "BARBER",
        isActive: true,
      },
    }),
    prismaClient.user.upsert({
      where: { email: "luis@barberagenda.com" },
      update: {},
      create: {
        name: "Luis",
        email: "luis@barberagenda.com",
        passwordHash: await bcrypt.hash("Barber123!", 10),
        role: "BARBER",
        isActive: true,
      },
    }),
  ]);

  // Services
  const services = await Promise.all([
    prismaClient.service.upsert({
      where: { name: "Haircut" },
      update: {},
      create: { name: "Haircut", price: 2000, durationMin: 30, isActive: true },
    }),
    prismaClient.service.upsert({
      where: { name: "Fade" },
      update: {},
      create: { name: "Fade", price: 3000, durationMin: 45, isActive: true },
    }),
    prismaClient.service.upsert({
      where: { name: "Beard" },
      update: {},
      create: { name: "Beard", price: 1500, durationMin: 20, isActive: true },
    }),
  ]);

  // Schedule: Sun closed, Mon-Sat 09:00-18:00
  for (const barber of [admin, ...barbers]) {
    for (let day = 0; day < 7; day++) {
      await prismaClient.barberWeeklySchedule.upsert({
        where: { barberId_dayOfWeek: { barberId: barber.id, dayOfWeek: day } },
        update: {},
        create: {
          barberId: barber.id,
          dayOfWeek: day,
          startTime: day === 0 ? "" : "09:00",
          endTime: day === 0 ? "" : "18:00",
          isClosed: day === 0,
        },
      });
      // Break: Mon-Sat 12:00-13:00
      if (day > 0) {
        await prismaClient.barberWeeklyBreak.upsert({
          where: { barberId_dayOfWeek: { barberId: barber.id, dayOfWeek: day } },
          update: {},
          create: {
            barberId: barber.id,
            dayOfWeek: day,
            startTime: "12:00",
            endTime: "13:00",
            label: "Lunch Break",
          },
        });
      }
    }
  }
}

main()
  .then(() => prismaClient.$disconnect())
  .catch((e) => {
    console.error(e);
    prismaClient.$disconnect();
    process.exit(1);
  });
