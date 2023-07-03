import postModel from "../models/post.model.js";

class PostService {
  async getPosts(search, filter = -1, type, page = 1, limit = 4) {
    try {
      const options = {
        sort: { [type]: filter },
        limit,
        page: Number(page),
      };

      const searchQuery = { title: { $regex: search, $options: "i" } };
  
      const searchResults = await postModel.paginate(searchQuery, options);
      const views = await this.getViews()

      return { ...searchResults, views: views.docs };
    } catch (error) {
      console.error(`Error obteniendo /posts: ${error}`);
      return [];
    }
  }

  async getViews() {
    try {
      const options = {
        sort: { views: -1 },
        limit: 4,
        page: 1,
      };

      const searchResults = await postModel.paginate({}, options);

      return searchResults
    } catch (err) {
      console.error('Error al cargar mostViews' ,err)
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
    const { content, title, thumbnail } = data;
    const post = await postModel.findById(id);
    post.content = content;
    post.title = title;
    post.thumbnail = thumbnail;
    await post.save();
  }

  async addView(id) {
    const post = await postModel.findById(id)
    post.views = post.views + 1
    await post.save()
    return true
  }

  async deletePost(id) {
    const post = await postModel.findByIdAndDelete(id);
    return post;
  }
}

export default PostService;
