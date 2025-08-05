import { createRoot } from 'react-dom/client';
// Import global styles
import './index.css';
import NavBarRoot from './components/nav/nav-bar-root';
import WaitlistField from './components/waitlist/waitlist-field';
import { HeroVideo } from './components/hero/hero-video';
import { VideoDemo } from './components/video-grid/video-demo';
import { SocialLinks } from './components/social-links/social-links';
import Banner from './components/banner/Banner';
import { FAQ } from './components/faq'; // FAQ component for root rendering
import CookieConsent from './components/cookies/CookieConsent';
import IntegrationScroll from './components/integration-scroll/IntegrationScroll';

// Create roots for both components
const navRoot = document.getElementById('nav-root');
const waitlistRoot = document.getElementById('waitlist-root');
const videoDemoRoot = document.getElementById('video-demo-root');
const integrationScrollRoot = document.getElementById('integration-scroll-root');
const heroVideoRoot = document.getElementById('hero-video-root');
const socialLinksMobileRoot = document.getElementById('social-links-mobile');
const socialLinksDesktopRoot = document.getElementById('social-links-desktop');
const bannerRoot = document.getElementById('banner-root');
const faqRoot = document.getElementById('faq-root'); // Root element for FAQ section

// Render NavBar
if (navRoot) {
  createRoot(navRoot).render(<NavBarRoot />);
}

if (waitlistRoot) {
  createRoot(waitlistRoot).render(<WaitlistField />);
}

if (videoDemoRoot) {
  createRoot(videoDemoRoot).render(<VideoDemo />);
}

if (integrationScrollRoot) {
  createRoot(integrationScrollRoot).render(<IntegrationScroll />);
}

if (heroVideoRoot) {
  createRoot(heroVideoRoot).render(<HeroVideo />);
}

if (socialLinksMobileRoot) {
  createRoot(socialLinksMobileRoot).render(<SocialLinks />);
}

if (socialLinksDesktopRoot) {
  createRoot(socialLinksDesktopRoot).render(<SocialLinks />);
}

if (bannerRoot) {
  createRoot(bannerRoot).render(<Banner />);
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

/**Create a root element for the cookie consent banner*/
const cookieConsentRoot = document.createElement('div');
cookieConsentRoot.id = 'cookie-consent-root';
document.body.appendChild(cookieConsentRoot);

// Render the cookie consent banner - fixed at bottom right and small
createRoot(cookieConsentRoot).render(<CookieConsent position="bottom-right" size="small" />);

