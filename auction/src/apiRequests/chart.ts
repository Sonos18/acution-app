import { ChartType } from "@/app/(admin)/dashboard/page";
import http from "@/lib/http";


const chartApiRequest = {
  get: () =>http.get<ChartType>("/chart"),
  
};

export default chartApiRequest;
