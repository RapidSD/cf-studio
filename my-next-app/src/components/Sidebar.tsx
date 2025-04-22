import { FC, useState, useEffect } from 'react';
import { CloudIcon, DatabaseIcon, FolderIcon, SettingsIcon, KeyIcon, MenuIcon, XIcon } from 'lucide-react';
import CloudflareAuthDialog from './auth/CloudflareAuthDialog';
import { storeToken, getToken } from '@/lib/tokenStorage';

interface SidebarProps {
  onServiceSelect: (service: string) => void;
}

const Sidebar: FC<SidebarProps> = ({ onServiceSelect }) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const services = [
    { 
      name: isAuthenticated ? 'Reconnect Account' : 'Connect Account', 
      icon: <CloudIcon className="w-5 h-5" />,
      onClick: () => setIsAuthDialogOpen(true),
      disabled: false
    },
    { 
      name: 'Environment', 
      icon: <KeyIcon className="w-5 h-5" />,
      onClick: () => onServiceSelect('Environment'),
      disabled: !isAuthenticated
    },
    { 
      name: 'Database', 
      icon: <DatabaseIcon className="w-5 h-5" />,
      onClick: () => onServiceSelect('Database'),
      disabled: !isAuthenticated
    },
    { 
      name: 'Storage', 
      icon: <FolderIcon className="w-5 h-5" />,
      onClick: () => onServiceSelect('Storage'),
      disabled: !isAuthenticated
    },
    { 
      name: 'Settings', 
      icon: <SettingsIcon className="w-5 h-5" />,
      onClick: () => onServiceSelect('Settings'),
      disabled: !isAuthenticated
    },
  ];

  const handleAuthSuccess = (token: string) => {
    storeToken(token);
    setIsAuthenticated(true);
    setIsAuthDialogOpen(false);
    onServiceSelect('Connected to Cloudflare');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 p-2 text-white bg-gray-800 rounded-lg md:hidden z-20"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-gray-900/50 text-white p-4 border-r border-gray-800
        transform transition-transform duration-300 ease-in-out z-30
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white md:hidden"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="mb-8 mt-2">
          <h1 className="text-xl font-bold">Cloudflare Studio</h1>
        </div>

        <nav>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service.name}>
                <button
                  onClick={() => {
                    service.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={service.disabled}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors
                    ${service.disabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-800'
                    }`}
                >
                  {service.icon}
                  <span>{service.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <CloudflareAuthDialog
          isOpen={isAuthDialogOpen}
          onClose={() => setIsAuthDialogOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar; 