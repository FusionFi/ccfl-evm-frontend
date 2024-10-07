import { useAuth } from '@/hooks/auth.hook';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import eventBus from '@/hooks/eventBus.hook';

export default function MyVerifyPage() {
  /**
   * HOOKS
   */
  const router = useRouter();
  const [auth, updateAuth] = useAuth();
  console.log('🚀 ~ MyVerifyPage ~ auth:', auth);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');
    if (token) {
      updateAuth({ access_token: token, isNew: true });
      router.push('/my-profile');
    }
  }, []);

  return <div></div>;
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
