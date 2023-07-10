import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from "../cloudinary/cloudinary.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, image } = req.body;
    console.log(req.body);
    const CloudinaryResponse = await cloudinary.uploader.upload(image)
    console.log(CloudinaryResponse)
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath: CloudinaryResponse.secure_url,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find();
    console.log(post);
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// DELETE POST

export const deletePost = async (req,res) => {
  try {
    const { id } = req.params;
    const removedPost = await Post.findById(id);  
    const imgUrl = await removedPost.picturePath
    console.log(imgUrl)
    const parsedUrl = await imgUrl.split('/')[7]
    console.log(parsedUrl);
    const public_id= parsedUrl.split('.')[0]
    console.log(public_id)
    const cloudinaryRes = await cloudinary.uploader.destroy(public_id)
    console.log(cloudinaryRes)
    const deletedPost= await Post.findByIdAndDelete(id)
    console.log(deletedPost);
    const post = await Post.find();
    res.status(200).json({post})
  } catch (error) {
    console.log(error.message)
  }
}