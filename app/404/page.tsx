import HttpErrorPage from "@/components/ui/HttpErrorPage";

export default function NotFoundRoutePage() {
  return (
    <HttpErrorPage
      code="404"
      title="Page Not Found"
      description="Halaman yang dicari tidak ditemukan di server. Tautan mungkin salah, sudah kedaluwarsa, atau halaman telah dihapus."
    />
  );
}
