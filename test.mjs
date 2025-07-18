import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

try {
  await client.$connect();
  console.log('Connected successfully!!!');
  const users =await  client.user.findMany()

  console.log({users});


  

  
  const user = await client.user.findUnique({
    where: { id: "c4e53575-9a4b-4208-8b3a-101871bb6f9f" },
    // include: { profile: true },
  });

  console.log({ user });
} catch (error) {
  console.error('Error:', error);
} finally {
  await client.$disconnect();
  
}