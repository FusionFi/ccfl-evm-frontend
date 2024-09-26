import cssClass from '@/components/home/works/works.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';

export default function WorksComponent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.worksComponent)}>
      <div className="works-container">works component here</div>
    </div>
  );
}
