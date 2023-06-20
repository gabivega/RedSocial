import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import FriendListWidget from "scenes/widgets/FriendsListWidget"
import Chatroom from "scenes/widgets/ChatRoom";
import FeedCategories from "scenes/widgets/FeedCategories";

 const HomePage = ( sendMessage) => {
    const isNonMobileScreens = useMediaQuery("(min-width:800px)");
    const { _id, picturePath } = useSelector((state) => state.user)
    return (
    <Box>
      <title>Red Social</title>
        <Navbar />
        <Box
        width="100%"
        padding="1rem 5%"
        display={isNonMobileScreens? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between">
        
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
            <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}>
            <MyPostWidget picturePath={picturePath} />
            <FeedCategories />
            <PostsWidget userId={_id} />
        </Box>        
          <Box flexBasis="26%">
            <Chatroom sendMessage={sendMessage} />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
      </Box>
    </Box>
  );
};

export default HomePage;