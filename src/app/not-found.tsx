export const dynamic = 'force-static';

export default function NotFound() {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
              Page Not Found
            </h2>
            <p style={{ marginBottom: '16px', color: '#666' }}>
              Could not find the requested resource
            </p>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                backgroundColor: '#0066cc',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}