export default function BlogPost({ params }: { params: { auctionId: string } }) {
    return <h1>{params.auctionId}</h1>;
   } 