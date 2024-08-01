import cssClass from '@/components/home/statistic.component.module.scss';
import { STAKE_DEFAULT_NETWORK } from '@/constants/stake/networks';
import { STAKE_TOKEN_FROM } from '@/constants/stake/tokens';
import contractService from '@/utils/contract/stOAS.service';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
// @ts-ignore
import AnimatedNumber from 'react-animated-number';
import { twMerge } from 'tailwind-merge';
export default function Statistic() {
  /**
   * STATES
   */
  const initialValue = 0;
  const currentValue = 100000;
  const [neptureStatus, setNeptureStatus] = useState<any | null>(null);
  const [formType, setFormType] = useState('unstake');
  /**
   * FUNCTIONS
   */
  const getNeptureStatus = useCallback(async () => {
    try {
      const provider = { rpcUrl: STAKE_DEFAULT_NETWORK?.rpc };
      const contract_address = STAKE_DEFAULT_NETWORK?.stOASContract;
      const params = {
        // estimateOAS 1 stOAS = xxx OAS
        // estimateStOAS 1 OAS = xxx stOAS
        rate: formType === 'unstake' ? 'estimateOAS' : 'estimateStOAS',
      };
      const rs: any = await contractService.getStOASInfo(provider, contract_address, params);
      setNeptureStatus({
        rate: Number(rs?.exchangeRate),
        total_staked: Number(
          BigNumber(Number(rs?.totalOAS))
            .div(Math.pow(10, STAKE_TOKEN_FROM?.decimals || 18))
            .toFixed(),
        ),
        stakers: Number(rs?.totalStakers),
        stOAS_market: Number(
          BigNumber(Number(rs?.totalStOAS))
            .div(Math.pow(10, STAKE_TOKEN_FROM?.decimals || 18))
            .toFixed(),
        ),
      });
    } catch (error) {
      console.log('getNeptureStatus=>error', error);
    }
  }, [formType]);
  const initData = useCallback(async () => {
    getNeptureStatus();
  }, [getNeptureStatus]);
  /**
   * SIDE EFFECTS
   */
  useEffect(() => {
    initData();
  }, [initData]);

  /**
   * RENDER
   */
  return (
    <div className={twMerge(cssClass.statisticComponent)}>
      <div className="statistic-container">
        <div className="card-item" data-aos="fade-up" data-aos-delay="200">
          <div className="card-bg"> </div>
          <div className="card-title"> Total staked amount</div>
          <div className="card-value">
            <AnimatedNumber
              component="text"
              initialValue={0}
              value={neptureStatus?.total_staked}
              stepPrecision={0}
              style={{
                transition: '2s ease-out',
                fontSize: 38,
                transitionProperty: 'background-color, color, opacity',
              }}
              duration={2000}
              formatValue={(n: any) => Intl.NumberFormat('en-US').format(n)}
            />
            <div className="value-unit"> {STAKE_TOKEN_FROM?.symbol}</div>
          </div>
        </div>
        <div className="card-item" data-aos="fade-up" data-aos-delay="400">
          <div className="card-bg"> </div>
          <div className="card-title"> stOAS market cap</div>
          <div className="card-value">
            <AnimatedNumber
              component="text"
              initialValue={0}
              value={neptureStatus?.stOAS_market}
              stepPrecision={0}
              style={{
                transition: '2s ease-out',
                fontSize: 38,
                transitionProperty: 'background-color, color, opacity',
              }}
              duration={2500}
              formatValue={(n: any) => Intl.NumberFormat('en-US').format(n)}
            />
            <div className="value-unit"> {STAKE_TOKEN_FROM?.symbol}</div>
          </div>
        </div>
        <div className="card-item" data-aos="fade-up" data-aos-delay="600">
          <div className="card-bg"> </div>
          <div className="card-title"> Stakers</div>
          <div className="card-value">
            <AnimatedNumber
              component="text"
              initialValue={0}
              value={neptureStatus?.stakers}
              stepPrecision={0}
              style={{
                transition: '2s ease-out',
                fontSize: 38,
                transitionProperty: 'background-color, color, opacity',
              }}
              duration={3000}
              formatValue={(n: any) => Intl.NumberFormat('en-US').format(n)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
