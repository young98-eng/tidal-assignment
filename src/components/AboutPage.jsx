export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-text">
          <span className="hero-eyebrow">Our story</span>
          <h1 className="about-headline">
            Built for the<br /><em>everyday</em>
          </h1>
        </div>
      </div>

      <div className="about-body">
        <div className="about-intro">
          <p className="about-lead">
            Tidal Commerce started with a simple idea: great clothing shouldn't require a great effort to find.
            We source thoughtfully, design cleanly, and deliver directly — cutting out the noise between you and
            what you actually want to wear.
          </p>
        </div>

        <div className="about-values">
          <div className="about-value">
            <span className="about-value-num">01</span>
            <h3 className="about-value-title">Quality First</h3>
            <p className="about-value-text">
              Every piece in our catalogue is selected for durability and feel. We don't
              list it if we wouldn't wear it ourselves.
            </p>
          </div>
          <div className="about-value">
            <span className="about-value-num">02</span>
            <h3 className="about-value-title">Thoughtful Sourcing</h3>
            <p className="about-value-text">
              We work with makers who share our standards — fair conditions, responsible
              materials, and transparent supply chains.
            </p>
          </div>
          <div className="about-value">
            <span className="about-value-num">03</span>
            <h3 className="about-value-title">Made to Last</h3>
            <p className="about-value-text">
              Trends fade. We focus on pieces that outlast a season and work across
              your whole wardrobe.
            </p>
          </div>
        </div>

        <div className="about-cta-block">
          <h2 className="about-cta-headline">Ready to shop?</h2>
          <a href="/" className="btn-primary about-cta-btn">Explore the Collection →</a>
        </div>
      </div>
    </div>
  );
}
