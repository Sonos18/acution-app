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
import { useEffect } from "react";
import { ItemPayment } from "../auction/_components/item-payment";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const PaymentPage = () => {
  const payments=useSelector((state:RootState)=>state.payments.payments);
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
