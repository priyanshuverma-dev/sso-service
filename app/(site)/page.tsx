import Link from "next/link";
import Sites from "./_components/sites";
import { serverAuth } from "@/lib/server-auth";

export default async function Home() {
  const user = await serverAuth();

  if (!user) {
    return (
      <div>
        <p>Loading</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="border-2 border-gray-200 w-[80vw] py-4 px-8 rounded-md shadow-sm">
        <nav className="flex flex-row justify-between w-full">
          <h1 className="text-4xl font-bold text-gray-800">SSO</h1>
          <Link
            className="shadow-md bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 ease-in-out"
            href={"/create"}
          >
            Create
          </Link>
        </nav>
        <div className="flex flex-col space-y-4 mt-8">
          <Sites userId={user.id} />
        </div>
      </div>
    </main>
  );
}
