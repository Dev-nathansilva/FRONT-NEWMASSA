import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import MainLayout from "@/components/Layout/main";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/home`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = res.data.user;

    return <MainLayout user={user} permissions={user.permissions} />;
  } catch (error) {
    redirect("/login");
  }
}
