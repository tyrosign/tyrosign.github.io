import { memo } from 'react';
import { C } from '../constants/theme';

const Avatar = ({ size, photo, initials }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: photo ? 'transparent' : `linear-gradient(135deg, ${C.primary}, #2a5f9e)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: size < 30 ? '0.55rem' : size < 44 ? '0.7rem' : '0.85rem',
    fontWeight: 700, fontFamily: 'Plus Jakarta Sans,sans-serif',
    letterSpacing: '0.5px',
    boxShadow: `0 2px ${size < 30 ? 6 : 8}px rgba(30,58,95,0.25)`,
    flexShrink: 0, overflow: 'hidden',
  }}>
    {photo
      ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      : initials
    }
  </div>
);

const ProfileDropdown = memo(({ msalAccount, lang, profileOpen, setProfileOpen, handleLogout, profilePhoto }) => {
  const initials = (msalAccount.name || '').split(' ').map(n => n?.[0] || '').join('').slice(0, 2).toLocaleUpperCase('tr-TR');

  return (
    <div className="app-header-auth" style={{ position: 'relative' }}>
      <button
        className="profile-trigger"
        aria-label={lang === 'tr' ? 'Profil menüsü' : 'Profile menu'}
        onClick={() => setProfileOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.15rem 0.35rem 0.15rem 0.15rem',
          background: profileOpen ? `${C.primary}0c` : 'transparent',
          borderRadius: 20, border: `1.5px solid ${profileOpen ? C.primary + '30' : C.borderSub}`,
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { if (!profileOpen) { e.currentTarget.style.background = `${C.primary}08`; e.currentTarget.style.borderColor = C.primary + '20'; } }}
        onMouseLeave={e => { if (!profileOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.borderSub; } }}
      >
        <Avatar size={26} photo={profilePhoto} initials={initials} />
        <svg className="profile-chevron" width="8" height="5" viewBox="0 0 10 6" fill="none" style={{
          transition: 'transform 0.2s ease',
          transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          <path d="M1 1L5 5L9 1" stroke={C.textM} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {profileOpen && (
        <>
          <div onClick={() => setProfileOpen(false)} style={{
            position: 'fixed', inset: 0, zIndex: 199,
          }} />
          <div className="profile-dropdown" style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            minWidth: 220, background: '#fff',
            borderRadius: 14, border: `1px solid ${C.borderSub}`,
            boxShadow: '0 12px 40px rgba(30,58,95,0.18), 0 4px 12px rgba(30,58,95,0.1)',
            zIndex: 200, overflow: 'hidden',
            animation: 'fadeSlideDown 0.2s ease',
          }}>
            <div style={{
              padding: '0.85rem 0.85rem 0.65rem',
              borderBottom: `1px solid ${C.borderSub}`,
              background: '#f8f9fb',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Avatar size={48} photo={profilePhoto} initials={initials} />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.76rem', fontWeight: 700, color: '#1a1a2e',
                    fontFamily: 'Plus Jakarta Sans,sans-serif',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {msalAccount.name || msalAccount.username}
                  </div>
                  <div style={{
                    fontSize: '0.62rem', color: '#6b7280', marginTop: 2,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {msalAccount.username}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '0.35rem', background: '#fff' }}>
              <button onClick={() => { setProfileOpen(false); handleLogout(); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.55rem',
                padding: '0.5rem 0.65rem', borderRadius: 10,
                border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: '0.72rem', fontWeight: 600, color: '#dc2626',
                fontFamily: 'Inter,sans-serif',
                transition: 'background 0.15s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {lang === 'tr' ? 'Çıkış Yap' : 'Sign Out'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default ProfileDropdown;
