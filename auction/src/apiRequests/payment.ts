import http from "@/lib/http";
import { PaymentType } from "@/schemaValidations/payment.schema";

const paymnetApiRequest = {
  getPayments: () => http.get<PaymentType>("/payment"),
};

export default paymnetApiRequest;
