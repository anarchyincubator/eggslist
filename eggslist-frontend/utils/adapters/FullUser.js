export default function (user) {
  return {
    avatar: user.avatar,
    bio: user.bio,
    email: user.email,
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    location: user.user_location,
    isEmail: user.is_email_verified,
    isStriped: user.is_stripe_connected,
    isFavourite: user.is_favorite,
    phone: user.phone_number,
    dateJoined: user.date_joined,
    isVerified: user.is_verified_seller,
    isVerifiedPending: user.is_verified_seller_pending,
  };
}
