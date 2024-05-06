import http from "@/lib/http";
import {
  AuctionClosingType,
  AuctionType,
  AuctionsResponseType,
} from "@/schemaValidations/auction.schema";

const auctionApiRequest = {
  getAuctions: (param: string) =>
    http.get<AuctionsResponseType>(`/auction${param}`),
  createAuction: (body: any) => http.post("/auction", body),
  getAuction: (id: string) => http.get<AuctionType>(`/auction/?id=${id}`),
  bidAuction: (id: string, body: { price: number }) =>
    http.post(`/auction/bid/?id=${id}`, body),
  buyAuction: (id: string, body: { price: number }) =>
    http.post(`/auction/buy/?id=${id}`, body),
  getMyAuctionsCofirm: () => http.get<AuctionClosingType[]>("/auction/closing"),
  confirmAuction: (id: string) => http.get(`/auction/confirm/?id=${id}`),
};

export default auctionApiRequest;
