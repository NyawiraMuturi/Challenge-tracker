import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-h-screen bg-[url('/hero.jpg')] bg-cover bg-center overflow-hidden">
      <main className="h-screen relative ">
        <div className="flex justify-end p-4 space-x-4">
          <Button className="">Login </Button>
          <Button>Sign Up</Button>
        </div>
        <header className="flex flex-col items-center  h-full text-white ">
          <h1 className="text-[160px] font-bold">JUHUDI</h1>
        </header>
        <Image
          src="/hero2.png"
          alt="Hero Image"
          width={550}
          height={600}
          className="absolute inset-0 mx-auto "
        />
      </main>
    </div>
  );
}
