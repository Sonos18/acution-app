"use client";
import Loader from "@/components/loading";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { PaymentType } from "@/schemaValidations/payment.schema";
import { useEffect, useState } from "react";
import { ItemPayment } from "../auction/_components/item-payment";
import paymentApiRequest from "@/apiRequests/payment";

const PaymentPage = () => {
  const [payments, setPayments] = useState<PaymentType[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const loadPayment = async () => {
    try {
      setLoading(true);
      const res = await paymentApiRequest.getPayments();
      console.log(res.payload);

      setPayments(res.payload);
    } catch (error) {
      const e = error as Error;
      toast({
        title: "Error",
        description: e.message,
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPayment();
  }, []);
  if (loading) return <Loader />;
  return (
    <>
      {payments.length < 1 ? (
        <p>No payment found</p>
      ) : (
        <div className="w-3/4 mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Auction Id</TableHead>
                <TableHead className="text-center">Time </TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-right">Confirm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(payments) &&
                payments.map((payment) => (
                  <ItemPayment payment={payment} key={payment.paymentId} />
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
};
export default PaymentPage;
