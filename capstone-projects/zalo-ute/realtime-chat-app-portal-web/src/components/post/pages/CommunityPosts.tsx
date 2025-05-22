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

const CommunityPosts = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, showLoading, hideLoading } = useLoading();
  const {get, loading} = useFetch();
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);


  const itemsPerPage = 10;
  useEffect(() => {
    fetchPosts(0);
  }, []);

const fetchPosts = async (pageNumber: number) => {

  try {
    const response = await get(`/v1/post/list`, {
      page: pageNumber,
      size: itemsPerPage,
      getListKind: 1,
      
    });
    const data = response.data.content;

    if (pageNumber === 0) {
      setPosts(data);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...data]);
    }

    setHasMore(data.length > 0);
  } catch (error: any) {
    console.error("Lỗi chi tiết:", error); 
    
  } finally {
    setIsLoadingMore(false);
  }
};


  const handleDeletePost = async (postId: string) => {
    // Add delete functionality here
    // After successful deletion, refresh the posts
    fetchPosts(0);
  };

  const handleEditPost = async (postId: string) => {
    // Add edit functionality here
    // After successful edit, refresh the posts
    fetchPosts(0);
  };

  const filteredPosts = posts.filter((post) =>
    post.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <h1 className="text-xl font-bold text-center py-2 m-0">Bài viết cộng đồng</h1>
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
            <p className="text-center text-gray-500">Không có bài viết nào từ cộng đồng.</p>
          )}
        </div>
      </div>

      <LoadingDialog isVisible={loading} />
    </div>
  );
};

export default CommunityPosts;
