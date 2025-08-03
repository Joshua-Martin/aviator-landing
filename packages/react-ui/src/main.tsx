import { createRoot } from 'react-dom/client';
// Import global styles
import './index.css';
import NavBarRoot from './components/nav/nav-bar-root';
import WaitlistField from './components/waitlist/waitlist-field';
import { AviatorStepRow } from './components/step-row/step-row';
import { VideoDemo } from './components/video-grid/video-demo';
import { HeroImages } from './components/hero/HeroImages';
import { SocialLinks } from './components/social-links/social-links';
import Banner from './components/banner/Banner';
import HeroBackground from './components/hero/HeroBackground';
import { FAQ } from './components/faq'; // FAQ component for root rendering

// Create roots for both components
const navRoot = document.getElementById('nav-root');
const waitlistRoot = document.getElementById('waitlist-root');
const stepRowRoot = document.getElementById('step-row-root');
const videoDemoRoot = document.getElementById('video-demo-root');
const heroImageRoot = document.getElementById('hero-image-root');
const socialLinksRoot = document.getElementById('social-links-root');
const bannerRoot = document.getElementById('banner-root');
const heroBackgroundRoot = document.getElementById('hero-background-root');
const faqRoot = document.getElementById('faq-root'); // Root element for FAQ section

// Render NavBar
if (navRoot) {
  createRoot(navRoot).render(<NavBarRoot />);
}

if (waitlistRoot) {
  createRoot(waitlistRoot).render(<WaitlistField />);
}

if (stepRowRoot) {
  createRoot(stepRowRoot).render(<AviatorStepRow />);
}

if (videoDemoRoot) {
  createRoot(videoDemoRoot).render(<VideoDemo />);
}

if (heroImageRoot) {
  createRoot(heroImageRoot).render(<HeroImages />);
}

if (socialLinksRoot) {
  createRoot(socialLinksRoot).render(<SocialLinks />);
}

if (bannerRoot) {
  createRoot(bannerRoot).render(<Banner />);
}

if (heroBackgroundRoot) {
  createRoot(heroBackgroundRoot).render(
    <HeroBackground className="opacity-80" animationSpeed={1.2} gradientIntensity={0.8} />
  );
}

// Render FAQ section if root exists
if (faqRoot) {
  /**
   * Renders the FAQ component at the #faq-root element.
   * The FAQ component loads its data from the build path and is styled to match the latest design.
   * This block allows easy mounting/unmounting of the FAQ section for future flexibility.
   */
  createRoot(faqRoot).render(<FAQ />);
}

/**Create a root element for the cookie consent banner
const cookieConsentRoot = document.createElement('div');
cookieConsentRoot.id = 'cookie-consent-root';
document.body.appendChild(cookieConsentRoot);

// Render the cookie consent banner - fixed at bottom right and small
createRoot(cookieConsentRoot).render(<CookieConsent position="bottom-right" size="small" />);
*/
