export default async function ({ store, redirect, route }) {
  const { blog } = await store.dispatch("blog/getBlog", {
    slug: route.query.slug,
    edit: true,
  });
  if (blog.author.id !== store.getters["user/user"].id) {
    redirect("/");
  }
}
