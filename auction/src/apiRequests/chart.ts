import http from "@/lib/http";


const chartApiRequest = {
  get: () =>http.get("/chart"),
  
};

export default chartApiRequest;
