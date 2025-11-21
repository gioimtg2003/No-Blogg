export default function Home() {
  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>No-Blogg CMS</h1>
          <nav className="nav">
            <a href="/login">Login</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Welcome to No-Blogg
          </h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', color: '#666' }}>
            A production-ready multi-tenant CMS starter built with modern technologies
          </p>

          <div className="grid grid-cols-2">
            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                🏢 Multi-tenant
              </h3>
              <p style={{ color: '#666' }}>
                Support multiple organizations with isolated data and customizable settings
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                🔒 Authentication
              </h3>
              <p style={{ color: '#666' }}>
                Secure JWT-based authentication with role-based access control
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                📝 Content Management
              </h3>
              <p style={{ color: '#666' }}>
                Full-featured CMS for creating and managing blog posts
              </p>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                🚀 Modern Stack
              </h3>
              <p style={{ color: '#666' }}>
                TypeScript, Next.js, Express, Prisma, and PostgreSQL
              </p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              Quick Start
            </h3>
            <ol style={{ marginLeft: '1.5rem', color: '#666', lineHeight: '2' }}>
              <li>Choose a tenant (acme-corp or demo-org)</li>
              <li>
                Login with demo credentials:
                <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li>Admin: admin@acme.com / password123</li>
                  <li>Editor: editor@acme.com / password123</li>
                </ul>
              </li>
              <li>Start creating and managing content!</li>
            </ol>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <a href="/login">
              <button className="button">Get Started</button>
            </a>
            <a href="https://github.com/gioimtg2003/No-Blogg" target="_blank" rel="noopener noreferrer">
              <button className="button button-secondary">View on GitHub</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
