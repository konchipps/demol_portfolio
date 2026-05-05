import {
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  Disc,
  Globe,
  Music2,
  Send
} from "lucide-react";
import { FaSnapchatGhost } from "react-icons/fa";
import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
  FaRedditAlien,
  FaTelegram,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube
} from "react-icons/fa6";

const socialIconDefinitions = [
  { value: "github", label: "GitHub", component: FaGithub },
  { value: "linkedin", label: "LinkedIn", component: FaLinkedinIn },
  { value: "facebook", label: "Facebook", component: FaFacebookF },
  { value: "instagram", label: "Instagram", component: FaInstagram },
  { value: "x", label: "X / Twitter", component: FaXTwitter },
  { value: "youtube", label: "YouTube", component: FaYoutube },
  { value: "tiktok", label: "TikTok", component: FaTiktok },
  { value: "discord", label: "Discord", component: FaDiscord },
  { value: "whatsapp", label: "WhatsApp", component: FaWhatsapp },
  { value: "telegram", label: "Telegram", component: FaTelegram },
  { value: "twitch", label: "Twitch", component: FaTwitch },
  { value: "dribbble", label: "Dribbble", component: FaDribbble },
  { value: "behance", label: "Behance", component: FaBehance },
  { value: "pinterest", label: "Pinterest", component: FaPinterestP },
  { value: "reddit", label: "Reddit", component: FaRedditAlien },
  { value: "snapchat", label: "Snapchat", component: FaSnapchatGhost },
  { value: "portfolio", label: "Portfolio", component: BriefcaseBusiness },
  { value: "website", label: "Website", component: Globe },
  { value: "email", label: "Email", component: Send },
  { value: "photography", label: "Photography", component: Camera },
  { value: "music", label: "Music", component: Music2 },
  { value: "podcast", label: "Podcast", component: Disc }
];

const socialIcons = Object.fromEntries(
  socialIconDefinitions.map((definition) => [definition.value, definition.component])
);

const socialIconAliases = {
  behance: "behance",
  discord: "discord",
  dribbble: "dribbble",
  email: "email",
  facebook: "facebook",
  figma: "portfolio",
  github: "github",
  instagram: "instagram",
  linkedin: "linkedin",
  medium: "website",
  music: "music",
  photography: "photography",
  pinterest: "pinterest",
  podcast: "podcast",
  portfolio: "portfolio",
  reddit: "reddit",
  snapchat: "snapchat",
  telegram: "telegram",
  threads: "instagram",
  tiktok: "tiktok",
  twitch: "twitch",
  twitter: "x",
  website: "website",
  whatsapp: "whatsapp",
  x: "x",
  youtube: "youtube"
};

export const socialIconOptions = socialIconDefinitions.map(({ value, label }) => ({
  value,
  label
}));

export const normalizeSocialIconKey = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  return socialIconAliases[normalized] || "";
};

export const getSocialIcon = (value) => {
  const key = normalizeSocialIconKey(value);
  return socialIcons[key] || ArrowUpRight;
};

export const getSocialIconLabel = (value) => {
  const key = normalizeSocialIconKey(value);
  return socialIconDefinitions.find((definition) => definition.value === key)?.label || "Custom";
};
