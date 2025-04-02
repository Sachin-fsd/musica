import { redirect } from "next/navigation";

export default function Home() {
  redirect("/browse")
  
  return (
    <div>
      <h1>Work under Progress...🥺</h1>
    </div>
  )
}
