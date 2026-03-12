import { useState, useEffect, useCallback } from 'react';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';

const MSAL_ENABLED = !!(import.meta.env.VITE_CLIENT_ID && import.meta.env.VITE_TENANT_ID);

const msalInstance = MSAL_ENABLED ? new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'sessionStorage', storeAuthStateInCookie: false },
}) : null;

const msalLoginRequest = { scopes: ['User.Read'] };

export function useMsal({ toast, lang, setForm }) {
  const [msalReady, setMsalReady] = useState(false);
  const [msalAccount, setMsalAccount] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const fetchGraphProfile = useCallback(async (account) => {
    try {
      const tokenResponse = await msalInstance.acquireTokenSilent({ ...msalLoginRequest, account });
      const res = await fetch('https://graph.microsoft.com/v1.0/me?$select=givenName,surname,mail,jobTitle,mobilePhone', {
        headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
      });
      if (!res.ok) throw new Error(`Graph API ${res.status}`);
      const p = await res.json();
      setForm(prev => ({
        ...prev,
        firstName: p.givenName || prev.firstName,
        lastName: p.surname || prev.lastName,
        email: p.mail || prev.email,
        titleTR: p.jobTitle || prev.titleTR,
        gsm: p.mobilePhone || prev.gsm,
      }));
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        try {
          await msalInstance.acquireTokenRedirect(msalLoginRequest);
        } catch (_) { toast('Profile unavailable', 'err'); }
      } else {
        if (import.meta.env.DEV) console.error('Graph API error:', err.message);
        toast('Profile unavailable', 'err');
      }
    }
  }, [toast, setForm]);

  const handleLogin = useCallback(async () => {
    if (!msalReady || !msalInstance) return;
    setAuthLoading(true);
    try {
      await msalInstance.loginRedirect(msalLoginRequest);
    } catch (err) {
      if (err.errorCode !== 'user_cancelled') {
        if (import.meta.env.DEV) console.error('Login error:', err);
        toast(lang === 'tr' ? 'Giriş başarısız' : 'Login failed', 'err');
      }
      setAuthLoading(false);
    }
  }, [msalReady, lang, toast]);

  const handleLogout = useCallback(async () => {
    try {
      await msalInstance.logoutRedirect({ account: msalAccount, postLogoutRedirectUri: window.location.origin });
    } catch (err) {
      if (import.meta.env.DEV) console.error('Logout error:', err);
    }
    setMsalAccount(null);
  }, [msalAccount]);

  useEffect(() => {
    if (!MSAL_ENABLED || !msalInstance) return;
    let isMounted = true;
    msalInstance.initialize().then(async () => {
      if (!isMounted) return;
      let redirectAccount = null;
      try {
        const redirectResponse = await msalInstance.handleRedirectPromise();
        if (redirectResponse?.account) redirectAccount = redirectResponse.account;
      } catch (err) {
        if (import.meta.env.DEV) console.error('Redirect error:', err);
      }
      if (!isMounted) return;
      setMsalReady(true);
      setAuthLoading(false);
      const account = redirectAccount || msalInstance.getAllAccounts()[0] || null;
      if (account) {
        setMsalAccount(account);
        fetchGraphProfile(account);
      }
    }).catch(err => {
      if (import.meta.env.DEV) console.error('MSAL init failed:', err);
      if (isMounted) { setMsalReady(true); setAuthLoading(false); }
    });
    return () => { isMounted = false; };
  }, []);

  return { MSAL_ENABLED, msalReady, msalAccount, authLoading, handleLogin, handleLogout };
}
