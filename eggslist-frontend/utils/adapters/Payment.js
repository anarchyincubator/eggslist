import Product from "./Product";
export default function (payment) {
  return {
    price: payment.price,
    customer: payment.customer,
    slug: payment.status,
    product: Product(payment.product),
    created: payment.created_at,
  };
}
