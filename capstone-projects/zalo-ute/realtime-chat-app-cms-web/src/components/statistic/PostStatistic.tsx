import {
  ComposedChart,
  AreaChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { MessageSquare, ThumbsUp, Send, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "../Dialog";

const PostStatistics = () => {
  const INITIAL_STATE = {
    posts: {
      primal: {
        public: 0,
        friend: 0,
        private: 0,
      },
      updated: {
        public: 0,
        friend: 0,
        private: 0,
      },
      pending: 0,
      accepted: 0,
      rejected: 0,
      avgDailyCount: 0,
    },
    postReactions: {
      total: 0,
      avgDailyCount: 0,
    },
    comments: {
      total: 0,
      avgDailyCount: 0,
    },
    commentReactions: {
      total: 0,
      avgDailyCount: 0,
    },
  };

  const [data, setData] = useState<any>(INITIAL_STATE);
  const { get, loading } = useFetch();

  useEffect(() => {
    const fetchData = async () => {
      const res = await get("/v1/statistic/posts");
      setData(res.data);
    };
    fetchData();
  }, []);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  const radarData = [
    {
      subject: "Bài đăng công khai",
      A: data.posts.primal.public + data.posts.updated.public,
    },
    {
      subject: "Bài đăng bạn bè",
      A: data.posts.primal.friend + data.posts.updated.friend,
    },
    { subject: "Chờ duyệt", A: data.posts.pending },
    { subject: "Chấp nhận", A: data.posts.accepted },
    { subject: "Từ chối", A: data.posts.rejected },
  ];

  const composedData = [
    {
      name: "Bài đăng",
      reactions: data.postReactions.total,
      comments: data.comments.total,
    },
    { name: "Bình luận", reactions: data.commentReactions.total, comments: 0 },
  ];

  const areaData = [
    { name: "Bài đăng", value: data.posts.avgDailyCount },
    { name: "Lượt thích bài đăng", value: data.postReactions.avgDailyCount },
    { name: "Bình luận", value: data.comments.avgDailyCount },
    {
      name: "Lượt thích bình luận",
      value: data.commentReactions.avgDailyCount,
    },
  ];

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subValue,
    bgColor = "bg-blue-100",
    iconColor = "text-blue-600",
  }: any) => (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:scale-105 transition-transform duration-300">
      <div className={`${bgColor} p-4 rounded-full w-fit mb-4`}>
        <Icon className={iconColor} size={24} />
      </div>
      <h3 className="text-gray-600 font-medium mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        {subValue && (
          <span className="text-sm text-gray-500">
            Trung bình: {subValue}/ngày
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <LoadingDialog isVisible={loading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-blue-800 mb-2  whitespace-nowrap">
            Các thông số về bài đăng
          </h1>
          <p className="text-gray-600">
            Phân tích chi tiết hoạt động và tương tác
          </p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Send}
            title="Tổng số bài đăng"
            value={
              data.posts.primal.public +
              data.posts.primal.friend +
              data.posts.primal.private
            }
            subValue={data.posts.avgDailyCount}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            icon={ThumbsUp}
            title="Lượt thích bài đăng"
            value={data.postReactions.total}
            subValue={data.postReactions.avgDailyCount}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={MessageSquare}
            title="Bình luận"
            value={data.comments.total}
            subValue={data.comments.avgDailyCount}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon={Activity}
            title="Lượt thích bình luận"
            value={data.commentReactions.total}
            subValue={data.commentReactions.avgDailyCount}
            bgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Phân bố bài đăng theo trạng thái
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Số lượng"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Các thông số tổng quan
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={composedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reactions" fill="#8884d8" name="Lượt thích" />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#ff7300"
                  name="Bình luận"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Trung bình hoạt động hàng ngày
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Trạng thái bài đăng
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Chờ duyệt", "Chấp nhận", "Từ chối"].map((status, index) => (
              <div
                key={status}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div
                  className="text-3xl font-bold"
                  style={{ color: COLORS[index] }}
                >
                  {index === 0
                    ? data.posts.pending
                    : index === 1
                    ? data.posts.accepted
                    : data.posts.rejected}
                </div>
                <div className="text-gray-600 mt-2">{status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostStatistics;
