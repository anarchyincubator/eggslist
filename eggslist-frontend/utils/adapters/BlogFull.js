import Author from "./Author";
import Blog from "./Blog";
export default function (blog) {
  return {
    title: blog.title,
    image: blog.image,
    body: blog.body,
    slug: blog.slug,
    category: blog.category,
    dateCreated: blog.date_created,
    similarBlogs: blog.similar_blogs && blog.similar_blogs.map(Blog),
    author: blog.author && Author(blog.author),
  };
}
