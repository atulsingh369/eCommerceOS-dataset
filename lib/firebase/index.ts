// Export all Firebase modules for easy importing
export { auth, db, googleProvider } from './config';
export {
    signupWithEmailPassword,
    loginWithEmailPassword,
    loginWithGoogle,
    logout,
    resetPassword,
    type SignupResult
} from './auth';
export {
    createOrUpdateUserDocument,
    type UserData
} from './firestore';
export {
    getFriendlyErrorMessage,
    logAndGetFriendlyError,
    isAuthError,
    isFirestoreError
} from './errors';
export {
    createOrder,
    getOrder,
    getUserOrders,
    subscribeToOrder,
    subscribeToUserOrders,
    updateOrderStatus,
    getOrderStatusCounts,
    type Order,
    type OrderItem,
    type OrderStatus,
    type DeliveryAddress,
    type PriceBreakdown,
    type RazorpayDetails
} from './orders';
export {
    getUserProfile,
    updateUserProfile,
    subscribeToUserProfile,
    createUserProfile,
    type UserProfile
} from './user';
