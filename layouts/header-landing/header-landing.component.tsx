import { useTranslation } from 'next-i18next';
export default function HeaderLanding({}: any) {
  const { t } = useTranslation('common');

  /**
   * FUNCTIONS
   **/

  return (
    <div className="page-header-content flex items-center justify-center w-full">
      header landing content here
    </div>
  );
}
