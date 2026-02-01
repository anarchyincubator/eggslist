export const localStorageKeyCity = "eggslist:city";
export const localStorageKeyAuth = "eggslist:token";
export const localStorageCookies = "eggslist:cookie";

export default {
  localStorageKeyCity,
  localStorageKeyAuth,
  localStorageCookies,
};

export function generateFormDataProduct(data) {
  const formData = new FormData();

  if (data.image) formData.append("image", data.image);

  formData.append("title", data.title);

  if (data.description) formData.append("description", data.description);

  if (data.subcategory) formData.append("subcategory_slug", data.subcategory);

  formData.append("allow_pickup", data.pickup);

  formData.append("allow_delivery", data.delivery);

  if (data.price) formData.append("price", data.price);
  return formData;
}
export function generateFormDataBlog(data) {
  const formData = new FormData();

  if (data.image) formData.append("image", data.image);

  formData.append("title", data.title);

  if (data.body) formData.append("body", data.body);

  if (data.slug) formData.append("category_slug", data.slug);

  return formData;
}
