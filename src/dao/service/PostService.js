import postModel from "../models/post.model.js";

class PostService {
  async getPosts(search, filter = -1, type, page = 1, limit = 4) {
    try {
      const options = {
        sort: { [type]: filter },
        limit,
        page: Number(page),
      };
      console.log(options);
      const searchQuery = { title: { $regex: search, $options: "i" } };
  
      const searchResults = await postModel.paginate(searchQuery, options);
      return searchResults;
    } catch (error) {
      console.error(`Error obteniendo /posts: ${error}`);
      return [];
    }
  }

  async findPost(id) {
    const post = await postModel.findById(id);
    return post;
  }

  async createPost(data) {
    const newPost = await postModel.create(data);
    return newPost;
  }

  async editPost(id, data) {
    const { content, title, thumbnail, views } = data;
    const post = await postModel.findById(id);
    post.content = content;
    post.title = title;
    post.thumbnail = thumbnail;
    post.views = views
    post.save();
  }

  async deletePost(id) {
    const post = await postModel.findByIdAndDelete(id);
    return post;
  }
}

export default PostService;
