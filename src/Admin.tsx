import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { subscribeToAllVideos, addCustomVideo, updateCustomVideo, deleteCustomVideo, CustomVideo, subscribeToAllBrands, addCustomBrand, deleteCustomBrand, CustomBrand } from './data/store';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<CustomVideo[]>([]);
  const [brands, setBrands] = useState<CustomBrand[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'videos' | 'brands' | 'settings'>('videos');
  
  const [form, setForm] = useState<Partial<CustomVideo>>({
    type: 'work',
    format: '16:9',
    category: 'UGC'
  });

  const [brandForm, setBrandForm] = useState<{name: string, logo: string}>({ name: '', logo: '' });
  const [projectsCountForm, setProjectsCountForm] = useState(200);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubVideos = subscribeToAllVideos((data) => {
        setVideos(data.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
      });
      const unsubBrands = subscribeToAllBrands((data) => {
        setBrands(data.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
      });
      const unsubSettings = import('./data/store').then(({ subscribeToSettings, subscribeToAdminEmails }) => {
        const cleanupAdmin = subscribeToAdminEmails((emails) => {
          if (emails) setAdminEmails(emails); // initialize or update
        });
        const cleanupSettings = subscribeToSettings((data) => {
          setSettings(data);
          if (data && data.completedProjectsCount !== undefined) {
             setProjectsCountForm(data.completedProjectsCount);
          }
        });
        return () => {
          cleanupSettings();
          cleanupAdmin();
        };
      });
      
      let cleanupCombined: any;
      unsubSettings.then(cleanup => cleanupCombined = cleanup);

      return () => {
        unsubVideos();
        unsubBrands();
        if (cleanupCombined) cleanupCombined();
      };
    } else {
      setVideos([]);
      setBrands([]);
      setSettings(null);
    }
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/unauthorized-domain') {
        alert('Domain not authorized! Please add scenoxis-studio.vercel.app to Firebase Console -> Authentication -> Settings -> Authorized domains.');
      } else {
        alert('Login failed: ' + e.message);
      }
    }
  };

  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value;
    // convert standard or short youtube links to embed links instantly
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) {
      url = `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
    } else {
      const watchMatch = url.match(/youtube\.com.*[?&]v=([^&]+)/);
      if (watchMatch) {
        url = `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
      }
    }
    setForm({...form, embedUrl: url});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newVideo: Partial<CustomVideo> = {
      type: form.type as any || 'work',
      title: form.title || '',
      client: form.client || '',
      video: form.video || '',
      poster: form.poster || '',
      embedUrl: form.embedUrl || '',
      format: form.format as any || '16:9',
      category: form.category || 'UGC',
      isTopShowreel: form.isTopShowreel || false,
      tags: form.tags ? (typeof form.tags === 'string' ? form.tags.split(',').map(s => s.trim()) : form.tags) : [],
    };
    
    try {
      if (editingId) {
        await updateCustomVideo(editingId, newVideo);
        setEditingId(null);
      } else {
        newVideo.code = `CUSTOM_${Date.now()}`;
        await addCustomVideo(newVideo);
      }
      setForm({ type: 'work', format: '16:9', category: 'UGC' });
    } catch (e: any) {
      alert("Error saving video. Check console for details.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center font-mono text-brand-cyan">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-10 font-sans text-white">
        <h1 className="text-4xl font-display font-black uppercase mb-4 text-brand-cyan">Admin Panel</h1>
        <p className="text-white/50 mb-8 font-mono">Sign in to manage custom videos</p>
        <button 
          onClick={handleLogin}
          className="px-8 py-4 bg-brand-cyan text-black font-display font-black uppercase rounded-xl hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all"
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  const isBootstrapAdmin = user.email === 'devyadavofficial02@gmail.com';
  const isUserAdmin = isBootstrapAdmin || (user.email && adminEmails.includes(user.email));

  // If user is loaded but not an admin (and adminEmails has loaded - we assume empty means only bootstrap is admin)
  // Actually, we should show "Not Authorized" if they are logged in but not an admin.
  if (!isUserAdmin) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-10 font-sans text-white">
        <h1 className="text-4xl font-display font-black uppercase mb-4 text-brand-cyan">Access Denied</h1>
        <p className="text-white/50 mb-4 font-mono">Your email ({user.email}) is not authorized to access this panel.</p>
        <p className="text-white/30 text-sm mb-8 font-mono">Contact the administrator to grant access.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => signOut(auth)}
            className="px-8 py-4 bg-white/10 text-white font-mono uppercase tracking-widest text-sm rounded-xl hover:bg-white/20 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-display font-black uppercase tracking-tighter">Content <span className="text-brand-cyan">Manager</span></h1>
            <p className="text-xs font-mono text-white/40 mt-1">Logged in as {user.email}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => signOut(auth)} className="px-6 py-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors font-mono text-sm uppercase tracking-widest">Sign Out</button>
            <a href="/" className="px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors font-mono text-sm uppercase tracking-widest">Back to Site</a>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('videos')} 
            className={`px-6 py-3 font-mono uppercase tracking-widest text-sm rounded-xl transition-all ${activeTab === 'videos' ? 'bg-brand-cyan text-black font-bold' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            Manage Videos
          </button>
          <button 
            onClick={() => setActiveTab('brands')} 
            className={`px-6 py-3 font-mono uppercase tracking-widest text-sm rounded-xl transition-all ${activeTab === 'brands' ? 'bg-brand-cyan text-black font-bold' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            Manage Brands
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`px-6 py-3 font-mono uppercase tracking-widest text-sm rounded-xl transition-all ${activeTab === 'settings' ? 'bg-brand-cyan text-black font-bold' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            Settings
          </button>
        </div>

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden transition-all duration-300">
                <h2 className="text-xl font-display font-bold mb-6 text-brand-cyan">Global Settings</h2>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const { updateSettings } = await import('./data/store');
                    await updateSettings({ completedProjectsCount: projectsCountForm });
                    alert('Settings updated successfully!');
                  }} 
                  className="flex flex-col gap-4 relative z-10"
                >
                  <label>
                    <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Completed Projects Count</span>
                    <input required type="number" min="0" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-lg font-bold text-white" value={projectsCountForm} onChange={e => setProjectsCountForm(parseInt(e.target.value) || 0)} />
                    <p className="text-[10px] text-white/30 font-mono mt-2">This number will be displayed in the Specialties / Discover section.</p>
                  </label>
                  <button type="submit" className="py-4 mt-4 bg-brand-cyan text-black font-display font-black text-lg uppercase tracking-tight rounded-xl hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
                    Save Settings
                  </button>
                </form>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden transition-all duration-300">
                <h2 className="text-xl font-display font-bold mb-6 text-brand-cyan">Admin Access</h2>
                <div className="mb-6 flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {adminEmails.length === 0 ? (
                    <div className="text-white/30 text-xs font-mono">No extra admins configured. Only the bootstrap owner has access.</div>
                  ) : (
                    adminEmails.map((email, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="font-mono text-sm">{email}</span>
                        <button
                          onClick={async () => {
                            if (confirm(`Remove ${email} from admins?`)) {
                              const newEmails = adminEmails.filter((_, index) => index !== i);
                              setAdminEmails(newEmails);
                              const { updateAdminEmails } = await import('./data/store');
                              await updateAdminEmails(newEmails);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-red-400/10 hover:bg-red-400/20 transition-colors rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newAdminEmail) return;
                    if (adminEmails.includes(newAdminEmail)) {
                       alert("Email already added!");
                       return;
                    }
                    const newEmails = [...adminEmails, newAdminEmail];
                    setAdminEmails(newEmails);
                    const { updateAdminEmails } = await import('./data/store');
                    await updateAdminEmails(newEmails);
                    setNewAdminEmail('');
                  }} 
                  className="flex flex-col gap-4 relative z-10"
                >
                  <label>
                    <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Add Admin Email</span>
                    <input required type="email" placeholder="admin@example.com" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm font-bold text-white" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
                    <p className="text-[10px] text-white/30 font-mono mt-2">Added emails can sign in via Google to access this panel.</p>
                  </label>
                  <button type="submit" className="py-4 mt-2 border border-white/20 hover:border-brand-cyan/50 hover:bg-brand-cyan/10 text-brand-cyan font-display font-black text-sm uppercase tracking-tight rounded-xl py-3 transition-all">
                    Add Admin
                  </button>
                </form>
            </div>
          </div>
        )}

        {activeTab === 'brands' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden transition-all duration-300">
              <h2 className="text-xl font-display font-bold mb-6 text-brand-cyan">Add New Brand</h2>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!brandForm.name || !brandForm.logo) return;
                  await addCustomBrand({ name: brandForm.name, logo: brandForm.logo });
                  setBrandForm({ name: '', logo: '' });
                }} 
                className="flex flex-col gap-4 relative z-10"
              >
                <label>
                  <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Brand Name</span>
                  <input required type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white" value={brandForm.name} onChange={e => setBrandForm({...brandForm, name: e.target.value})} placeholder="e.g. Nike" />
                </label>
                <label>
                  <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Logo URL (PNG/SVG) OR Upload</span>
                  <div className="flex gap-2">
                    <input required={!brandForm.logo.startsWith('data:image')} type="text" className="flex-1 bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white" value={brandForm.logo.startsWith('data:image') ? '' : brandForm.logo} onChange={e => setBrandForm({...brandForm, logo: e.target.value})} placeholder={brandForm.logo.startsWith('data:image') ? "Image selected..." : "https://image.com/logo.png"} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      id="brand-logo-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 1024 * 1024) { // 1MB limit
                             alert("File is too large! Please choose an image under 1MB.");
                             return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setBrandForm({...brandForm, logo: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label 
                      htmlFor="brand-logo-upload" 
                      className="px-6 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-lg flex items-center justify-center cursor-pointer transition-colors text-xs font-mono uppercase tracking-widest"
                    >
                      Browse
                    </label>
                  </div>
                  {brandForm.logo && brandForm.logo.startsWith('data:image') && (
                     <div className="mt-2 flex items-center gap-2">
                       <span className="w-12 h-12 bg-black/50 p-2 rounded border border-white/20 flex items-center justify-center">
                         <img src={brandForm.logo} alt="Preview" className="max-w-full max-h-full object-contain" />
                       </span>
                       <button type="button" onClick={() => setBrandForm({...brandForm, logo: ''})} className="text-red-400 text-[10px] font-mono tracking-widest uppercase hover:underline">Remove Image</button>
                     </div>
                  )}
                </label>
                <button type="submit" className="py-4 mt-4 bg-brand-cyan text-black font-display font-black text-lg uppercase tracking-tight rounded-xl hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
                  Publish Brand
                </button>
              </form>
            </div>
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-display font-bold text-white mb-2">Live Brands ({brands.length})</h2>
              {brands.length === 0 ? (
                <div className="text-white/30 text-sm font-mono p-10 border border-white/5 border-dashed rounded-3xl text-center">
                  No custom brands added yet. Note: If no brands are added here, the marquee will show default logos.
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                  {brands.map(b => (
                    <div key={b.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-black rounded-lg p-2 border border-white/10 flex items-center justify-center">
                          <img src={b.logo} alt={b.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className="font-bold text-lg">{b.name}</span>
                      </div>
                      <button 
                        onClick={async () => {
                          if(confirm("Remove this brand?")) {
                             await deleteCustomBrand(b.id);
                          }
                        }}
                        className="text-red-400 hover:text-red-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-red-400/10 hover:bg-red-400/20 transition-colors rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Add Form */}
          <div className={`glass p-8 rounded-3xl border ${editingId ? 'border-brand-cyan/50 shadow-[0_0_30px_rgba(0,245,255,0.1)]' : 'border-white/10'} relative overflow-hidden transition-all duration-300`}>
            <h2 className="text-xl font-display font-bold mb-6 text-brand-cyan">
              {editingId ? 'Edit Video Details' : 'Add New Video'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
              
              <div className="flex gap-4">
                <label className="flex-1">
                  <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Section</span>
                  <select 
                    className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white"
                    value={form.type}
                    onChange={e => setForm({...form, type: e.target.value as any})}
                  >
                    <option value="work">Selected Work</option>
                    <option value="showreel">Top Showreels</option>
                  </select>
                </label>

                <label className="flex-1">
                  <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Format Ratio</span>
                  <select 
                    className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white"
                    value={form.format}
                    onChange={e => setForm({...form, format: e.target.value as any})}
                  >
                    <option value="16:9">Horizontal (16:9)</option>
                    <option value="9:16">Vertical (9:16)</option>
                  </select>
                </label>
              </div>

              {form.type === 'work' && (
                <>
                  <label>
                    <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Category</span>
                    <input 
                      list="categories-list"
                      className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white"
                      placeholder="Select or type a category..."
                      value={form.category || ''}
                      onChange={e => setForm({...form, category: e.target.value})}
                    />
                    <datalist id="categories-list">
                      <option value="UGC" />
                      <option value="Real Estate" />
                      <option value="Commercials" />
                      <option value="Social Media" />
                      <option value="Music Videos" />
                      <option value="Documentary" />
                      <option value="VFX" />
                    </datalist>
                  </label>
                  <label className="flex items-center gap-2 mt-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-brand-cyan bg-transparent"
                      checked={form.isTopShowreel || false}
                      onChange={e => setForm({...form, isTopShowreel: e.target.checked})}
                    />
                    <span className="text-sm font-mono text-brand-cyan uppercase tracking-wider">Also feature in Top Showreels</span>
                  </label>
                </>
              )}

              <label>
                <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Title</span>
                <input required type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Neon Nights" />
              </label>

              <label>
                <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Client Name</span>
                <input required type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white" value={form.client || ''} onChange={e => setForm({...form, client: e.target.value})} placeholder="e.g. Nike Global" />
              </label>

              <label>
                <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">YouTube Embed OR Direct Auto-Parsing URL</span>
                <input type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white" value={form.embedUrl || ''} onChange={handleYoutubeUrlChange} placeholder="Paste YouTube link here..." />
              </label>

              <div className="flex gap-4 items-center">
                <span className="text-xs font-mono text-white/30">OR</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <label>
                <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Direct Video URL (.mp4)</span>
                <input type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white" value={form.video || ''} onChange={e => setForm({...form, video: e.target.value})} placeholder="https://example.com/video.mp4" />
              </label>

              <label>
                <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Poster Image URL (optional)</span>
                <input type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white" value={form.poster || ''} onChange={e => setForm({...form, poster: e.target.value})} placeholder="https://image-url.jpg" />
              </label>

              {(form.type === 'showreel' || form.isTopShowreel) && (
                <label>
                  <span className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-widest">Tags (comma separated)</span>
                  <input type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm text-white" value={(form.tags as any) || ''} onChange={e => setForm({...form, tags: e.target.value as any})} placeholder="VFX, Edit, Color" />
                </label>
              )}

              <div className="flex gap-4 mt-4">
                <button type="submit" className="flex-1 py-4 bg-brand-cyan text-black font-display font-black text-lg uppercase tracking-tight rounded-xl hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all">
                  {editingId ? 'Update Video' : 'Publish Video'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingId(null);
                      setForm({ type: 'work', format: '16:9', category: 'UGC' });
                    }}
                    className="px-6 py-4 border border-white/20 text-white font-mono uppercase tracking-widest text-sm rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-display font-bold text-white mb-2">Live Videos ({videos.length})</h2>
            
            {videos.length === 0 ? (
              <div className="text-white/30 text-sm font-mono p-10 border border-white/5 border-dashed rounded-3xl text-center">
                No custom videos added yet.
              </div>
            ) : (
              <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {videos.map(v => (
                  <div key={v.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 hover:border-brand-cyan/30 transition-colors">
                    <div className="w-24 aspect-video bg-black rounded-lg overflow-hidden shrink-0 border border-white/10">
                      {v.poster ? (
                        <img src={v.poster} alt="" className="w-full h-full object-cover opacity-50" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-white/20 font-mono">NO IMG</div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-brand-cyan mb-1 block">
                            {v.type === 'work' ? 'Work / ' + v.category : 'Showreel'} • {v.format}
                          </span>
                          <h3 className="font-bold text-lg leading-tight">{v.title}</h3>
                          <p className="text-white/40 text-xs mt-1">{v.client}</p>
                        </div>
                        <div className="flex gap-2.5 flex-wrap mt-3">
                          {v.type === 'work' && (
                             <button
                               onClick={async () => {
                                 try {
                                   await updateCustomVideo(v.id, { isTopShowreel: !v.isTopShowreel });
                                 } catch(e) {
                                   alert("Error updating status.");
                                 }
                               }}
                               className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1.5 rounded transition-colors ${v.isTopShowreel ? 'bg-brand-cyan text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                             >
                               {v.isTopShowreel ? '★ Featured Showreel' : '☆ Pin to Showreel'}
                             </button>
                          )}
                          <button 
                            onClick={() => {
                              setEditingId(v.id);
                              setForm({
                                type: v.type,
                                format: v.format,
                                category: v.category,
                                title: v.title,
                                client: v.client,
                                video: v.video,
                                poster: v.poster,
                                embedUrl: v.embedUrl,
                                isTopShowreel: v.isTopShowreel,
                                tags: v.tags?.join(', ') || ''
                              });
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-white hover:text-brand-cyan text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors rounded flex items-center justify-center"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={async () => {
                              if(confirm("Are you sure you want to remove this video?")) {
                                 try {
                                   await deleteCustomVideo(v.id);
                                 } catch(e) {
                                    alert("Error removing video. Check console for details.");
                                 }
                              }
                            }}
                            className="text-red-400 hover:text-red-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-red-400/10 hover:bg-red-400/20 transition-colors rounded flex items-center justify-center"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
