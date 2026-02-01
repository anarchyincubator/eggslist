export default function (category) {
  return {
    name: category.name,
    image: category.image,
    subs: category.subcategories,
  };
}
