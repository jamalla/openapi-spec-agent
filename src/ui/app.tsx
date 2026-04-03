import React from 'react';

export function App() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', padding: 24, background: '#f5f7fb', minHeight: '100vh' }}>
      <h1>Lifecycle dashboard</h1>
      <p>AI-assisted endpoint orchestration and deterministic OpenAPI contract validation.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px,1fr))', gap: 12 }}>
        <Card title="Manual spec trust" value="74/100" />
        <Card title="OpenAPI 3 compatibility" value="81/100" />
        <Card title="Live verified coverage" value="52/100" />
        <Card title="Generation readiness" value="READY_WITH_FIXES" />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return <div style={{ background: 'white', borderRadius: 12, padding: 14, border: '1px solid #dce3f0' }}><div>{title}</div><strong>{value}</strong></div>;
}
