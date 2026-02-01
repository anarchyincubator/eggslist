import Product from "./Product";
import Seller from "./Seller";
export default function (product) {
  return {
    allowDelivery: product.allow_delivery,
    allowPickup: product.allow_pickup,
    description: product.description,
    image: product.image,
    isBanned: product.is_banned,
    moreProduct:
      product.more_from_this_farm && product.more_from_this_farm.map(Product),
    price: product.price,
    seller: product.seller && Seller(product.seller),
    sellerStatus: product.seller_status,
    sub: product.subcategory?.slug,
    subName: product.subcategory?.name,
    slug: product.slug,
    title: product.title,
    isOut: product.is_out_of_stock,
    isHidden: product.is_hidden,
    alsoLike:
      product.you_may_also_like && product.you_may_also_like.map(Product),
  };
}
