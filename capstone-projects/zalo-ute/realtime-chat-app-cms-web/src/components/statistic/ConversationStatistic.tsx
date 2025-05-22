import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { MessageCircle, Users, Heart, BookOpen, Eye, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "../Dialog";

const ConversationStatistic = () => {
  const INITIAL_STATE = {
    friendships: {
      pending: 0,
      accepted: 0,
      avgDailyCount: 0,
    },
    conversations: {
      private: 0,
      group: 0,
      avgDailyCount: 0,
    },
    messages: {
      total: 0,
      avgDailyCount: 0,
    },
    messageReactions: {
      total: 0,
      avgDailyCount: 0,
    },
    stories: {
      total: 0,
      avgDailyCount: 0,
    },
    storyViews: {
      total: 0,
      avgDailyCount: 0,
    },
  };

  const [data, setData] = useState<any>(INITIAL_STATE);
  const { get, loading } = useFetch();

  useEffect(() => {
    const fetchData = async () => {
      const res = await get("/v1/statistic/conversations");
      setData(res.data);
    };
    fetchData();
  }, []);

  const barChartData = [
    {
      name: "Bạn bè",
      Chờ: data.friendships.pending,
      Chấp_Nhận: data.friendships.accepted,
    },
    {
      name: "Cuộc trò chuyện",
      Riêng: data.conversations.private,
      Nhóm: data.conversations.group,
    },
    {
      name: "Tin nhắn",
      Tổng: data.messages.total,
    },
    {
      name: "Yêu thích",
      Tổng: data.messageReactions.total,
    },
  ];

  const pieChartData = [
    { name: "Trò chuyện riêng", value: data.conversations.private },
    { name: "Trò chuyện nhóm", value: data.conversations.group },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const StatCard = ({ icon: Icon, title, value, subValue }: any) => (
    <div className="bg-white shadow-lg rounded-xl p-4 flex items-center space-x-4 hover:scale-105 transition-transform">
      <div className="bg-blue-100 p-3 rounded-full">
        <Icon className="text-blue-600" size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-400">Trung bình: {subValue} / ngày</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingDialog isVisible={loading} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center whitespace-nowrap">
          Các thông số về cuộc trò chuyện
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Yêu cầu kết bạn"
            value={`${data.friendships.pending + data.friendships.accepted}`}
            subValue={data.friendships.avgDailyCount}
          />
          <StatCard
            icon={MessageCircle}
            title="Cuộc trò chuyện"
            value={`${data.conversations.private + data.conversations.group}`}
            subValue={data.conversations.avgDailyCount}
          />
          <StatCard
            icon={Heart}
            title="Lượt yêu thích tin nhắn"
            value={data.messageReactions.total}
            subValue={data.messageReactions.avgDailyCount}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Chi tiết thống kê
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend
                  formatter={(value) => {
                    const labelMap: any = {
                      Chờ: "Đang chờ",
                      Chấp_Nhận: "Chấp nhận",
                      Riêng: "Trò chuyện riêng",
                      Nhóm: "Trò chuyện nhóm",
                      Tổng: "Tổng cuộc trò chuyện",
                    };
                    return labelMap[value] || value;
                  }}
                />
                <Bar dataKey="Chờ" stackId="a" fill="#8884d8" />
                <Bar dataKey="Chấp_Nhận" stackId="a" fill="#82ca9d" />
                <Bar dataKey="Riêng" stackId="b" fill="#ffc658" />
                <Bar dataKey="Nhóm" stackId="b" fill="#ff7300" />
                <Bar dataKey="Tổng" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Phân bố loại cuộc trò chuyện
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            icon={BookOpen}
            title="Bản tin"
            value={data.stories.total}
            subValue={data.stories.avgDailyCount}
          />
          <StatCard
            icon={Eye}
            title="Lượt xem bản tin"
            value={data.storyViews.total}
            subValue={data.storyViews.avgDailyCount}
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationStatistic;
