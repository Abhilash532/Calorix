import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from './types';
import { Auth } from './components/Auth';
import { ProfileSetup } from './components/ProfileSetup';
import { Dashboard } from './components/Dashboard';
import { Recipes } from './components/Recipes';
import { Community } from './components/Community';
import { Admin } from './components/Admin';
import { LogOut, ChefHat, LayoutDashboard, Users, ShieldCheck } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recipes' | 'community' | 'admin'>('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const CREATOR_EMAIL = 'aabhi20604@gmail.com';
  
  // Robust creator check
  const checkIsCreator = () => {
    const emails = [
      user?.email,
      profile?.email,
      auth.currentUser?.email,
      ...(user?.providerData?.map((p: any) => p.email) || [])
    ].filter(Boolean).map(e => e.toLowerCase().trim());
    
    return emails.includes(CREATOR_EMAIL);
  };

  const isCreator = checkIsCreator();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSkipLogin = () => {
    const mockUser = {
      uid: 'demo_user',
      email: 'demo@calorix.com',
      displayName: 'Demo Hero',
      isDemo: true,
    };
    setUser(mockUser);
    setProfile(null);
  };

  const handleSignOut = async () => {
    if (user?.isDemo) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('calorix_profile_demo');
      // Clean up other demo keys as well
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('calorix_log_') || key.startsWith('calorix_recipes_') || key.startsWith('calorix_likes_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } else {
      await signOut(auth);
    }
  };

  const refreshProfile = async () => {
    if (user && !user.isDemo) {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
        <div className="animate-pulse text-4xl font-display font-black tracking-tighter text-black">
          CALORIX<span className="text-orange-500">.</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onSkipLogin={handleSkipLogin} />;
  }

  if (!profile || isEditingProfile) {
    return <ProfileSetup user={user} initialProfile={profile} onComplete={(newProfile) => { setProfile(newProfile); setIsEditingProfile(false); }} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] pt-16 md:pt-20 pb-24 md:pb-6">
      {/* Responsive Header */}
      <header className="flex fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-black/5 z-40 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tighter text-black">
            CALORIX<span className="text-orange-500">.</span>
          </h1>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'text-black' : 'text-black/40 hover:text-black'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`text-sm font-medium transition-all ${activeTab === 'recipes' ? 'text-black' : 'text-black/40 hover:text-black'}`}
            >
              Recipes
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`text-sm font-medium transition-all ${activeTab === 'community' ? 'text-black' : 'text-black/40 hover:text-black'}`}
            >
              Community
            </button>
            {isCreator && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'admin' ? 'text-orange-500' : 'text-black/40 hover:text-black'}`}
              >
                <ShieldCheck size={16} />
                Admin
              </button>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-right mr-1 md:mr-4">
            <div className="flex items-center gap-2 justify-end">
              {isCreator && <span className="px-2 py-0.5 bg-orange-500 text-white text-[8px] font-black uppercase rounded-full tracking-widest animate-pulse">Creator</span>}
              <p className="text-xs font-bold">{profile.displayName || 'User'}</p>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              <p className="text-[9px] md:text-[10px] text-black/40 uppercase tracking-widest">{profile.goal.replace('_', ' ')}</p>
              <button 
                onClick={() => setIsEditingProfile(true)} 
                className="text-[9px] md:text-[10px] text-orange-600 hover:text-orange-700 font-bold underline cursor-pointer"
                title="Edit Stats & Goals"
              >
                (Edit)
              </button>
            </div>
            <p className="text-[8px] text-black/20 hidden md:block">{user?.email}</p>
          </div>
          <button onClick={handleSignOut} className="p-2 hover:bg-black/5 rounded-full text-black/60 hover:text-black transition-all" title="Sign Out">
            <LogOut size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-2 md:pt-4">
        {activeTab === 'dashboard' && <Dashboard profile={profile} user={user} onProfileUpdate={setProfile} />}
        {activeTab === 'recipes' && <Recipes profile={profile} user={user} />}
        {activeTab === 'community' && <Community user={user} />}
        {activeTab === 'admin' && isCreator && <Admin />}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-black/5 z-40 flex items-center justify-around px-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-black' : 'text-black/30'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Track</span>
        </button>
        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'recipes' ? 'text-black' : 'text-black/30'}`}
        >
          <ChefHat size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Eat</span>
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'community' ? 'text-black' : 'text-black/30'}`}
        >
          <Users size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Social</span>
        </button>
        {isCreator && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'admin' ? 'text-orange-500' : 'text-black/30'}`}
          >
            <ShieldCheck size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
          </button>
        )}
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-1 text-black/30"
        >
          <LogOut size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Exit</span>
        </button>
      </nav>
    </div>
  );
}
