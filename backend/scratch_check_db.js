const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking User model...");
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);
    
    console.log("Checking Student model...");
    const studentCount = await prisma.student.count();
    console.log("Student count:", studentCount);
    
    console.log("DB Connection OK");
  } catch (e) {
    console.error("DB Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
