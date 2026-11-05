/** DEMO ONLY: Replace with Supabase queries during implementation phase 2. */
export type DemoEvent={slug:string;title:string;category:string;type:"free"|"paid";price:number;date:string;location:string;quota:number;description:string;};
export const demoEvents:DemoEvent[]=[
 {slug:"kunjungan-kreatif-contoh",title:"Kunjungan & Workshop Kreatif",category:"Kunjungan Sosial",type:"free",price:0,date:"24 November 2026",location:"Bandung",quota:30,description:"Contoh kegiatan interaktif bersama anak-anak panti."},
 {slug:"workshop-melukis-contoh",title:"Melukis Bersama & Kelas Dongeng",category:"Aktivitas Kreatif",type:"paid",price:50000,date:"15 Desember 2026",location:"Bandung",quota:25,description:"Contoh kegiatan workshop kreatif. Informasi belum merupakan event resmi."},
 {slug:"edukasi-kesehatan-contoh",title:"Edukasi Kebersihan dan Kesehatan",category:"Edukasi",type:"free",price:0,date:"10 Januari 2027",location:"Cimahi",quota:20,description:"Contoh kegiatan edukasi untuk anak-anak."}
];
