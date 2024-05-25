import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentChart } from "../_component/chart/payment-chart";
import { UserChart } from "../_component/chart/users-chart";

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="w-10/12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          <DashboardCard title="Revenue" subtitle="6 Payments" body="$546" />
          <DashboardCard title="Products" subtitle="4 Categories" body="12" />
          <DashboardCard title="Users" subtitle="12 actives" body="14" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-12">
          <PaymentChart data={data} />
          <UserChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};
function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
const data = [
  {
    date: "14/05",
    total: 65,
  },
  {
    date: "15/05",
    total: 34,
  },
  {
    date: "16/05",
    total: 12,
  }, {
    date: "17/05",
    total: 65,
  },
  {
    date: "18/05",
    total: 34,
  },
  {
    date: "19/05",
    total: 12,
  },
];
