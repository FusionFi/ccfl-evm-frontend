import cssClass from '@/components/home/form/form.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';

export default function FormComponent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.formComponent)}>
      <div className="form-container">form component here</div>
    </div>
  );
}
