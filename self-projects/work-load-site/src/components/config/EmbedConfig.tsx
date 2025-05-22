import {
  BracesIcon,
  CookieIcon,
  FilesIcon,
  GoalIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  PlayIcon,
  RocketIcon,
  VideoIcon,
} from "lucide-react";

const BASE_EMBED_URL = "https://kaytervn.github.io/kaytervn/static/";

const EMBED_LIST = [
  {
    label: "Caro Online",
    path: "/caro",
    icon: LayoutDashboardIcon,
    color: "#3F51B5",
    url: BASE_EMBED_URL + "caro",
  },
  {
    label: "Color",
    path: "/color",
    icon: PaletteIcon,
    color: "#4DB6AC",
    url: BASE_EMBED_URL + "color",
  },
  {
    label: "COOKIEDU Demo",
    path: "/cookiedu",
    icon: CookieIcon,
    color: "#81C784",
    url: BASE_EMBED_URL + "cookiedu",
  },
  {
    label: "Dev Notes",
    path: "/dev-notes",
    icon: FilesIcon,
    color: "#64B5F6",
    url: BASE_EMBED_URL + "dev-notes",
  },
  {
    label: "Ducky vs Pengy",
    path: "/ducky-vs-pengy",
    icon: PlayIcon,
    color: "#9575CD",
    url: BASE_EMBED_URL + "ducky-vs-pengy",
  },
  {
    label: "FPS Game Demo",
    path: "/fps-game",
    icon: GoalIcon,
    color: "#E57373",
    url: BASE_EMBED_URL + "fps-game",
  },
  {
    label: "Socket Client",
    path: "/socket-client",
    icon: RocketIcon,
    color: "#BA68C8",
    url: BASE_EMBED_URL + "socket-client",
  },
  {
    label: "JSON Tool",
    path: "/json-tool",
    icon: BracesIcon,
    color: "#C8A165",
    url: BASE_EMBED_URL + "json-tool",
  },
  {
    label: "Web RTC Demo",
    path: "/web-rtc",
    icon: VideoIcon,
    color: "#FBC02D",
    url: BASE_EMBED_URL + "web-rtc",
  },
];

export { EMBED_LIST };
