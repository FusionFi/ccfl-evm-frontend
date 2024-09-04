import { ComponentProps } from 'react';
import { useTranslation } from 'next-i18next';

export const ProfileSupply = ({ }: ComponentProps<any>) => {
  const { t } = useTranslation('common');

  return <div className="my-profile-page-wrapper__supply">
    <div className="my-profile-page-wrapper__supply__item">
      <span className="my-profile-page-wrapper__supply__item__label">
        {t('MY_PROFILE_SUPPLY_TOTAL')}
      </span>
      <div className="my-profile-page-wrapper__supply__item__value">
        ${' '}
        <span
          className="font-bold"
          style={{
            color: '#F0F0F0',
          }}>
          4,567.87
        </span>
      </div>
    </div>
    <div className="my-profile-page-wrapper__supply__item">
      <span className="my-profile-page-wrapper__supply__item__label">
        {t('MY_PROFILE_SUPPLY_NET_APY')}
      </span>
      <div className="my-profile-page-wrapper__supply__item__value">
        <span
          className="font-bold"
          style={{
            color: '#F0F0F0',
          }}>
          0.07
        </span>{' '}
        %
      </div>
    </div>
    <div className="my-profile-page-wrapper__supply__item">
      <span className="my-profile-page-wrapper__supply__item__label">
        {t('MY_PROFILE_SUPPLY_TOTAL_EARNED')}
      </span>
      <div className="my-profile-page-wrapper__supply__item__value">
        <span
          className="font-bold"
          style={{
            color: '#52C41A',
          }}>
          +$65.87
        </span>
      </div>
    </div>
  </div> 
};
