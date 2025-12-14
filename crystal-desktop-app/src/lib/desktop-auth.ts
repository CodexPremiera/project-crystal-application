/**
 * Desktop Auth Storage
 * 
 * Simple localStorage-based auth persistence for Electron.
 * Clerk's cookie-based session management doesn't work in Electron,
 * so we store the user info ourselves after successful sign-in.
 */

const STORAGE_KEY = 'crystal_desktop_user';

export interface DesktopUser {
  clerkId: string;
  email: string | null;
  name: string | null;
  imageUrl: string | null;
  timestamp: number;
}

export function saveDesktopUser(user: DesktopUser): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    console.log('[DesktopAuth] User saved:', user.clerkId);
  } catch (e) {
    console.error('[DesktopAuth] Failed to save user:', e);
  }
}

export function getDesktopUser(): DesktopUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const user = JSON.parse(stored) as DesktopUser;
    
    // Check if stored auth is less than 7 days old
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - user.timestamp > maxAge) {
      clearDesktopUser();
      return null;
    }
    
    return user;
  } catch (e) {
    console.error('[DesktopAuth] Failed to get user:', e);
    return null;
  }
}

export function clearDesktopUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[DesktopAuth] User cleared');
  } catch (e) {
    console.error('[DesktopAuth] Failed to clear user:', e);
  }
}

export function isDesktopAuthenticated(): boolean {
  return getDesktopUser() !== null;
}

