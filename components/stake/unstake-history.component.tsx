//Import components

//import css class module
import cssClass from '@/components/stake/unstake-history.module.scss';
import { toCurrency } from '@/utils/common';
import { formatTime } from '@/utils/time.util';
import { twMerge } from 'tailwind-merge';
export default function UnstakeHistory({
  className,
  list,
  inputFrom,
  inputTo,
}: {
  className?: string;
  list: any;
  inputFrom: any;
  inputTo: any;
}) {
  /**
   * STATES
   */

  /**
   * HOOKS
   */

  /**
   * FUNCTIONS
   */

  /**
   * RENDERS
   */
  return (
    <div className={twMerge('', cssClass.unstakeHistory, className)}>
      {list?.map((item: any, index: number) => {
        return (
          <div key={item.id}>
            <div className="unstake-history-item">
              <div className="unstake-history-item-label">
                {formatTime(item.unstakeTime, 'DD/MM/YYYY HH:mm')}
              </div>
              <div className="unstake-history-item-value">
                {toCurrency(item.withdrawAmount)} {inputTo?.symbol}
              </div>
              <div className="unstake-history-item-label">
                {formatTime(item.withdrawTime, 'DD/MM/YYYY HH:mm')}
              </div>
              <div className={`unstake-history-item-label ${item?.status?.toLowerCase()}`}>
                {item.status}
              </div>
            </div>
            <hr />
          </div>
        );
      })}
    </div>
  );
}
