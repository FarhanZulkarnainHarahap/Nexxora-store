import HttpErrorPage from "@/components/ui/HttpErrorPage";

export default function BadRequestPage() {
  return (
    <HttpErrorPage
      code="400"
      title="Bad Request"
      description="Server tidak dapat memahami perintah dari browser. Hal ini biasanya terjadi karena URL salah diketik atau file cache browser bermasalah."
    />
  );
}
