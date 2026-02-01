export default function (seller) {
  return {
    firstName: seller.first_name,
    lastName: seller.last_name,
    email: seller.email,
    isFavourite: seller.is_favorite,
    isVerified: seller.is_verified_seller,
    isStripe: seller.is_stripe_connected,
    phoneNumber: seller.phone_number,
    location: seller.location,
    avatar: seller.avatar,
    id: seller.id,
  };
}
