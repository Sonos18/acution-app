import http from "@/lib/http";
import {
  AuctionType,
  AuctionsResponseType,
} from "@/schemaValidations/auction.schema";

const auctionApiRequest = {
  getAuctions: (param: string) =>
    http.get<AuctionsResponseType>(`/auction${param}`),
  createAuction: (body: any) => http.post("/auction", body),
  getAuction: (id: string) => http.get<AuctionType>(`/auction/?id=${id}`),
};

export default auctionApiRequest;
