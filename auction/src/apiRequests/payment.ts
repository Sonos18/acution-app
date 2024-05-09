import http from "@/lib/http";
import { PaymentType } from "@/schemaValidations/payment.schema";

const paymentApiRequest = {
  getPayments: () => http.get<PaymentType[] | []>("/payment"),
  createCheckout: (body: PaymentType) =>
    http.post<{ id: string }>("/payment/create-checkout", body),
};

export default paymentApiRequest;
