import { redirect } from "next/navigation";

export default function UnknownRoutePage() {
  redirect("/coming-soon");
}
