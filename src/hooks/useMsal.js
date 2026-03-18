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

const msalLoginRequest = { scopes: ['User.Read', 'User.ReadBasic.All', 'Mail.Send'] };

export function useMsal({ toast, lang, setForm }) {
  const [msalReady, setMsalReady] = useState(false);
  const [msalAccount, setMsalAccount] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

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
      // Fetch profile photo (separate try-catch — photo is optional)
      try {
        const photoRes = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
          headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
        });
        if (photoRes.ok) {
          const blob = await photoRes.blob();
          const reader = new FileReader();
          reader.onloadend = () => setProfilePhoto(reader.result);
          reader.readAsDataURL(blob);
        }
      } catch (_) { /* no photo available */ }
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

  const fetchManager = useCallback(async () => {
    if (!msalInstance || !msalAccount) return null;
    try {
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ['User.ReadBasic.All'],
        account: msalAccount,
      });
      const res = await fetch('https://graph.microsoft.com/v1.0/me/manager?$select=displayName,mail', {
        headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
      });
      if (!res.ok) return null;
      const mgr = await res.json();
      return { name: mgr.displayName || '', email: mgr.mail || '' };
    } catch (err) {
      if (import.meta.env.DEV) console.error('Fetch manager error:', err);
      return null;
    }
  }, [msalAccount]);

  const sendMail = useCallback(async ({ to, subject, htmlBody, attachments }) => {
    if (!msalInstance || !msalAccount) return false;
    try {
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ['Mail.Send'],
        account: msalAccount,
      });
      const message = {
        subject,
        body: { contentType: 'HTML', content: htmlBody },
        toRecipients: [{ emailAddress: { address: to } }],
      };
      if (attachments && attachments.length > 0) message.attachments = attachments;
      const res = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, saveToSentItems: true }),
      });
      if (!res.ok) {
        if (import.meta.env.DEV) {
          const errText = await res.text();
          console.error('Send mail error:', res.status, errText);
        }
        return false;
      }
      return true;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        try {
          await msalInstance.acquireTokenRedirect({ scopes: ['Mail.Send'] });
        } catch (_) { /* redirect will happen */ }
      }
      if (import.meta.env.DEV) console.error('Send mail error:', err);
      return false;
    }
  }, [msalAccount]);

  return { MSAL_ENABLED, msalReady, msalAccount, authLoading, handleLogin, handleLogout, fetchManager, sendMail, profilePhoto };
}
