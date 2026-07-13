import { redirect } from "next/navigation";

export default function Home() {
  redirect(process.env.ROOT_REDIRECT === "dashboard" ? "/dashboard" : "/signup");
}
