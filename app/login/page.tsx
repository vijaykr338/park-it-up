import { LoginForm } from "@/components/login-form";
// import Image from "next/image";
// import Parkitup_logo from "@/components/assets/Parkitup_logo.png";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-[#141a24] flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <Link href='/' className="text-blue-500 hover:underline text-sm">
        ← Back to Home
      </Link>
      <div className="w-[28rem] max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
