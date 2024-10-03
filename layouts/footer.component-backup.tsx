import { twMerge } from 'tailwind-merge';
// import css
import header from '@/styles/layout/footer.module.scss';
import Image from 'next/image';
export const MainFooter = () => {
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
    <div className={twMerge('w-full', header.mainLayoutFooter)}>
      <div className="landing-page-footer" data-aos="fade-up">
        <div className="footer-logo">
          <Image src="/images/landing/emurgo.png" alt="logo" width={260} height={64} />
        </div>
        <div className="social-icons">
          <a href="#" target="_blank">
            <Image src="/images/landing/x-social.png" alt="logo" width={64} height={64} />
          </a>
          <a href="#" target="_blank">
            <Image src="/images/landing/facebook.png" alt="logo" width={64} height={64} />
          </a>
          <a href="#" target="_blank">
            <Image src="/images/landing/linkedin.png" alt="logo" width={64} height={64} />
          </a>
        </div>
      </div>
    </div>
  );
};
