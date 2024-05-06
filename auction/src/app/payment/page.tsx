"use client";

import paymnetApiRequest from "@/apiRequests/payment";
import Loader from "@/components/loading";
import { toast } from "@/components/ui/use-toast";
import { PaymentType } from "@/schemaValidations/payment.schema";
import { useEffect, useState } from "react";

const PaymentPage = () => {
  const [payment, setPayment] = useState<PaymentType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const loadPayment = async () => {
    try {
      setLoading(true);
      const res = await paymnetApiRequest.getPayments();
      console.log(res.payload);

      setPayment(res.payload);
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
      <h1>Payment Page</h1>
      {payment && <p>{payment.total}</p>}
    </>
  );
};
export default PaymentPage;
