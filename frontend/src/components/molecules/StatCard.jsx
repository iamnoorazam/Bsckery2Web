import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({ title, value, icon, color = "text-primary" }) => (
  <Card className="animate-slide-up">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
