import auctionApiRequest from "@/apiRequests/auction";
import { TableCell, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { PaymentType } from "@/schemaValidations/payment.schema";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import paymentApiRequest from "@/apiRequests/payment";

interface Props {
  payment: PaymentType;
}
export const ItemPayment = ({ payment }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const paid = async () => {
    try {
      setLoading(true);
      const stripe = await loadStripe(
        "pk_test_51PDURDC5ZaDhip4XNfASB0lYHOzO7DFTGaapmFxU6HAqSaAodBQyNTwUvpToJduBtRawhFlaRWcT05nVdVfrS86600CsvqHLcc"
      );
      const session = await paymentApiRequest.createCheckout(payment);
      const res = await stripe?.redirectToCheckout({
        sessionId: session.payload.id,
      });
      console.log(res);
    } catch (e) {
      const error = e as Error;
    }
  };
  return (
    <>
      <TableRow key={payment.paymentId}>
        <TableCell>{payment.paymentId}</TableCell>
        <TableCell className="text-center">
          {new Date(payment.createdAt).toLocaleString()}
        </TableCell>
        <TableCell className="text-center">{payment.total}</TableCell>
        <TableCell className="text-right">
          <button
            onClick={paid}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : (
              "Confirm"
            )}
          </button>
        </TableCell>
      </TableRow>
    </>
  );
};
