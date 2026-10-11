/**
 * CATÁLOGO CENTRAL DE ICONOS — NOCTIS URBANO
 * 
 * Este archivo centraliza:
 * 1. Iconos SVG personalizados y de marca propia (BrandLogo, Google, Wompi, PSE, Nequi).
 * 2. Exportaciones semánticas unificadas para el portal Cliente y Administrador.
 */

// 1. Iconos Personalizados y de Marca
export { GoogleIcon } from './GoogleIcon';
export { default as BrandLogoIcon } from './BrandLogoIcon';
export { default as WompiLogoIcon } from './WompiLogoIcon';
export { default as PseLogoIcon } from './PseLogoIcon';
export { default as NequiLogoIcon } from './NequiLogoIcon';
export { TargetIcon, PackageIcon, TruckIcon, EyeIcon, HelpInfoIcon } from './CustomIcons';
export * from './types';

// 2. Exportación de Lucide React con Nombres Semánticos Estandarizados
export {
  // Navegación & Acciones Generales
  X as CloseIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  ShoppingBag as CartIcon,
  User as UserIcon,
  LogOut as LogoutIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Edit3 as EditIcon,
  Trash2 as TrashIcon,
  RefreshCw as RefreshIcon,
  Copy as CopyIcon,
  ExternalLink as ExternalLinkIcon,
  Link2 as LinkIcon,
  Maximize2 as MaximizeIcon,
  Minimize2 as MinimizeIcon,

  // Logística & Comercio
  Package as OrderIcon,
  Truck as ShippingIcon,
  Tag as CouponIcon,
  DollarSign as CurrencyIcon,
  CreditCard as PaymentCardIcon,
  ShieldCheck as SecurityIcon,
  Lock as LockIcon,
  Unlock as UnlockIcon,

  // Administración & Métricas
  Layers as InventoryIcon,
  TrendingUp as TrendingIcon,
  BarChart3 as AnalyticsIcon,
  Flame as HotSalesIcon,
  Eye as ViewsIcon,
  Trophy as TrophyIcon,
  Zap as HighInterestIcon,
  Activity as ActivityIcon,
  Users as CustomersIcon,
  Settings as SettingsIcon,
  Database as DatabaseIcon,
  Server as ServerIcon,
  FileSpreadsheet as CsvExportIcon,

  // Feedback & Notificaciones
  CheckCircle2 as SuccessIcon,
  AlertTriangle as WarningIcon,
  Clock as PendingIcon,
  Sparkles as SparklesIcon,
  Bot as AiBotIcon,
  Send as SendIcon,
  Star as StarIcon,
  ThumbsUp as LikeIcon,
  MapPin as MapPinIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MessageCircle as WhatsappIcon,
  MessageSquare as PqrsIcon,
  RotateCcw as ReturnRefundIcon
} from 'lucide-react';
