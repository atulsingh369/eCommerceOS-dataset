import { Badge } from "@/components/ui/Badge";
import { OrderStatus } from "@/lib/firebase/orders";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const statusConfig = {
    booked: {
      label: "Booked",
      variant: "default" as const,
      className: "bg-blue-500 hover:bg-blue-600",
    },
    packed: {
      label: "Packed",
      variant: "secondary" as const,
      className: "bg-yellow-500 hover:bg-yellow-600 text-black",
    },
    shipped: {
      label: "Shipped",
      variant: "default" as const,
      className: "bg-purple-500 hover:bg-purple-600",
    },
    delivered: {
      label: "Delivered",
      variant: "default" as const,
      className: "bg-green-500 hover:bg-green-600 tracking-tighter px-2 ",
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive" as const,
      className: "bg-red-500 hover:bg-red-600 tracking-tighter px-2 ",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
}
