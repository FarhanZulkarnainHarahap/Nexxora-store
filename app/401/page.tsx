import HttpErrorPage from "@/components/ui/HttpErrorPage";

export default function UnauthorizedPage() {
  return (
    <HttpErrorPage
      code="401"
      title="Unauthorized"
      description="Akses halaman ditolak karena membutuhkan proses login dengan nama pengguna dan kata sandi yang valid."
      primaryAction={{
        label: "Login",
        href: "/login",
      }}
    />
  );
}
