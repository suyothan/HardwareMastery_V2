import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Swords, Layers, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: 'Arena' },
  { to: '/curriculum', icon: BookOpen, label: 'Study' },
  { to: '/battle', icon: Swords, label: 'Battle' },
  { to: '/cards', icon: Layers, label: 'Cards' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Navigation({ mode }) {
  if (mode === 'sidebar') {
    return (
      <div className="flex flex-col items-center py-3 gap-1 h-full">
        <div className="mb-4 w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-orange-legendary flex items-center justify-center text-lg font-bold text-bg-primary">
          ⚡
        </div>
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              aria-label={item.label}
              className={({ isActive }) =>
                `flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gold/20 text-gold glow-gold'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                }`
              }
              title={item.label}
            >
              <item.icon size={20} aria-hidden="true" />
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  // Bottom bar — thick game-style
  return (
    <div className="flex items-stretch bg-gradient-to-t from-[#1a1f3a] to-[#1e2440] border-t-2 border-gold/20">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          aria-label={item.label}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 transition-all relative ${
              isActive ? 'text-gold' : 'text-text-muted'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold rounded-full"
                  style={{ boxShadow: '0 0 10px #f4a623' }}
                />
              )}
              <item.icon size={20} aria-hidden="true" />
              <span className="text-[9px] font-bold mt-0.5 uppercase tracking-wider">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
