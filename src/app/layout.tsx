import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
const montserrat=Montserrat({subsets:["latin"],variable:"--font-montserrat",display:"swap"});
const poppins=Poppins({subsets:["latin"],weight:["400","500","600","700"],variable:"--font-poppins",display:"swap"});
export const metadata:Metadata={title:{default:"Berbagi Kebahagiaan",template:"%s | Berbagi Kebahagiaan"},description:"Menciptakan makna melalui tawa — komunitas sosial Bandung."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body className={`${montserrat.variable} ${poppins.variable} antialiased`}>{children}</body></html>}
