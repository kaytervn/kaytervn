import { useState, useEffect } from "react";
import { MessageCircleIcon, HeartIcon } from "lucide-react";
import { getRandomColor } from "../../types/utils";
import useFetch from "../../hooks/useFetch";
import UserImg from "../../assets/user_icon.png";
import { LoadingDialog } from "../Dialog";

const PostDetail = ({ postId, profile }: any) => {
  const { get, loading } = useFetch();
  const [data, setData] = useState<any>({});
  useEffect(() => {
    const fetchData = async () => {
      if (postId) {
        const res = await get(`/v1/post/get/${postId}`);
        setData({ ...res.data });
      }
    };
    fetchData();
  }, [postId]);
  const post = {
    avatarUrl:
      "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
    authorName: "Nguyễn Văn A",
    timestamp: "2 giờ trước",
    content:
      "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890",
    likes: 150,
    commentCount: 23,
  };

  const comments = [
    {
      avatarUrl:
        "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
      authorName: "Trần Thị B",
      content: "Đúng rồi! Thời tiết hôm nay tuyệt vời.",
    },
    {
      avatarUrl:
        "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
      authorName: "Lê Văn C",
      content: "Picnic ở đâu vậy bạn? Mình muốn tham gia!",
    },
    {
      avatarUrl:
        "https://fastly.picsum.photos/id/866/200/300.jpg?hmac=rcadCENKh4rD6MAp6V_ma-AyWv641M4iiOpe1RyFHeI",
      authorName: "Phạm Thị D",
      content: "Nhớ mang theo đồ ăn ngon nha mọi người!",
    },
  ];
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden border border-gray-300">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img
            src={data.user?.avatarUrl || UserImg}
            className="w-12 h-12 rounded-full mr-4 border-gray-300 border"
          />
          <div>
            <h2 className="font-bold text-lg">{data.user?.displayName}</h2>
            <p className="text-gray-500 text-sm">{data.createdAt}</p>
          </div>
        </div>

        <div
          className={`${getRandomColor()} rounded-lg px-4 mr-2 py-8 mb-4 h-[500px] flex items-center justify-center overflow-hidden`}
        >
          <p className="text-white text-2xl font-bold break-words overflow-auto max-h-full">
            {data.content}
          </p>
        </div>

        {/* Interaction buttons */}
        <div className="flex items-center justify-between text-gray-500 text-md border-t border-b py-2">
          <span className="flex items-center mr-6">
            <HeartIcon size={20} className="mr-1" /> {data.totalReactions} Yêu
            thích
          </span>
          <span className="flex items-center mr-6">
            <MessageCircleIcon size={20} className="mr-1" />
            {data.totalComments} Bình luận
          </span>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-lg mb-2">Bình luận</h3>
          {comments.map((comment, index) => (
            <div key={index} className="flex items-start mb-4">
              <img
                src={comment.avatarUrl}
                alt={comment.authorName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="bg-gray-100 rounded-lg p-2 flex-grow">
                <p className="font-bold">{comment.authorName}</p>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <LoadingDialog isVisible={loading} />
    </div>
  );
};

export default PostDetail;
