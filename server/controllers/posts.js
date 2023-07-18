import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from "../cloudinary/cloudinary.js";

/* CREATE */
// Upload to cloudinary
// async function cloudinaryUpload(file) {
//   const cloudinaryResponse = await cloudinary.uploader.upload(file)
//   const pictureUrl = await cloudinaryResponse.secure_url
//   return pictureUrl
// }
// save postdata into mongodb
async function savePost(data) {
  console.log("from savePost", data);
  const user = await User.findById(data.userId);
    const newPost = new Post ({
      userId: data.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description: data.description,
      userPicturePath: user.picturePath,
      picturePath: data.picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const posts = await getPosts()
    return posts
}
// get updated posts
async function getPosts() {
  const post = await Post.find();
  return post
}

export const createPost = async (req, res) => {
  try {
    const { userId, description, image } = req.body;
    console.log(Object.keys(req.body));
    console.log(req.body);
    let picturePath;
    image? picturePath = image : picturePath = ""  
    const postData = {
        userId,
        description,
        picturePath
    }
    const posts = await savePost(postData)
    res.status(201).json(posts);
    
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
//DELETE IMAGE FROM CLOUDINARY
const deleteFromCloudinary = async (url) => {
  const parsedUrl = await url.split('/')[7]
  const public_id= parsedUrl.split('.')[0]
  await cloudinary.uploader.destroy(public_id)
 }

export const deletePost = async (req,res) => {
  try {
    const { id } = req.params;
    const removedPost = await Post.findById(id);  
    //CHECK IF REMOVED POST HAS IMAGE
    const imageUrl = await removedPost.picturePath
    if (imageUrl) {
      deleteFromCloudinary(imageUrl)
    }    
    await Post.findByIdAndDelete(id)
    const post = await Post.find();
    res.status(200).json({post})
  } catch (error) {
    console.log(error.message)
  }
}