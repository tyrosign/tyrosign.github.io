import { memo } from 'react';
import { C } from '../constants/theme';

const ProfileDropdown = memo(({ msalAccount, lang, profileOpen, setProfileOpen, handleLogout }) => (
  <div className="app-header-auth" style={{ position: 'relative' }}>
    <button
      onClick={() => setProfileOpen(p => !p)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.2rem 0.5rem 0.2rem 0.2rem',
        background: profileOpen ? `${C.primary}0c` : 'transparent',
        borderRadius: 24, border: `1.5px solid ${profileOpen ? C.primary + '30' : C.borderSub}`,
        cursor: 'pointer', transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => { if (!profileOpen) { e.currentTarget.style.background = `${C.primary}08`; e.currentTarget.style.borderColor = C.primary + '20'; } }}
      onMouseLeave={e => { if (!profileOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.borderSub; } }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: `linear-gradient(135deg, ${C.primary}, #2a5f9e)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: '0.6rem', fontWeight: 700,
        fontFamily: 'Plus Jakarta Sans,sans-serif',
        letterSpacing: '0.5px',
        boxShadow: '0 2px 8px rgba(30,58,95,0.25)',
      }}>
        {(msalAccount.name || '').split(' ').map(n => n?.[0] || '').join('').slice(0, 2).toLocaleUpperCase('tr-TR')}
      </div>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{
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
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          minWidth: 220, background: C.surface,
          borderRadius: 14, border: `1px solid ${C.borderSub}`,
          boxShadow: '0 12px 40px rgba(30,58,95,0.15), 0 4px 12px rgba(30,58,95,0.08)',
          zIndex: 200, overflow: 'hidden',
          animation: 'fadeSlideDown 0.2s ease',
        }}>
          <div style={{
            padding: '1rem 1rem 0.75rem',
            borderBottom: `1px solid ${C.borderSub}`,
            background: `${C.primary}04`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.primary}, #2a5f9e)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                fontFamily: 'Plus Jakarta Sans,sans-serif',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(30,58,95,0.25)',
                flexShrink: 0,
              }}>
                {(msalAccount.name || '').split(' ').map(n => n?.[0] || '').join('').slice(0, 2).toLocaleUpperCase('tr-TR')}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '0.78rem', fontWeight: 700, color: C.text1,
                  fontFamily: 'Plus Jakarta Sans,sans-serif',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {msalAccount.name || msalAccount.username}
                </div>
                <div style={{
                  fontSize: '0.65rem', color: C.textM, marginTop: 2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {msalAccount.username}
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '0.4rem' }}>
            <button onClick={() => { setProfileOpen(false); handleLogout(); }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.55rem 0.7rem', borderRadius: 10,
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: '0.72rem', fontWeight: 500, color: '#dc2626',
              fontFamily: 'Inter,sans-serif',
              transition: 'background 0.15s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.06)'}
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
));

export default ProfileDropdown;
