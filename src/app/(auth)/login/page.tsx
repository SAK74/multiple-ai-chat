import { login } from "@/src/actions/login";

export default async function Page() {
  return (
    <main>
      <form action={login}>
        <input type="text" placeholder="E-mail" name="email" />
        {/* <input type="text" placeholder="password" />a */}
      </form>
    </main>
  );
}
