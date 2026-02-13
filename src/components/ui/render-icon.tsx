import {
  BarChart2 as Performance,
  CalendarDays as BookingCalendar,
  ImagePlus as Creatives,
  MonitorPlay as Display,
  Settings2 as Yield,
  Table as Campaigns,
  Home,
  User,
  Settings,
  Settings2,
  FileText,
  Users,
  ShoppingCart,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Table,
  ImagePlus,
  CalendarDays,
  ChartNoAxesColumn,
  LayoutDashboard,
  MessageSquare,
  MessageCircle,
  MessageCirclePlus,
  MonitorSpeaker,
  ListStart,
  MonitorPlay,
  Store,
  WalletCards,
} from 'lucide-react';
import { OrganisationsIcon, BrandsIcon } from './custom-icons';

export const renderIcon = (icon: string) => {
  // Special case: Create icon is a solid circle with a Plus icon
  if (icon === 'CreateIcon') {
    return (
      <svg width={34} height={34} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="17" cy="17" r="17" fill="currentColor" />
        <path d="M17 10V24M10 17H24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  const icons = {
    Display,
    Campaigns,
    Creatives,
    BookingCalendar,
    Performance,
    Yield,
    Home,
    User,
    Settings,
    Settings2,
    FileText,
    Users,
    ShoppingCart,
    BarChart3,
    PieChart,
    TrendingUp,
    Activity,
    Table,
    ImagePlus,
    CalendarDays,
    ChartNoAxesColumn,
    LayoutDashboard,
    MessageSquare,
    MessageCircle,
    MessageCirclePlus,
    MonitorSpeaker,
    ListStart,
    MonitorPlay,
    Store,
    WalletCards,
    OrganisationsIcon,
    BrandsIcon,
  };
  const IconComponent = icons[icon as keyof typeof icons];
  return IconComponent ? <IconComponent className="p-2" size={36} /> : null;
}; 