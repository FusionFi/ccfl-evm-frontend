import { twMerge } from 'tailwind-merge';
// import css
import { DiscordIcon } from '@/layouts/icons/discord.icon';
import { GithubIcon } from '@/layouts/icons/github.icon';
import { MediumIcon } from '@/layouts/icons/medium.icon';
import { XSocialIcon } from '@/layouts/icons/x-social.icon';
import header from '@/styles/layout/footer.module.scss';
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
    <>
      <div className={twMerge('w-full', header.mainLayoutFooter)}>
        <div className="landing-page-footer">
          <div data-aos="fade-up">
            <div className="footer-logo"></div>
            <div className="social-icons">
              <a href="#" target="_blank">
                <XSocialIcon />
              </a>
              <a href="#" target="_blank">
                <DiscordIcon />
              </a>
              <a href="#" target="_blank">
                <GithubIcon />
              </a>
              <a href="#" target="_blank">
                <MediumIcon />
              </a>
            </div>
            <div className="footer-copyright">© 2024 Nepture. All rights reserved.</div>
          </div>
        </div>
      </div>
    </>
  );
};
