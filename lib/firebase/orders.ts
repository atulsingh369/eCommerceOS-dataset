import { db } from "./config";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    orderBy,
    where,
    serverTimestamp,
    Timestamp,
    onSnapshot,
    Unsubscribe
} from "firebase/firestore";

/**
 * Order status types
 */
export type OrderStatus = "booked" | "packed" | "shipped" | "delivered" | "cancelled";

/**
 * Payment method types
 */
export type PaymentMethod = "COD" | "Card" | "UPI";

/**
 * Order item interface
 */
export interface OrderItem {
    id: number | string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
}

/**
 * Delivery address interface
 */
export interface DeliveryAddress {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

/**
 * Price breakdown interface
 */
export interface PriceBreakdown {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
}

/**
 * Razorpay payment details
 */
export interface RazorpayDetails {
    paymentId: string;
    orderId: string;
    signature: string;
    method: string;
    amount: number;
}

/**
 * Order interface
 */
export interface Order {
    orderId: string;
    userId: string;
    items: OrderItem[];
    deliveryAddress: DeliveryAddress;
    priceBreakdown: PriceBreakdown;
    paymentMethod: PaymentMethod | string;
    razorpayDetails?: RazorpayDetails;
    status: OrderStatus;
    createdAt: Timestamp | unknown;
    updatedAt: Timestamp | unknown;
    estimatedDelivery?: Timestamp | unknown;
}

/**
 * Create a new order in Firestore
 * 
 * @param userId - The user's UID
 * @param orderData - Order data without orderId and timestamps
 * @returns The created order with orderId
 */
export async function createOrder(
    userId: string,
    orderData: Omit<Order, "orderId" | "userId" | "createdAt" | "updatedAt">
): Promise<Order> {
    try {
        // Generate unique order ID
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const orderId = `ORD-${timestamp}-${randomSuffix}`;

        // Create order document reference
        const orderRef = doc(db, `users/${userId}/orders`, orderId);

        // Prepare order data
        const order: Order = {
            orderId,
            userId,
            ...orderData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        // Save to Firestore
        await setDoc(orderRef, order);

        console.log(`Order created: ${orderId} for user: ${userId}`);

        return {
            ...order,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order. Please try again.");
    }
}

/**
 * Get a single order by ID (one-time fetch)
 * 
 * @param userId - The user's UID
 * @param orderId - The order ID
 * @returns The order data or null if not found
 */
export async function getOrder(userId: string, orderId: string): Promise<Order | null> {
    try {
        const orderRef = doc(db, `users/${userId}/orders`, orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            console.log(`Order not found: ${orderId}`);
            return null;
        }

        return orderSnap.data() as Order;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw new Error("Failed to fetch order details.");
    }
}

/**
 * Get all orders for a user (one-time fetch)
 * 
 * @param userId - The user's UID
 * @param statusFilter - Optional status filter
 * @returns Array of orders
 */
export async function getUserOrders(
    userId: string,
    statusFilter?: OrderStatus
): Promise<Order[]> {
    try {
        const ordersRef = collection(db, `users/${userId}/orders`);

        let q = query(ordersRef, orderBy("createdAt", "desc"));

        if (statusFilter) {
            q = query(ordersRef, where("status", "==", statusFilter), orderBy("createdAt", "desc"));
        }

        const querySnapshot = await getDocs(q);

        const orders: Order[] = [];
        querySnapshot.forEach((doc) => {
            orders.push(doc.data() as Order);
        });

        console.log(`Fetched ${orders.length} orders for user: ${userId}`);
        return orders;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw new Error("Failed to fetch orders.");
    }
}

/**
 * Subscribe to real-time updates for a single order
 * 
 * @param userId - The user's UID
 * @param orderId - The order ID
 * @param callback - Callback function called with order data on updates
 * @returns Unsubscribe function to stop listening
 * 
 * @example
 * ```typescript
 * const unsubscribe = subscribeToOrder(userId, orderId, (order) => {
 *   if (order) {
 *     setOrder(order); // Update state
 *   }
 * });
 * 
 * // Cleanup
 * return () => unsubscribe();
 * ```
 */
export function subscribeToOrder(
    userId: string,
    orderId: string,
    callback: (order: Order | null) => void
): Unsubscribe {
    const orderRef = doc(db, `users/${userId}/orders`, orderId);

    const unsubscribe = onSnapshot(
        orderRef,
        (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data() as Order);
            } else {
                callback(null);
            }
        },
        (error) => {
            console.error("Error in order subscription:", error);
            callback(null);
        }
    );

    return unsubscribe;
}

/**
 * Subscribe to real-time updates for all user orders
 * 
 * @param userId - The user's UID
 * @param callback - Callback function called with orders array on updates
 * @param statusFilter - Optional status filter
 * @returns Unsubscribe function to stop listening
 * 
 * @example
 * ```typescript
 * const unsubscribe = subscribeToUserOrders(userId, (orders) => {
 *   setOrders(orders); // Update state automatically
 * });
 * 
 * // Cleanup
 * return () => unsubscribe();
 * ```
 */
export function subscribeToUserOrders(
    userId: string,
    callback: (orders: Order[]) => void,
    statusFilter?: OrderStatus
): Unsubscribe {
    const ordersRef = collection(db, `users/${userId}/orders`);

    let q = query(ordersRef, orderBy("createdAt", "desc"));

    if (statusFilter) {
        q = query(ordersRef, where("status", "==", statusFilter), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const orders: Order[] = [];
            snapshot.forEach((doc) => {
                orders.push(doc.data() as Order);
            });
            callback(orders);
        },
        (error) => {
            console.error("Error in orders subscription:", error);
            callback([]);
        }
    );

    return unsubscribe;
}

/**
 * Update order status
 * 
 * @param userId - The user's UID
 * @param orderId - The order ID
 * @param newStatus - The new status
 */
export async function updateOrderStatus(
    userId: string,
    orderId: string,
    newStatus: OrderStatus
): Promise<void> {
    try {
        const orderRef = doc(db, `users/${userId}/orders`, orderId);

        await setDoc(
            orderRef,
            {
                status: newStatus,
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );

        console.log(`Order ${orderId} status updated to: ${newStatus}`);
    } catch (error) {
        console.error("Error updating order status:", error);
        throw new Error("Failed to update order status.");
    }
}

/**
 * Get order count by status
 * 
 * @param userId - The user's UID
 * @returns Object with counts for each status
 */
export async function getOrderStatusCounts(userId: string): Promise<Record<OrderStatus, number>> {
    try {
        const orders = await getUserOrders(userId);

        const counts: Record<OrderStatus, number> = {
            booked: 0,
            packed: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        };

        orders.forEach((order) => {
            counts[order.status]++;
        });

        return counts;
    } catch (error) {
        console.error("Error getting order status counts:", error);
        throw new Error("Failed to get order statistics.");
    }
}
