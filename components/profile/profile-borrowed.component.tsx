import { ComponentProps } from 'react';
import { useTranslation } from 'next-i18next';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export const ProfileBorrowed = ({}: ComponentProps<any>) => {
  const { t } = useTranslation('common');

  return (
    <div className="my-profile-page-wrapper__borrowed">
      <div className="my-profile-page-wrapper__borrowed__left">
        <div className="my-profile-page-wrapper__borrowed__item">
          <div className="my-profile-page-wrapper__borrowed__item__title">
            {t('MY_PROFILE_BORROWED_BALANCE')}
          </div>
          <div className="my-profile-page-wrapper__borrowed__item__value">
            <span className="my-profile-page-wrapper__borrowed__item__value__unit">$</span>
            1,875.00
          </div>
        </div>
        <div className="my-profile-page-wrapper__borrowed__item">
          <div className="my-profile-page-wrapper__borrowed__item__title">
            {t('MY_PROFILE_BORROWED_COLLATERAL')}
          </div>
          <div className="my-profile-page-wrapper__borrowed__item__value">
            <span className="my-profile-page-wrapper__borrowed__item__value__unit">$</span>
            4,017.87
          </div>
        </div>
      </div>
      <div className="my-profile-page-wrapper__borrowed__right">
        <div className="my-profile-page-wrapper__borrowed__item">
          <div className="my-profile-page-wrapper__borrowed__item__title">
            {t('MY_PROFILE_BORROWED_NET_APY')}
          </div>
          <div className="my-profile-page-wrapper__borrowed__item__value">
            0.07
            <span className="my-profile-page-wrapper__borrowed__item__value__unit">%</span>
          </div>
        </div>
        {/* <div className="my-profile-page-wrapper__borrowed__item">
          <div className="my-profile-page-wrapper__borrowed__item__title">
            {t('MY_PROFILE_BORROWED_FINANCE_HEALTH')}
          </div>
          <div className="my-profile-page-wrapper__borrowed__item__value">
            <span className="my-profile-page-wrapper__borrowed__item__value__health--good">
              1.66B
            </span>
            <Tooltip placement="top" title={'text here'}>
              <InfoCircleOutlined
                size={12}
                style={{
                  color: '#1890FF',
                }}
              />
            </Tooltip>
          </div>
        </div> */}
      </div>
    </div>
  );
};
