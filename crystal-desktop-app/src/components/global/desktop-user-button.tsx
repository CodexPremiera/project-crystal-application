import { getDesktopUser, clearDesktopUser } from "@/lib/desktop-auth";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { LogOut } from "lucide-react";

/**
 * Desktop User Button Component
 * 
 * A custom user avatar/button for the desktop app that works with
 * our localStorage-based authentication. Shows the user's profile
 * image and provides a sign-out option.
 * 
 * Falls back to displaying initials if no image is available.
 */
export const DesktopUserButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const desktopUser = getDesktopUser();
  
  // Use Clerk user if available, otherwise use stored desktop user
  const imageUrl = clerkUser?.imageUrl || desktopUser?.imageUrl;
  const name = clerkUser?.fullName || clerkUser?.firstName || desktopUser?.name;
  const email = clerkUser?.primaryEmailAddress?.emailAddress || desktopUser?.email;
  
  // Get initials for fallback avatar
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : email?.[0]?.toUpperCase() || '?';
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('[DesktopUserButton] Clerk signOut failed:', e);
    }
    clearDesktopUser();
    window.location.reload();
  };
  
  // Don't show if no user
  if (!desktopUser && !clerkUser) {
    return null;
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-600 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name || 'User'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
        )}
      </button>
      
      {showMenu && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute left-0 top-10 z-50 bg-[#252525] border border-gray-700 rounded-lg shadow-xl min-w-[200px] py-2">
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-white text-sm font-medium truncate">{name || 'User'}</p>
              <p className="text-gray-400 text-xs truncate">{email}</p>
            </div>
            
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

