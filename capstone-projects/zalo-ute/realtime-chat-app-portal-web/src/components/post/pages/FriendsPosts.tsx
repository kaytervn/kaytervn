import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';
import StoryViewer from '../story/StoryViewer';
import { useLoading } from '../../../hooks/useLoading';
import { remoteUrl } from '../../../types/constant';
import { toast } from 'react-toastify';
import InputField from '../../InputField';
import { Search } from 'lucide-react';
import { LoadingDialog } from '../../Dialog';
import { PostModel } from '../../../models/post/PostModel';
import useFetch from '../../../hooks/useFetch';
import { FriendModel } from '../../../models/friend/friendModel';

const FriendsPosts = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [friends, setFriends] = useState<FriendModel[]>([]);
  const { get, loading } = useFetch();

  useEffect(() => {
    fetchFriends();
  }, []);  // Chỉ gọi fetchFriends một lần khi component mount

  useEffect(() => {
    if (friends.length > 0) {  // Kiểm tra nếu đã có bạn bè
      fetchPosts();
    }
  }, [friends]);  // Khi friends thay đổi, gọi fetchPosts

  const fetchPosts = async () => {
    try {
      const response = await get(`/v1/post/list`, {
        isPaged: 0,
        ignoreFriendship: 1,
        status: 2,
        getListkind: 2,
      });
      const data = response.data.content;
      console.log("post", data);

      // Lọc bài post của những người bạn đã follow
      const filteredPosts = data.filter((post: any) => {
        return friends.some((friend: any) => friend.friend._id === post.user._id);
      });

      console.log("post follow", filteredPosts);
      setPosts(filteredPosts);
    } catch (error: any) {
      console.error("Lỗi chi tiết:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await get(`/v1/friendship/list`);
      const data = response.data.content.filter((friend: any) => friend.isFollowed === 1); // Lọc bạn bè có isFollowed = 1
      setFriends(data);
      console.log("friend follow", data);
    } catch (error: any) {
      console.error("Lỗi chi tiết:", error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    fetchPosts(); // Tải lại danh sách bài viết
  };

  const handleEditPost = async (postId: string) => {
    fetchPosts(); // Tải lại danh sách bài viết
  };

  const filteredPosts = posts.filter((post) =>
    post.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <h1 className="text-xl font-bold text-center py-2 m-0">Bài viết của bạn bè</h1>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="p-4">
          <div className="max-w-2xl mx-auto mb-6">
            <InputField
              placeholder="Tìm kiếm bài viết theo tên"
              icon={Search}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="bg-white mb-4 relative">
            <StoryViewer />
          </div>

          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostItem
                key={post._id}
                postItem={post}
                onEdit={() => handleEditPost(post._id)}
                onDelete={() => handleDeletePost(post._id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">Không có bài viết nào từ bạn bè. HÃY KẾT BẠN VÀ FOLLOW HỌ ĐỂ XEM THÊM NHỮNG BÀI ĐĂNG MỚI NHẤT TỪ HỌ.</p>
          )}
        </div>
      </div>

      <LoadingDialog isVisible={loading} />
    </div>
  );
};

export default FriendsPosts;
