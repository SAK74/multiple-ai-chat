import { prisma } from "@/src/lib/prisma";
import type { User, Chat } from "@prisma/client";

export default async function Page() {
  console.log("env: ", process.env.DATABASE_URL);

  const users = await prisma.user.findMany({
    include: { accounts: true, chats: true },
  });
  console.log({ users });

  return (
    <main>
      <table className="mx-auto my-8">
        {users.length && (
          <thead>
            <tr className="">
              {Object.keys(users[0]).map((key) => (
                <th key={key} className="p-4">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {Object.values(user).map((value, i) => (
                <td key={i}>
                  {value instanceof Date
                    ? value.toDateString()
                    : Array.isArray(value)
                    ? "Array[]"
                    : value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
