# Berbagi Kebahagiaan — Development Starter (Tahap 1)

**Status: UI starter + rancangan database, bukan aplikasi production yang sudah menerima pendaftaran/pembayaran.**

## Requirements
- Node.js >=20.9 (gunakan Node LTS)
- npm
- Supabase project (untuk tahap backend berikutnya)

## Jalankan
```bash
npm install
cp .env.example .env.local
npm run dev
```
Buka http://localhost:3000. Jika belum punya Supabase, biarkan variabel contoh sampai tahap koneksi; halaman demo tidak memanggil Supabase.

## Apa yang sudah bekerja
- Next.js App Router + TypeScript + Tailwind v4
- Brand colors dan font Montserrat/Poppins
- Landing, Tentang, Daftar/Detail Event demo, Galeri, Kontak, Status dan tampilan Login Admin
- Struktur dasar client/server Supabase
- SQL rancangan database, RPC reservasi, dan expired quota

## Belum aktif (sengaja dinonaktifkan demi keamanan)
- Pendaftaran peserta + unggah bukti, hingga service backend siap
- Login admin hingga Supabase Auth dan proxy session siap
- Pembayaran dan verifikasi QRIS
- CMS, Excel export, analitik

## Penting
- Semua event dalam src/data/demo-events.ts adalah **contoh**, bukan kegiatan resmi.
- Kontak mengacu pada booklet PDF, tetapi verifikasi ulang sebelum deployment.
- HTML referensi tidak disalin apa adanya: switch mode tanpa auth, QRIS SVG palsu dan state memory tidak aman untuk production.
- Jangan pernah menaruh `SUPABASE_SECRET_KEY` di kode client atau git.

Lihat `docs/ARCHITECTURE.md` untuk spesifikasi dan `supabase/migrations/001_initial.sql` untuk schema awal.
