export default function (city) {
  return {
    country: city.country,
    city: city.city,
    slug: city.slug,
    state: city.state,
    radius: city.lookup_radius,
    isUndefined: city.is_undefined,
  };
}
