import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { UserProfile } from '../types';
import { Download, Users, Calendar, ShieldCheck, Mail, Ruler, Weight, Target } from 'lucide-react';
import { motion } from 'motion/react';

export const Admin: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(userList);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const downloadCSV = () => {
    if (users.length === 0) return;

    const headers = [
      'Name',
      'Email',
      'Age',
      'Gender',
      'Height (cm)',
      'Weight (kg)',
      'Goal',
      'Activity Level',
      'Daily Calories',
      'Protein Target',
      'Carbs Target',
      'Fats Target',
      'Joined At'
    ];

    const rows = users.map(u => [
      u.displayName || 'Anonymous',
      u.email || 'N/A',
      u.age,
      u.gender,
      u.height,
      u.weight,
      u.goal,
      u.activityLevel,
      u.dailyCalorieTarget,
      u.proteinTarget,
      u.carbsTarget,
      u.fatsTarget,
      u.createdAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calorix_members_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <ShieldCheck size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Creator Access Only</span>
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter">MEMBER DIRECTORY<span className="text-orange-500">.</span></h2>
          <p className="text-black/40 mt-2">Manage and monitor all Calorix members from one place.</p>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-all shadow-xl shadow-black/10"
        >
          <Download size={18} />
          Export to Google Sheets (CSV)
        </button>
      </div>

      <div className="bg-white rounded-[48px] border border-black/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 border-b border-black/5">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black/40">Member</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black/40">Stats</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black/40">Goal</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black/40">Targets</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-black/40">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-8"><div className="h-12 bg-black/5 rounded-2xl w-full" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-black/40 italic font-serif">No members found yet.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.uid} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-display font-bold text-xl">
                          {user.displayName?.[0] || user.email?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{user.displayName || 'Anonymous'}</p>
                          <div className="flex items-center gap-2 text-[10px] text-black/40">
                            <Mail size={10} />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-black/60">
                          <Ruler size={12} /> {user.height}cm
                        </div>
                        <div className="flex items-center gap-1 text-black/60">
                          <Weight size={12} /> {user.weight}kg
                        </div>
                        <div className="text-black/40 font-bold uppercase tracking-tighter">{user.age}y</div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Target size={12} />
                        {user.goal.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-black/20 uppercase tracking-tighter">Cals</p>
                          <p className="text-xs font-bold">{user.dailyCalorieTarget}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-black text-black/20 uppercase tracking-tighter">Prot</p>
                          <p className="text-xs font-bold">{user.proteinTarget}g</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-black/40 text-xs">
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
