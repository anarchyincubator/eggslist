export default async function ({ store, redirect, route }) {
  const { product } = await store.dispatch(
    "products/getEditProduct",
    route.query.slug
  );
  if (product.seller.id !== store.getters["user/user"].id) {
    redirect("/");
  }
}
