import { memo } from 'react';
import { C } from '../constants/theme';

const AppFooter = memo(() => (
  <footer style={{ textAlign: 'center', padding: '0.6rem 2rem', borderTop: `1px solid ${C.borderSub}`, background: C.glassSolid }}>
    <p style={{ fontSize: '0.6rem', color: C.textM, margin: 0 }}>
      Powered by <span style={{ fontWeight: 700, color: C.text2 }}>TTECH Business Solutions</span>
      {' '}&middot;{' '}&copy; {new Date().getFullYear()} Tiryaki Agro
    </p>
  </footer>
));

export default AppFooter;
