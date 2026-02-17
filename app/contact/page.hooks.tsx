import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendContactEmailAction } from "./page.actions";
import { CustomToast } from "@/components/CustomToast";

export function useSendContactEmail() {
  return useMutation({
    mutationFn: ({
      senderEmail,
      subject,
      message,
    }: {
      senderEmail: string;
      subject: string;
      message: string;
    }) => sendContactEmailAction({ senderEmail, subject, message }),
    onSuccess: () => {
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Message sent"
          message="We'll get back to you soon."
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Failed to send message"
          message={error.message}
        />
      ));
    },
  });
}
