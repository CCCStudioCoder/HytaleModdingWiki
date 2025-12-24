import { Geist } from "next/font/google";
import "./global.css";
import "./transitions.css";

const geist = Geist({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={geist.className}>{children}</div>;
}
