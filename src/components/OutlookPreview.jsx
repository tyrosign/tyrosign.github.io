import { memo } from 'react';
import { C } from '../constants/theme';
import TyroLogo from './ui/TyroLogo';

const OutlookPreview = memo(({ hasData, sigHTML, L, lang }) => (
  <div style={{
    border: '1px solid #d0d5dd', borderRadius: 10, overflow: 'hidden',
    background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', padding: '0.4rem 0.7rem',
      background: 'linear-gradient(180deg, #f8f9fa, #eef0f2)',
      borderBottom: '1px solid #e0e3e8',
    }}>
      <div style={{ display: 'flex', gap: 5 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
      </div>
      <span style={{ flex: 1, textAlign: 'center', fontSize: '0.65rem', color: C.text2, fontWeight: 500 }}>{L.mockTitle}</span>
    </div>
    <div style={{ borderBottom: '1px solid #e8eaed', padding: '0.4rem 0.8rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.68rem', marginBottom: '0.25rem' }}>
        <span style={{ fontWeight: 600, color: C.text1, minWidth: 38 }}>{L.mockSubject}</span>
        <span style={{ color: C.text2 }}>{lang === 'tr' ? 'Toplantı Daveti' : 'Meeting Invitation'}</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.68rem' }}>
        <span style={{ fontWeight: 600, color: C.text1, minWidth: 38 }}>{L.mockTo}</span>
        <span style={{ color: C.text2 }}>ali.yilmaz@tiryaki.com.tr</span>
      </div>
    </div>
    <div style={{ padding: '0.8rem 1rem' }}>
      {hasData && (
        <div style={{ marginBottom: '1rem', fontSize: '0.75rem', color: C.text1, lineHeight: 1.6 }}>
          <p>{L.mockBody}</p>
          <p style={{ color: C.text2, marginTop: '0.2rem' }}>{L.mockBodyLine}</p>
        </div>
      )}
      <div style={{ minHeight: 80, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {hasData ? (
          <div dangerouslySetInnerHTML={{ __html: sigHTML }} />
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem 1.5rem' }}>
            <div style={{ display: 'inline-block', position: 'relative', marginBottom: '0.7rem' }}>
              <div style={{ animation: 'signing 3.5s ease-in-out infinite' }}>
                <TyroLogo size={40} />
              </div>
              <div style={{
                position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                height: 2, maxWidth: 80, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  background: `linear-gradient(90deg, transparent, ${C.accent}, ${C.primary}, ${C.accent}, transparent)`,
                  borderRadius: 2,
                  animation: 'signLine 3.5s ease-in-out infinite',
                }} />
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text2 }}>{L.emptySig}</p>
            <p style={{ fontSize: '0.62rem', color: C.textM, marginTop: '0.2rem' }}>{L.fillForm}</p>
          </div>
        )}
      </div>
    </div>
  </div>
));

export default OutlookPreview;
