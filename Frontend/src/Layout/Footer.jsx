import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
  Heart,
} from "lucide-react";
import Logo from "../assets/Logo.png"

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "New Arrivals", href: "#" },
      { name: "Best Sellers", href: "#" },
      { name: "Sale Items", href: "#" },
      { name: "Gift Cards", href: "#" },
      { name: "Collections", href: "#" },
    ],
    support: [
      { name: "Contact Us", href: "#" },
      { name: "Size Guide", href: "#" },
      { name: "Shipping Info", href: "#" },
      { name: "Returns", href: "#" },
      { name: "FAQ", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Sustainability", href: "#" },
      { name: "Affiliate Program", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Accessibility", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $99" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
    { icon: Shield, title: "Secure Payment", desc: "100% secure checkout" },
    { icon: Phone, title: "24/7 Support", desc: "Dedicated support team" },
  ];

  return (
    <footer className="bg-white text-gray-900">
      {/* Features Section */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex justify-center align-center h-[40px] overflow-hidden">
                <img src={ Logo } className="h-[230px] my-[-90px]" />
              </div>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Discover premium fashion and lifestyle products curated for the
              modern individual. Quality, style, and innovation in every piece.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-500">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">
                  123 Fashion Ave, Style City, SC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">hello@modex.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-medium text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex items-center space-x-2 text-gray-700 font-medium text-sm">
              <span>© {currentYear} Modex. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by our team.</span>
            </div>

            {/* Payment Methods */}
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium text-sm">
                  We accept:
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <CreditCard className="w-4 h-3 text-white" />
                  </div>
                  <div className="w-8 h-5 bg-red-600 rounded"></div>
                  <div className="w-8 h-5 bg-yellow-500 rounded"></div>
                  <div className="w-8 h-5 bg-purple-600 rounded"></div>
                  <div className="w-8 h-5 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
