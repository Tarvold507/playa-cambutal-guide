
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Eat', 'Stay', 'Events', 'Adventure', 'Info'];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className={`text-2xl font-bold ${isScrolled ? 'text-venao-dark' : 'text-white'}`}>
              Cambutal Guide
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                to={`/${item.toLowerCase().replace(' ', '-')}`} 
                key={item}
                className={`${
                  isScrolled ? 'text-gray-800 hover:text-venao' : 'text-white hover:text-venao-light'
                } font-medium transition-colors`}
              >
                {item}
              </Link>
            ))}
            
            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={isScrolled ? "outline" : "secondary"} 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    {profile?.name || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <span className="font-medium">{profile?.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant={isScrolled ? "default" : "secondary"} size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-800' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link 
                to={`/${item.toLowerCase().replace(' ', '-')}`} 
                key={item}
                className="text-gray-800 hover:text-venao font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            
            {/* Mobile Auth Section */}
            {user ? (
              <>
                <div className="pt-4 border-t">
                  <p className="text-gray-600 mb-2">Signed in as {profile?.name}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Link 
                to="/auth" 
                className="pt-4 border-t"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="default" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
