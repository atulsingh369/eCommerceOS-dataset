import { OrderStatus } from "@/lib/firebase/orders";
import { Check, Package, Truck, Home } from "lucide-react";

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const statuses: {
    status: OrderStatus;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      status: "booked",
      label: "Order Booked",
      icon: <Check className="h-4 w-4" />,
    },
    {
      status: "packed",
      label: "Packed",
      icon: <Package className="h-4 w-4" />,
    },
    {
      status: "shipped",
      label: "Shipped",
      icon: <Truck className="h-4 w-4" />,
    },
    {
      status: "delivered",
      label: "Delivered",
      icon: <Home className="h-4 w-4" />,
    },
  ];

  const currentIndex = statuses.findIndex((s) => s.status === currentStatus);
  const isCancelled = currentStatus === "cancelled";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
          <div
            className={`h-full transition-all duration-500 ${
              isCancelled ? "bg-red-500" : "bg-primary"
            }`}
            style={{
              width: isCancelled
                ? "0%"
                : `${(currentIndex / (statuses.length - 1)) * 100}%`,
            }}
          />
        </div>

        {statuses.map((item, index) => {
          const isCompleted = index <= currentIndex && !isCancelled;
          const isCurrent = index === currentIndex && !isCancelled;

          return (
            <div
              key={item.status}
              className="flex flex-col items-center gap-2 relative"
            >
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isCancelled && index === 0
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-background border-muted text-muted-foreground"
                } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
              >
                {item.icon}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium text-center whitespace-nowrap ${
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {isCancelled && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">
            This order has been cancelled
          </p>
        </div>
      )}
    </div>
  );
}
