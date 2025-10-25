import React, { useState } from 'react';
import { ChevronDoubleLeftIcon } from '../icons/ChevronDoubleLeftIcon';
import { SwitchHorizontalIcon } from '../icons/SwitchHorizontalIcon';
import { XIcon } from '../icons/XIcon';

export interface MenuItem {
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  menuItems: MenuItem[];
  onRoleChange: () => void;
  activeItemLabel: string;
  onMenuItemSelect: (label: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, onRoleChange, activeItemLabel, onMenuItemSelect, isMobileOpen, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // On desktop, the sidebar is collapsed if the state is true. On mobile, it's never visually collapsed.
  const desktopCollapsed = isCollapsed && !isMobileOpen;

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onMobileClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar Container */}
      <aside 
        className={`bg-primary-darker text-text-on-primary flex flex-col h-screen
          fixed inset-y-0 left-0 z-30
          md:relative md:h-auto
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
          md:translate-x-0 ${isCollapsed ? 'md:w-20' : 'md:w-64'}`
        }
        aria-label="Main navigation"
      >
        <div className={`flex items-center h-16 border-b border-primary-subtle px-4 ${desktopCollapsed ? 'justify-center' : 'justify-between'}`}>
          {/* Title/Logo */}
          {!desktopCollapsed && (
            <span className="font-bold text-xl text-text-on-primary whitespace-nowrap">ART System</span>
          )}

          {/* Toggle Button - Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expandir" : "Colapsar"}
            className="hidden md:block p-1 rounded-md text-text-on-primary/70 hover:bg-primary-subtle hover:text-text-on-primary transition-colors focus:outline-none focus:ring-2 focus:ring-text-on-primary"
          >
            <span className="sr-only">{isCollapsed ? "Expandir menú" : "Colapsar menú"}</span>
            <ChevronDoubleLeftIcon className={`h-6 w-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Close Button - Mobile */}
          <button
            onClick={onMobileClose}
            className="md:hidden p-1 rounded-md text-text-on-primary/70 hover:bg-primary-subtle hover:text-text-on-primary"
            aria-label="Cerrar menú"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-grow mt-4">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} title={desktopCollapsed ? item.label : undefined} className="px-4">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onMenuItemSelect(item.label);
                  }}
                  className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
                    activeItemLabel === item.label
                      ? 'bg-primary text-text-on-primary'
                      : 'text-text-on-primary/90 hover:bg-primary hover:text-text-on-primary'
                  }`}
                >
                  <span className="flex-shrink-0 h-6 w-6">{item.icon}</span>
                  {!desktopCollapsed && <span className="ml-4 font-medium">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-primary-subtle">
          <button
            onClick={onRoleChange}
            title={desktopCollapsed ? "Cambiar Rol" : undefined}
            className={`flex items-center w-full p-3 my-1 rounded-lg hover:bg-primary hover:text-text-on-primary transition-colors ${desktopCollapsed ? 'justify-center' : ''}`}
          >
            <SwitchHorizontalIcon className="h-6 w-6 flex-shrink-0" />
            {!desktopCollapsed && <span className="ml-4 font-medium">Cambiar Rol</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;