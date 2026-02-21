import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import Modal from './common/Modal';
import Button from './common/Button';
import Input from './common/Input';
import Label from './common/Label';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
}

const AuthModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configOK = isFirebaseConfigured();

  // complexity exceeds 12 due to error-handling switch; disabling for now
  // eslint-disable-next-line complexity
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configOK) {
      setError(t('auth.configMissing'));
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose(); // Automatically close on success
    } catch (err: unknown) {
      let message = '';
      if (err && typeof err === 'object' && 'code' in err) {
        const code = ((err as { code?: unknown }).code as string) || '';
        switch (code) {
          case 'auth/invalid-credential':
            message = t('auth.errors.invalidCredential');
            break;
          case 'auth/user-not-found':
            message = t('auth.errors.userNotFound');
            break;
          case 'auth/wrong-password':
            message = t('auth.errors.wrongPassword');
            break;
          case 'auth/email-already-in-use':
            message = t('auth.errors.emailInUse');
            break;
          case 'auth/weak-password':
            message = t('auth.errors.weakPassword');
            break;
          default:
            // fallback to generic message when we don't know error shape
            message = t('auth.errors.default');
        }
      } else if (err instanceof Error) {
        message = err.message;
      } else {
        message = t('auth.errors.default');
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isLogin ? t('auth.welcomeBack') : t('auth.registerId')}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-brand-danger/10 text-brand-danger border border-brand-danger/20 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label>{t('auth.emailLabel')}</Label>
          <Input
            icon={<Mail size={16} />}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="commander@earth.gsa"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>{t('auth.passwordLabel')}</Label>
          <Input
            icon={<Lock size={16} />}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="tracking-widest"
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? t('auth.loading') : isLogin ? t('auth.loginBtn') : t('auth.registerBtn')}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-brand-primary hover:text-brand-hover text-sm font-medium hover:underline transition-colors"
        >
          {isLogin ? t('auth.toggleRegister') : t('auth.toggleLogin')}
        </button>
      </div>
    </Modal>
  );
};

export default AuthModal;
