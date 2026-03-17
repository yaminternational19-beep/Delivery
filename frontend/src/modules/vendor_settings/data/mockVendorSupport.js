export const mockQueries = [
  {
    id: 1,
    subject: "Order Payment Issue",
    message: "I haven't received payment for order #ORD-12345.",
    status: "Resolved",
    priority: "High",
    admin_reply: "The payment was processed on March 15th. Please check your bank statement.",
    created_at: "2026-03-14T10:30:00Z"
  },
  {
    id: 2,
    subject: "Product List Update",
    message: "How can I bulk update my product prices?",
    status: "Pending",
    priority: "Medium",
    admin_reply: null,
    created_at: "2026-03-16T14:45:00Z"
  },
  {
    id: 3,
    subject: "App Notification Problem",
    message: "I am not getting real-time notifications for new orders.",
    status: "Pending",
    priority: "High",
    admin_reply: null,
    created_at: "2026-03-17T09:15:00Z"
  }
];

export const faqs = [
  {
    id: 1,
    question: "How do I update my vendor profile?",
    answer: "You can update your profile by navigating to Settings > Profile. There you can change your business name, contact info, and upload a new logo."
  },
  {
    id: 2,
    question: "How long does payout take?",
    answer: "Payouts are usually processed within 2-3 business days after the order is marked as delivered."
  },
  {
    id: 3,
    question: "How to add new products?",
    answer: "Go to the 'Products' menu and click on the 'Add Product' button. Fill in the details and add images to submit for review."
  },
  {
    id: 4,
    question: "What are the platform fees?",
    answer: "We charge a standard 10% commission on every successful sale. For premium vendors, this rate may be lower."
  }
];
