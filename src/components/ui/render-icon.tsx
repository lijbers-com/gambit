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
} from 'lucide-react';

export const renderIcon = (icon: string) => {
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
  };
  const IconComponent = icons[icon as keyof typeof icons];
  return IconComponent ? <IconComponent className="p-2" size={40} /> : null;
}; 