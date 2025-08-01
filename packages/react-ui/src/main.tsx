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

// Create roots for both components
const navRoot = document.getElementById('nav-root');
const waitlistRoot = document.getElementById('waitlist-root');
const stepRowRoot = document.getElementById('step-row-root');
const videoDemoRoot = document.getElementById('video-demo-root');
const heroImageRoot = document.getElementById('hero-image-root');
const socialLinksRoot = document.getElementById('social-links-root');
const bannerRoot = document.getElementById('banner-root');

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

/**Create a root element for the cookie consent banner
const cookieConsentRoot = document.createElement('div');
cookieConsentRoot.id = 'cookie-consent-root';
document.body.appendChild(cookieConsentRoot);

// Render the cookie consent banner - fixed at bottom right and small
createRoot(cookieConsentRoot).render(<CookieConsent position="bottom-right" size="small" />);
*/
