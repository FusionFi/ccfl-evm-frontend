import cssClass from '@/components/home/why/why.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';

export default function WhyComponent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.whyComponent)}>
      <div className="why-container">why component here</div>
    </div>
  );
}
