import { useParams, Link } from 'react-router-dom';

const PAGES = {
  'new-arrivals': {
    title: 'New Arrivals',
    eyebrow: 'Just landed',
    sections: [
      {
        heading: "What's New",
        body: "Every week we add fresh pieces sourced from our partner makers. From lightweight summer tops to versatile outerwear — stay ahead of the season.",
      },
      {
        heading: 'How We Curate',
        body: "Our buyers travel to trade shows and independent studios across North America to find pieces that meet our standards for quality, fit, and longevity.",
      },
    ],
    cta: { label: 'Shop All Products', to: '/' },
  },
  shipping: {
    title: 'Shipping & Returns',
    eyebrow: 'Delivery & policy',
    sections: [
      {
        heading: 'Free Shipping',
        body: 'All orders over $75 CAD ship free within Canada and the continental US. Orders under $75 ship for a flat $7.95. Orders are processed within 1–2 business days.',
      },
      {
        heading: 'Delivery Times',
        body: 'Standard delivery: 3–7 business days. Expedited delivery: 1–3 business days (additional fee). International shipping available — rates calculated at checkout.',
      },
      {
        heading: 'Free Returns',
        body: "Not happy with your order? Return it within 30 days of delivery for a full refund. Items must be unworn, unwashed, and in original packaging. We'll email you a prepaid return label.",
      },
    ],
    cta: { label: 'Start Shopping', to: '/' },
  },
  sizing: {
    title: 'Sizing Guide',
    eyebrow: 'Find your fit',
    table: [
      { size: 'XS', chest: '32–34"', waist: '26–28"', hips: '34–36"' },
      { size: 'S',  chest: '35–37"', waist: '29–31"', hips: '37–39"' },
      { size: 'M',  chest: '38–40"', waist: '32–34"', hips: '40–42"' },
      { size: 'L',  chest: '41–43"', waist: '35–37"', hips: '43–45"' },
      { size: 'XL', chest: '44–46"', waist: '38–40"', hips: '46–48"' },
      { size: '2XL',chest: '47–49"', waist: '41–43"', hips: '49–51"' },
    ],
    sections: [
      {
        heading: 'How to Measure',
        body: 'Use a soft measuring tape. Chest: measure around the fullest part. Waist: measure around your natural waistline. Hips: measure around the fullest part of your hips. When between sizes, size up for a relaxed fit or size down for a slim fit.',
      },
    ],
    cta: { label: 'Shop Now', to: '/' },
  },
  faq: {
    title: 'FAQ',
    eyebrow: 'Frequently asked',
    faqs: [
      { q: 'When will my order ship?', a: 'Orders are processed within 1–2 business days. You will receive a tracking number via email once your order ships.' },
      { q: 'Do you offer free returns?', a: 'Yes. Return any unworn item within 30 days for a full refund. We provide a prepaid return label.' },
      { q: 'Can I change or cancel my order?', a: 'Contact us within 2 hours of placing your order. Once an order has been processed for shipping, we are unable to make changes.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship to over 30 countries. International shipping rates are calculated at checkout.' },
      { q: 'How do I know which size to order?', a: 'Check our Sizing Guide for detailed measurements. When in doubt, size up — our pieces are cut to slim-true to fit.' },
      { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, Apple Pay, Google Pay, and PayPal.' },
    ],
    cta: { label: 'Back to Shopping', to: '/' },
  },
  contact: {
    title: 'Contact Us',
    eyebrow: 'Get in touch',
    sections: [
      {
        heading: 'Customer Support',
        body: 'Our team is available Monday – Friday, 9 AM – 6 PM EST. We typically respond within 24 hours.',
      },
      {
        heading: 'Email',
        body: 'support@tidalcommerce.ca',
      },
      {
        heading: 'Press & Partnerships',
        body: 'For press inquiries and wholesale partnerships, email us at partners@tidalcommerce.ca',
      },
    ],
    cta: { label: 'Back to Shopping', to: '/' },
  },
  careers: {
    title: 'Careers',
    eyebrow: 'Join the team',
    sections: [
      {
        heading: 'Who We Are',
        body: 'Tidal Commerce is a small, passionate team building the next generation of curated fashion retail. We believe in quality over quantity — in our products and in our people.',
      },
      {
        heading: 'Open Roles',
        body: "We're currently hiring: Senior Full-Stack Engineer (React + Node.js), Buyer & Merchandiser, and a Digital Marketing Lead. All roles are hybrid — Toronto, ON.",
      },
      {
        heading: 'How to Apply',
        body: 'Send your CV and a short intro to careers@tidalcommerce.ca. We review every application and respond within 2 weeks.',
      },
    ],
    cta: { label: 'Back to Home', to: '/' },
  },
  press: {
    title: 'Press',
    eyebrow: 'In the news',
    sections: [
      {
        heading: '"Best New Canadian Fashion Brand" — Toronto Life, 2026',
        body: '"Tidal Commerce has quietly become one of the most thoughtful players in the Canadian direct-to-consumer space, marrying editorial sensibility with accessible pricing."',
      },
      {
        heading: '"Top 10 Sustainable Brands to Watch" — The Globe & Mail, 2026',
        body: '"Their commitment to responsible sourcing and clean design sets them apart from the noise of fast fashion."',
      },
      {
        heading: 'Press Inquiries',
        body: 'For media kits, lookbook requests, and interview opportunities, contact press@tidalcommerce.ca',
      },
    ],
    cta: { label: 'Shop the Collection', to: '/' },
  },
};

export default function InfoPage() {
  const { slug } = useParams();
  const page = PAGES[slug];

  if (!page) {
    return (
      <div className="info-page">
        <div className="info-hero">
          <span className="hero-eyebrow">404</span>
          <h1 className="info-headline">Page not found</h1>
        </div>
        <div className="info-body">
          <Link to="/" className="btn-primary info-cta-btn">Back to Shop →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="info-page">
      <div className="info-hero">
        <span className="hero-eyebrow">{page.eyebrow}</span>
        <h1 className="info-headline">{page.title}</h1>
      </div>

      <div className="info-body">
        {page.table && (
          <div className="info-table-wrap">
            <table className="info-size-table">
              <thead>
                <tr>
                  <th>Size</th><th>Chest</th><th>Waist</th><th>Hips</th>
                </tr>
              </thead>
              <tbody>
                {page.table.map(row => (
                  <tr key={row.size}>
                    <td><strong>{row.size}</strong></td>
                    <td>{row.chest}</td>
                    <td>{row.waist}</td>
                    <td>{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {page.faqs ? (
          <div className="info-faqs">
            {page.faqs.map((item, i) => (
              <details key={i} className="info-faq-item">
                <summary className="info-faq-q">{item.q}</summary>
                <p className="info-faq-a">{item.a}</p>
              </details>
            ))}
          </div>
        ) : (
          page.sections?.map((s, i) => (
            <div key={i} className="info-section">
              <h3 className="info-section-title">{s.heading}</h3>
              <p className="info-section-body">{s.body}</p>
            </div>
          ))
        )}

        <div className="info-cta-row">
          <Link to={page.cta.to} className="btn-primary info-cta-btn">
            {page.cta.label} →
          </Link>
        </div>
      </div>
    </div>
  );
}
