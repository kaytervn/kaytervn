import { useEffect, useState } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Activity,
  Bell,
  UserCheck,
  Calendar,
  TrendingUp,
  Mail,
  Award,
} from "lucide-react";
import useFetch from "../../hooks/useFetch";
import { LoadingDialog } from "../Dialog";

const UserStatistic = () => {
  const INITIAL_STATE = {
    roles: { user: 0, manager: 0, admin: 0 },
    users: {
      active: 0,
      inactive: 0,
      avgDailyCount: { createdAt: 0, lastLogin: 0 },
    },
    notifications: {
      sent: { info: 0, success: 80, fail: 0 },
      read: { info: 0, success: 75, fail: 0 },
      avgDailyCount: 0,
    },
    birthDates: {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      none: 0,
    },
  };

  const [data, setData] = useState<any>(INITIAL_STATE);
  const { get, loading } = useFetch();

  useEffect(() => {
    const fetchData = async () => {
      const res = await get("/v1/statistic/users");
      setData(res.data);
    };
    fetchData();
  }, []);

  const COLORS = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEEAD",
    "#D4A5A5",
    "#9B7EDE",
    "#26547C",
  ];

  const roleNames: any = {
    user: "Người dùng",
    manager: "Quản lý",
    admin: "Quản trị viên",
  };

  const StatCard = ({ icon: Icon, title, value, subValue, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`flex items-center justify-between mb-4`}>
        <div className={`p-3 rounded-full ${color.bg}`}>
          <Icon className={`${color.text}`} size={24} />
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded ${color.badge}`}
        >
          {subValue}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

  const rolesData: any = Object.entries(data.roles).map(
    ([key, value]: any) => ({
      name: (roleNames as any)[key],
      value: value,
    })
  );

  const birthDateData = Object.entries(data.birthDates).map(
    ([month, value]: any) => {
      const totalBirths: any = Object.values(data.birthDates).reduce(
        (sum: any, count: any) => sum + count,
        0
      );
      return {
        month: month.toUpperCase(),
        Số_người: value,
        Tỷ_lệ: ((value / totalBirths) * 100).toFixed(1),
      };
    }
  );

  const notificationData = [
    {
      name: "Thông tin",
      "Đã gửi": data.notifications.sent.info,
      "Đã đọc": data.notifications.read.info,
    },
    {
      name: "Thành công",
      "Đã gửi": data.notifications.sent.success,
      "Đã đọc": data.notifications.read.success,
    },
    {
      name: "Thất bại",
      "Đã gửi": data.notifications.sent.fail,
      "Đã đọc": data.notifications.read.fail,
    },
  ];

  const radarData = [
    { metric: "Người dùng mới", value: data.users.avgDailyCount.createdAt },
    { metric: "Đăng nhập", value: data.users.avgDailyCount.lastLogin },
    { metric: "Thông báo", value: data.notifications.avgDailyCount },
    {
      metric: "Tương tác",
      value: data.notifications.read.info + data.notifications.read.success,
    },
  ];

  if (loading) {
    return <LoadingDialog isVisible={loading} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="whitespace-nowrap text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Các thông số về người dùng
          </h1>
          <p className="text-gray-600 mt-2">
            Phân tích chi tiết và xu hướng người dùng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Tổng số lượng người dùng"
            value={data.users.active}
            subValue="Đang hoạt động"
            color={{
              bg: "bg-blue-100",
              text: "text-blue-600",
              badge: "bg-blue-100 text-blue-800",
            }}
          />
          <StatCard
            icon={UserCheck}
            title="Trung bình người dùng mới"
            value={data.users.avgDailyCount.createdAt}
            subValue="Mỗi ngày"
            color={{
              bg: "bg-green-100",
              text: "text-green-600",
              badge: "bg-green-100 text-green-800",
            }}
          />
          <StatCard
            icon={Bell}
            title="Số lượng thông báo"
            value={
              data.notifications.sent.info + data.notifications.sent.success
            }
            subValue="Tổng đã gửi"
            color={{
              bg: "bg-purple-100",
              text: "text-purple-600",
              badge: "bg-purple-100 text-purple-800",
            }}
          />
          <StatCard
            icon={Activity}
            title="Tỷ lệ tương tác thông báo"
            value={`${(
              ((data.notifications.read.info +
                data.notifications.read.success) /
                (data.notifications.sent.info +
                  data.notifications.sent.success)) *
              100
            ).toFixed(1)}%`}
            subValue="Đọc/Gửi"
            color={{
              bg: "bg-orange-100",
              text: "text-orange-600",
              badge: "bg-orange-100 text-orange-800",
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Award className="mr-2 text-purple-500" />
              Phân bố vai trò
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rolesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rolesData.map((entry: any, index: any) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Calendar className="mr-2 text-green-500" />
              Phân bố sinh nhật
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={birthDateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="Số_người" fill="#8884d8" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="Tỷ_lệ"
                  stroke="#ff7300"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Mail className="mr-2 text-blue-500" />
              Số lượng thông báo
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={notificationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Đã gửi"
                  fill="#8884d8"
                  stroke="#8884d8"
                />
                <Bar dataKey="Đã đọc" fill="#82ca9d" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="mr-2 text-orange-500" />
              Hoạt động hàng ngày
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, "auto"]} />
                <Radar
                  name="Giá trị"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatistic;
