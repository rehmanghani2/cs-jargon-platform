import { Link } from 'react-router-dom';
import { FiCode, FiGithub, FiTwitter, FiLinkedin, FiMail, FiHeart, FiGlobe, FiBookOpen } from 'react-icons/fi';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Courses', path: '/courses' },
      { name: 'Jargon Library', path: '/jargon' },
      { name: 'Resources', path: '/resources' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Community', path: '/community' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Accessibility', path: '/accessibility' },
    ],
  };

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FiMail, href: 'mailto:contact@csjargon.com', label: 'Email' },
  ];

  return (
    <footer className="relative bg-slate-900 dark:bg-gray-950 text-gray-300 border-t border-gray-800 mt-auto overflow-hidden">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-indigo-500 to-purple-500" />

      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column (Spans 2 on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <FiCode className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-black text-white tracking-tight">
                  CS Jargon Platform
                </span>
                <span className="text-xs text-primary-400 font-semibold tracking-wide">
                  PAF-IAST Academic Study Project
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Empowering Computer Science students with precise jargon fluency, interactive quizzes, automated placement tests, and verifiable certificates.
            </p>

            {/* Academic Case Study Tag */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md max-w-sm">
              <div className="flex items-center gap-2.5 text-xs text-indigo-300 font-medium">
                <FiBookOpen className="w-4 h-4 text-emerald-400" />
                <span>Impact of Mobile-Assisted Language Learning</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Case Study of CS Students at Pak-Austria Fachhochschule (PAF-IAST).
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-primary-600/30 hover:border-primary-500/40 hover:scale-110 transition-all duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Platform
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-xs opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 text-primary-400 transition-all">→</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Support
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-xs opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 text-emerald-400 transition-all">→</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Legal & Policy
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-xs opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 text-purple-400 transition-all">→</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <FiGlobe className="w-4 h-4 text-primary-400" />
            <span>© {currentYear} CS Jargon Learning Platform. PAF-IAST Case Study.</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400">
            <span>Designed & Built with</span>
            <FiHeart className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" />
            <span>for CS Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;