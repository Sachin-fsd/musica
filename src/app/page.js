import InstallPrompt from "@/components/helperFunctions/installPrompt";
import { redirect } from "next/navigation";

export default function Home() {
  // <InstallPrompt />
  redirect("/browse")
  
  return null;
}
