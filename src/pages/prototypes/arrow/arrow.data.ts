// ── Types ──────────────────────────────────────────────────────────────────

export type OrderStatus = "delivered" | "active" | "delayed" | "failed" | "pending";
export type DriverStatus = "active" | "delayed" | "idle";
export type Zone = "all" | "dubai-marina" | "business-bay" | "downtown" | "difc" | "jbr" | "deira" | "al-barsha";

export interface TimelineEvent {
  event: string;
  time: string;
  done: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  phone: string;
  address: string;
  zone: Zone;
  status: OrderStatus;
  driverId: string;
  time: string;
  deliveryWindow: string;
  items: number;
  total: string;
  notes?: string;
  timeline: TimelineEvent[];
}

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  vehicle: string;
  phone: string;
  status: DriverStatus;
  ordersCompleted: number;
  ordersTotal: number;
  avgDeliveryTime: string;
  rating: number;
  eta?: string;
  location: { x: number; y: number };
  route: { x: number; y: number }[];
  zone: Zone;
}

export interface ZoneInfo {
  id: Zone;
  label: string;
  center: { x: number; y: number };
}

// ── Zones ──────────────────────────────────────────────────────────────────

export const zones: ZoneInfo[] = [
  { id: "all", label: "All Zones", center: { x: 50, y: 50 } },
  { id: "dubai-marina", label: "Dubai Marina", center: { x: 15, y: 20 } },
  { id: "jbr", label: "JBR", center: { x: 28, y: 15 } },
  { id: "business-bay", label: "Business Bay", center: { x: 52, y: 48 } },
  { id: "downtown", label: "Downtown", center: { x: 40, y: 65 } },
  { id: "difc", label: "DIFC", center: { x: 72, y: 30 } },
  { id: "deira", label: "Deira", center: { x: 85, y: 70 } },
  { id: "al-barsha", label: "Al Barsha", center: { x: 25, y: 80 } },
];

// ── Drivers ────────────────────────────────────────────────────────────────

export const drivers: Driver[] = [
  {
    id: "d1",
    name: "Rashid Al-Hamdan",
    avatar: "RA",
    vehicle: "Van — DXB 4521",
    phone: "+971 55 812 3401",
    status: "active",
    ordersCompleted: 8,
    ordersTotal: 12,
    avgDeliveryTime: "18 min",
    rating: 4.8,
    eta: "14 min",
    location: { x: 35, y: 28 },
    route: [
      { x: 35, y: 28 }, { x: 30, y: 22 }, { x: 22, y: 18 }, { x: 18, y: 22 },
      { x: 15, y: 28 }, { x: 20, y: 35 },
    ],
    zone: "dubai-marina",
  },
  {
    id: "d2",
    name: "Carlos Mendez",
    avatar: "CM",
    vehicle: "Van — DXB 7823",
    phone: "+971 50 443 7812",
    status: "active",
    ordersCompleted: 6,
    ordersTotal: 10,
    avgDeliveryTime: "22 min",
    rating: 4.6,
    eta: "8 min",
    location: { x: 62, y: 45 },
    route: [
      { x: 62, y: 45 }, { x: 58, y: 50 }, { x: 52, y: 48 }, { x: 48, y: 52 },
      { x: 45, y: 58 },
    ],
    zone: "business-bay",
  },
  {
    id: "d3",
    name: "Amir Patel",
    avatar: "AP",
    vehicle: "Bike — DXB 0142",
    phone: "+971 52 991 5503",
    status: "delayed",
    ordersCompleted: 3,
    ordersTotal: 8,
    avgDeliveryTime: "28 min",
    rating: 4.3,
    eta: "23 min",
    location: { x: 48, y: 67 },
    route: [
      { x: 48, y: 67 }, { x: 44, y: 62 }, { x: 40, y: 65 }, { x: 38, y: 70 },
      { x: 42, y: 75 },
    ],
    zone: "downtown",
  },
  {
    id: "d4",
    name: "Yuki Tanaka",
    avatar: "YT",
    vehicle: "Van — DXB 9156",
    phone: "+971 55 227 8864",
    status: "active",
    ordersCompleted: 11,
    ordersTotal: 14,
    avgDeliveryTime: "15 min",
    rating: 4.9,
    eta: "5 min",
    location: { x: 78, y: 32 },
    route: [
      { x: 78, y: 32 }, { x: 74, y: 28 }, { x: 70, y: 30 }, { x: 68, y: 35 },
      { x: 72, y: 38 },
    ],
    zone: "difc",
  },
  {
    id: "d5",
    name: "Mohamed Farid",
    avatar: "MF",
    vehicle: "Bike — DXB 3387",
    phone: "+971 56 118 2290",
    status: "idle",
    ordersCompleted: 9,
    ordersTotal: 9,
    avgDeliveryTime: "20 min",
    rating: 4.7,
    location: { x: 22, y: 55 },
    route: [],
    zone: "jbr",
  },
  {
    id: "d6",
    name: "Omar Haddad",
    avatar: "OH",
    vehicle: "Van — DXB 6612",
    phone: "+971 50 334 9921",
    status: "active",
    ordersCompleted: 5,
    ordersTotal: 11,
    avgDeliveryTime: "19 min",
    rating: 4.5,
    eta: "11 min",
    location: { x: 82, y: 68 },
    route: [
      { x: 82, y: 68 }, { x: 85, y: 72 }, { x: 88, y: 68 }, { x: 86, y: 64 },
      { x: 83, y: 60 },
    ],
    zone: "deira",
  },
  {
    id: "d7",
    name: "Fatima Noor",
    avatar: "FN",
    vehicle: "Bike — DXB 1198",
    phone: "+971 52 887 4430",
    status: "active",
    ordersCompleted: 7,
    ordersTotal: 10,
    avgDeliveryTime: "16 min",
    rating: 4.8,
    eta: "9 min",
    location: { x: 28, y: 78 },
    route: [
      { x: 28, y: 78 }, { x: 25, y: 82 }, { x: 22, y: 78 }, { x: 20, y: 74 },
    ],
    zone: "al-barsha",
  },
];

// ── Orders ─────────────────────────────────────────────────────────────────

export const orders: Order[] = [
  {
    id: "o1", orderNumber: "ORD-4821", customer: "Sara Ahmed", phone: "+971 55 100 2001",
    address: "Dubai Marina, Tower 3, Apt 1204", zone: "dubai-marina",
    status: "active", driverId: "d1", time: "12:34", deliveryWindow: "12:30 – 13:00",
    items: 3, total: "AED 124.00",
    timeline: [
      { event: "Order placed", time: "12:18", done: true },
      { event: "Driver assigned", time: "12:22", done: true },
      { event: "Picked up", time: "12:34", done: true },
      { event: "In transit", time: "12:34", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o2", orderNumber: "ORD-4822", customer: "John Smith", phone: "+971 50 200 3002",
    address: "JBR Walk, Building 5, Unit 803", zone: "jbr",
    status: "active", driverId: "d2", time: "12:38", deliveryWindow: "12:30 – 13:00",
    items: 1, total: "AED 45.50",
    timeline: [
      { event: "Order placed", time: "12:25", done: true },
      { event: "Driver assigned", time: "12:30", done: true },
      { event: "Picked up", time: "12:38", done: true },
      { event: "In transit", time: "12:38", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o3", orderNumber: "ORD-4819", customer: "Layla Hassan", phone: "+971 52 300 4003",
    address: "Business Bay, The Opus, Floor 12", zone: "business-bay",
    status: "delayed", driverId: "d3", time: "12:15", deliveryWindow: "12:00 – 12:30",
    items: 5, total: "AED 289.00", notes: "Customer requested contactless delivery",
    timeline: [
      { event: "Order placed", time: "11:42", done: true },
      { event: "Driver assigned", time: "11:50", done: true },
      { event: "Picked up", time: "12:05", done: true },
      { event: "In transit", time: "12:15", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o4", orderNumber: "ORD-4823", customer: "David Park", phone: "+971 55 400 5004",
    address: "DIFC, Gate Village 4, Office 301", zone: "difc",
    status: "active", driverId: "d4", time: "12:42", deliveryWindow: "12:30 – 13:00",
    items: 2, total: "AED 78.00",
    timeline: [
      { event: "Order placed", time: "12:28", done: true },
      { event: "Driver assigned", time: "12:32", done: true },
      { event: "Picked up", time: "12:42", done: true },
      { event: "In transit", time: "12:42", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o5", orderNumber: "ORD-4818", customer: "Amina Khalil", phone: "+971 56 500 6005",
    address: "Downtown, Burj Residences, Tower 2", zone: "downtown",
    status: "delivered", driverId: "d5", time: "12:10", deliveryWindow: "12:00 – 12:30",
    items: 4, total: "AED 195.00",
    timeline: [
      { event: "Order placed", time: "11:30", done: true },
      { event: "Driver assigned", time: "11:35", done: true },
      { event: "Picked up", time: "11:48", done: true },
      { event: "In transit", time: "11:48", done: true },
      { event: "Delivered", time: "12:10", done: true },
    ],
  },
  {
    id: "o6", orderNumber: "ORD-4817", customer: "Alex Turner", phone: "+971 50 600 7006",
    address: "Al Barsha, Mall of Emirates Rd", zone: "al-barsha",
    status: "delivered", driverId: "d1", time: "11:58", deliveryWindow: "11:30 – 12:00",
    items: 2, total: "AED 67.50",
    timeline: [
      { event: "Order placed", time: "11:10", done: true },
      { event: "Driver assigned", time: "11:15", done: true },
      { event: "Picked up", time: "11:28", done: true },
      { event: "In transit", time: "11:28", done: true },
      { event: "Delivered", time: "11:58", done: true },
    ],
  },
  {
    id: "o7", orderNumber: "ORD-4816", customer: "Priya Nair", phone: "+971 52 700 8007",
    address: "Jumeirah, Beach Road Villa 14", zone: "jbr",
    status: "delivered", driverId: "d2", time: "11:45", deliveryWindow: "11:30 – 12:00",
    items: 1, total: "AED 32.00",
    timeline: [
      { event: "Order placed", time: "11:05", done: true },
      { event: "Driver assigned", time: "11:10", done: true },
      { event: "Picked up", time: "11:22", done: true },
      { event: "In transit", time: "11:22", done: true },
      { event: "Delivered", time: "11:45", done: true },
    ],
  },
  {
    id: "o8", orderNumber: "ORD-4815", customer: "Omar Sayed", phone: "+971 55 800 9008",
    address: "Deira, Gold Souk Area, Shop 42", zone: "deira",
    status: "failed", driverId: "d3", time: "11:30", deliveryWindow: "11:00 – 11:30",
    items: 3, total: "AED 156.00", notes: "Customer unreachable — 3 call attempts",
    timeline: [
      { event: "Order placed", time: "10:40", done: true },
      { event: "Driver assigned", time: "10:45", done: true },
      { event: "Picked up", time: "11:02", done: true },
      { event: "In transit", time: "11:02", done: true },
      { event: "Delivery failed", time: "11:30", done: true },
    ],
  },
  {
    id: "o9", orderNumber: "ORD-4824", customer: "Nadia Mansour", phone: "+971 50 111 2233",
    address: "Dubai Marina, Pinnacle Tower, Apt 502", zone: "dubai-marina",
    status: "active", driverId: "d1", time: "12:48", deliveryWindow: "12:30 – 13:00",
    items: 2, total: "AED 88.00",
    timeline: [
      { event: "Order placed", time: "12:32", done: true },
      { event: "Driver assigned", time: "12:38", done: true },
      { event: "Picked up", time: "12:48", done: true },
      { event: "In transit", time: "12:48", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o10", orderNumber: "ORD-4825", customer: "James Wilson", phone: "+971 55 222 3344",
    address: "DIFC, Liberty House, Floor 8", zone: "difc",
    status: "active", driverId: "d4", time: "12:50", deliveryWindow: "12:45 – 13:15",
    items: 1, total: "AED 52.00",
    timeline: [
      { event: "Order placed", time: "12:35", done: true },
      { event: "Driver assigned", time: "12:40", done: true },
      { event: "Picked up", time: "12:50", done: true },
      { event: "In transit", time: "12:50", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o11", orderNumber: "ORD-4826", customer: "Zara Khan", phone: "+971 52 333 4455",
    address: "Business Bay, Executive Towers, T-F", zone: "business-bay",
    status: "active", driverId: "d2", time: "12:52", deliveryWindow: "12:45 – 13:15",
    items: 4, total: "AED 210.00",
    timeline: [
      { event: "Order placed", time: "12:38", done: true },
      { event: "Driver assigned", time: "12:42", done: true },
      { event: "Picked up", time: "12:52", done: true },
      { event: "In transit", time: "12:52", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o12", orderNumber: "ORD-4827", customer: "Ali Reza", phone: "+971 56 444 5566",
    address: "Downtown, Boulevard Walk, Unit 1401", zone: "downtown",
    status: "delayed", driverId: "d3", time: "12:20", deliveryWindow: "12:00 – 12:30",
    items: 6, total: "AED 342.00", notes: "Heavy order — requires two trips",
    timeline: [
      { event: "Order placed", time: "11:48", done: true },
      { event: "Driver assigned", time: "11:55", done: true },
      { event: "Picked up", time: "12:10", done: true },
      { event: "In transit", time: "12:20", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o13", orderNumber: "ORD-4828", customer: "Maria Santos", phone: "+971 50 555 6677",
    address: "Al Barsha, Arjan, Miracle Garden Rd", zone: "al-barsha",
    status: "active", driverId: "d7", time: "12:55", deliveryWindow: "12:45 – 13:15",
    items: 2, total: "AED 94.00",
    timeline: [
      { event: "Order placed", time: "12:40", done: true },
      { event: "Driver assigned", time: "12:44", done: true },
      { event: "Picked up", time: "12:55", done: true },
      { event: "In transit", time: "12:55", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o14", orderNumber: "ORD-4829", customer: "Hassan Ali", phone: "+971 55 666 7788",
    address: "Deira, Al Rigga Street, Bldg 7", zone: "deira",
    status: "active", driverId: "d6", time: "12:58", deliveryWindow: "12:45 – 13:15",
    items: 3, total: "AED 145.00",
    timeline: [
      { event: "Order placed", time: "12:42", done: true },
      { event: "Driver assigned", time: "12:48", done: true },
      { event: "Picked up", time: "12:58", done: true },
      { event: "In transit", time: "12:58", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o15", orderNumber: "ORD-4830", customer: "Lina Haddad", phone: "+971 52 777 8899",
    address: "Dubai Marina, Bay Central, Apt 2205", zone: "dubai-marina",
    status: "delivered", driverId: "d1", time: "11:40", deliveryWindow: "11:15 – 11:45",
    items: 1, total: "AED 28.00",
    timeline: [
      { event: "Order placed", time: "10:55", done: true },
      { event: "Driver assigned", time: "11:00", done: true },
      { event: "Picked up", time: "11:15", done: true },
      { event: "In transit", time: "11:15", done: true },
      { event: "Delivered", time: "11:40", done: true },
    ],
  },
  {
    id: "o16", orderNumber: "ORD-4831", customer: "Wei Chen", phone: "+971 50 888 9900",
    address: "Business Bay, Damac Towers, Unit 908", zone: "business-bay",
    status: "delivered", driverId: "d4", time: "11:20", deliveryWindow: "11:00 – 11:30",
    items: 2, total: "AED 112.00",
    timeline: [
      { event: "Order placed", time: "10:42", done: true },
      { event: "Driver assigned", time: "10:48", done: true },
      { event: "Picked up", time: "11:00", done: true },
      { event: "In transit", time: "11:00", done: true },
      { event: "Delivered", time: "11:20", done: true },
    ],
  },
  {
    id: "o17", orderNumber: "ORD-4832", customer: "Reem Al-Falasi", phone: "+971 55 999 0011",
    address: "Downtown, Address Blvd, Penthouse 1", zone: "downtown",
    status: "delivered", driverId: "d5", time: "11:55", deliveryWindow: "11:30 – 12:00",
    items: 3, total: "AED 178.00",
    timeline: [
      { event: "Order placed", time: "11:12", done: true },
      { event: "Driver assigned", time: "11:18", done: true },
      { event: "Picked up", time: "11:30", done: true },
      { event: "In transit", time: "11:30", done: true },
      { event: "Delivered", time: "11:55", done: true },
    ],
  },
  {
    id: "o18", orderNumber: "ORD-4833", customer: "Tariq Bashir", phone: "+971 56 010 1122",
    address: "Deira, Naif Road, Al Ghurair Centre", zone: "deira",
    status: "delivered", driverId: "d6", time: "11:35", deliveryWindow: "11:00 – 11:30",
    items: 2, total: "AED 63.00",
    timeline: [
      { event: "Order placed", time: "10:48", done: true },
      { event: "Driver assigned", time: "10:52", done: true },
      { event: "Picked up", time: "11:05", done: true },
      { event: "In transit", time: "11:05", done: true },
      { event: "Delivered", time: "11:35", done: true },
    ],
  },
  {
    id: "o19", orderNumber: "ORD-4834", customer: "Sofia Petrov", phone: "+971 50 121 2233",
    address: "JBR, Shams Tower 1, Apt 1506", zone: "jbr",
    status: "pending", driverId: "", time: "13:02", deliveryWindow: "13:00 – 13:30",
    items: 2, total: "AED 76.00",
    timeline: [
      { event: "Order placed", time: "13:02", done: true },
      { event: "Driver assigned", time: "—", done: false },
      { event: "Picked up", time: "—", done: false },
      { event: "In transit", time: "—", done: false },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o20", orderNumber: "ORD-4835", customer: "Khalid Nasser", phone: "+971 52 232 3344",
    address: "Al Barsha, Ibn Battuta Gate", zone: "al-barsha",
    status: "pending", driverId: "", time: "13:05", deliveryWindow: "13:00 – 13:30",
    items: 1, total: "AED 38.00",
    timeline: [
      { event: "Order placed", time: "13:05", done: true },
      { event: "Driver assigned", time: "—", done: false },
      { event: "Picked up", time: "—", done: false },
      { event: "In transit", time: "—", done: false },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o21", orderNumber: "ORD-4836", customer: "Emma O'Brien", phone: "+971 55 343 4455",
    address: "DIFC, Index Tower, Floor 15", zone: "difc",
    status: "active", driverId: "d4", time: "13:00", deliveryWindow: "13:00 – 13:30",
    items: 3, total: "AED 185.00",
    timeline: [
      { event: "Order placed", time: "12:44", done: true },
      { event: "Driver assigned", time: "12:50", done: true },
      { event: "Picked up", time: "13:00", done: true },
      { event: "In transit", time: "13:00", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o22", orderNumber: "ORD-4837", customer: "Dmitry Volkov", phone: "+971 50 454 5566",
    address: "Dubai Marina, Silverene Tower, Apt 710", zone: "dubai-marina",
    status: "delivered", driverId: "d7", time: "11:48", deliveryWindow: "11:30 – 12:00",
    items: 5, total: "AED 267.00",
    timeline: [
      { event: "Order placed", time: "11:08", done: true },
      { event: "Driver assigned", time: "11:12", done: true },
      { event: "Picked up", time: "11:25", done: true },
      { event: "In transit", time: "11:25", done: true },
      { event: "Delivered", time: "11:48", done: true },
    ],
  },
  {
    id: "o23", orderNumber: "ORD-4838", customer: "Aisha Mohammed", phone: "+971 56 565 6677",
    address: "Downtown, Vida Hotel Residences", zone: "downtown",
    status: "active", driverId: "d3", time: "13:02", deliveryWindow: "13:00 – 13:30",
    items: 2, total: "AED 92.00",
    timeline: [
      { event: "Order placed", time: "12:48", done: true },
      { event: "Driver assigned", time: "12:52", done: true },
      { event: "Picked up", time: "13:02", done: true },
      { event: "In transit", time: "13:02", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o24", orderNumber: "ORD-4839", customer: "Kim Soo-Jin", phone: "+971 52 676 7788",
    address: "Al Barsha, Barsha Heights, Tecom", zone: "al-barsha",
    status: "active", driverId: "d7", time: "13:04", deliveryWindow: "13:00 – 13:30",
    items: 1, total: "AED 41.00",
    timeline: [
      { event: "Order placed", time: "12:50", done: true },
      { event: "Driver assigned", time: "12:55", done: true },
      { event: "Picked up", time: "13:04", done: true },
      { event: "In transit", time: "13:04", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o25", orderNumber: "ORD-4840", customer: "Faisal Qureshi", phone: "+971 55 787 8899",
    address: "Deira, Clock Tower Area, Bldg 3", zone: "deira",
    status: "active", driverId: "d6", time: "13:06", deliveryWindow: "13:00 – 13:30",
    items: 4, total: "AED 198.00",
    timeline: [
      { event: "Order placed", time: "12:52", done: true },
      { event: "Driver assigned", time: "12:58", done: true },
      { event: "Picked up", time: "13:06", done: true },
      { event: "In transit", time: "13:06", done: true },
      { event: "Delivered", time: "—", done: false },
    ],
  },
];

// ── Activity Feed ──────────────────────────────────────────────────────────

export interface ActivityEvent {
  id: string;
  type: "delivered" | "picked_up" | "assigned" | "delayed" | "failed";
  message: string;
  time: string;
}

export const activityFeed: ActivityEvent[] = [
  { id: "a1", type: "delivered", message: "Rashid delivered ORD-4830 to Dubai Marina", time: "2m ago" },
  { id: "a2", type: "picked_up", message: "Carlos picked up ORD-4826 from warehouse", time: "5m ago" },
  { id: "a3", type: "delayed", message: "Amir delayed on ORD-4819 — traffic on SZR", time: "8m ago" },
  { id: "a4", type: "assigned", message: "ORD-4835 awaiting driver assignment", time: "10m ago" },
  { id: "a5", type: "delivered", message: "Yuki delivered ORD-4831 to Business Bay", time: "12m ago" },
  { id: "a6", type: "failed", message: "ORD-4815 delivery failed — customer unreachable", time: "15m ago" },
  { id: "a7", type: "delivered", message: "Mohamed delivered ORD-4818 to Downtown", time: "18m ago" },
  { id: "a8", type: "picked_up", message: "Fatima picked up ORD-4828 from warehouse", time: "20m ago" },
  { id: "a9", type: "assigned", message: "Omar assigned to ORD-4829 in Deira", time: "22m ago" },
  { id: "a10", type: "delivered", message: "Omar delivered ORD-4833 to Deira", time: "25m ago" },
];

// ── Computed stats ─────────────────────────────────────────────────────────

export const stats = {
  totalOrders: orders.length,
  delivered: orders.filter((o) => o.status === "delivered").length,
  active: orders.filter((o) => o.status === "active").length,
  delayed: orders.filter((o) => o.status === "delayed").length,
  failed: orders.filter((o) => o.status === "failed").length,
  pending: orders.filter((o) => o.status === "pending").length,
  avgDeliveryTime: "19 min",
  completionRate: Math.round((orders.filter((o) => o.status === "delivered").length / orders.length) * 100),
};
