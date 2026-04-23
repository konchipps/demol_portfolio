import {
  BriefcaseBusiness,
  CodeXml,
  Globe,
  LayoutDashboard,
  MonitorSmartphone,
  Palette,
  PenTool,
  Rocket
} from "lucide-react";

export const serviceIcons = {
  Palette,
  LayoutDashboard,
  CodeXml,
  BriefcaseBusiness,
  Globe,
  MonitorSmartphone,
  PenTool,
  Rocket
};

export const getServiceIcon = (iconName) =>
  serviceIcons[iconName] || LayoutDashboard;

export const serviceIconOptions = Object.keys(serviceIcons);
