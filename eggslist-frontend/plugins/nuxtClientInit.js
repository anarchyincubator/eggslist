export default async (ctx) => {
  let name = ctx.route.name;
  if (name === "email-verify") return;

  if (name === "social-google-sign-in") return;

  if (name === "social-facebook-sign-in") return;

  await ctx.store.dispatch("nuxtClientInit", ctx);
};
