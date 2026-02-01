export default function (author) {
  return {
    firstName: author.first_name,
    lastName: author.last_name,
    id: author.id,
    location: author.location,
    phoneNumber: author.phone_number,
  };
}
