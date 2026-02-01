import Seller from "./Seller";
export default function (product) {
  return {
    title: product.title,
    image: product.image,
    price: product.price,
    slug: product.slug,
    isHidden: product.is_hidden,
    isOut: product.is_out_of_stock,
    seller: product.seller && Seller(product.seller),
  };
}
