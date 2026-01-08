import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const password = await hash("password123", 10);
    const password2 = await hash("admin12345", 10);
  await prisma.users.createMany({
    data: [
      { username: "John", email: "jhon@gmail.com", password: password, role: "super_admin" },
      { username: "admin", email: "admin@mail.com", password: password2, role: "admin" }
    ],
    skipDuplicates: true
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
