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
      <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible', flexShrink: 0 }}>
        <circle cx="10" cy="10" r="9" fill="currentColor" />
        <path d="M10 6V14M6 10H14" stroke="var(--brand-app-bg-hex, white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  return IconComponent ? <IconComponent size={20} /> : null;
}; 