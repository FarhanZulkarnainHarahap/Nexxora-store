import HttpErrorPage from "@/components/ui/HttpErrorPage";

export default function ForbiddenPage() {
  return (
    <HttpErrorPage
      code="403"
      title="Forbidden"
      description="Server memahami permintaan Anda, tetapi akun ini tidak memiliki izin atau hak akses untuk membuka halaman tersebut."
    />
  );
}
