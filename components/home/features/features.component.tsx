import cssClass from '@/components/home/features/features.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';

export default function FeaturesComponent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.featuresComponent)}>
      <div className="features-container">features component here</div>
    </div>
  );
}
