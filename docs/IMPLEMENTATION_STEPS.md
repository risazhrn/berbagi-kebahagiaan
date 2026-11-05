# Tahap Implementasi 1 — Cara Menjalankan

1. Install Node.js LTS (minimal 20.9), Git, VS Code.
2. Extract ZIP project, jalankan terminal di folder project.
3. Jalankan `npm install`.
4. Jalankan `npm run dev` dan buka http://localhost:3000.
5. Periksa halaman `/`, `/about`, `/events`, `/events/kunjungan-kreatif-contoh`, `/gallery`, `/contact`, `/status`, dan `/admin/login`.
6. Pastikan tampilan dan warna sesuai referensi; ganti gambar demo dengan aset resmi yang disetujui.
7. Buat project Supabase, isi `.env.local` (jangan commit).
8. Review SQL `supabase/migrations/001_initial.sql` secara hati-hati sebelum menjalankannya di Supabase SQL Editor. **SQL ini adalah draft skema dan fungsi, belum diuji di Supabase live.**
9. Tahap 2 selanjutnya: sambungkan login admin dan CRUD event, baru aktifkan pendaftaran peserta.

**Catatan:** Route `/admin/dashboard` pada starter selalu mengalihkan ke login. Ini sengaja dilakukan hingga autentikasi aman aktif. Seluruh tombol pembayaran/registrasi demo juga dinonaktifkan.
