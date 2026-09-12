import React, { useState } from 'react';
import { FileText, Download, Calendar, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);

  const handleGenerate = async (format = 'csv') => {
    setGenerating(true);
    setReportUrl(null);
    try {
      const response = await axios.post(`${API_BASE}/reports/generate`, null, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setReportUrl(url);
    } catch (err) {
      console.error('Report generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <FileText size={24} /> Reports
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Generate and download classified hotspot reports for analysis and compliance.
      </p>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Generate New Report</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1rem', cursor: 'pointer', textAlign: 'center', border: '1px solid var(--border)' }}>
            <Calendar size={28} style={{ marginBottom: 8, color: 'var(--accent)' }} />
            <div style={{ fontWeight: 500 }}>Last 7 Days</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Default report range</div>
          </div>
          <div className="glass-card" style={{ padding: '1rem', cursor: 'pointer', textAlign: 'center', border: '1px solid var(--border)', opacity: 0.6 }}>
            <Calendar size={28} style={{ marginBottom: 8, color: 'var(--text-secondary)' }} />
            <div style={{ fontWeight: 500 }}>Custom Range</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Coming soon</div>
          </div>
        </div>

        <button
          onClick={() => handleGenerate('csv')}
          disabled={generating}
          style={{
            padding: '0.75rem 2rem', borderRadius: 8, border: 'none', fontWeight: 600,
            cursor: generating ? 'wait' : 'pointer', fontSize: '0.95rem', width: '100%',
            background: 'linear-gradient(135deg, var(--accent), #f97316)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {generating ? <><Loader2 size={18} className="spin" /> Generating…</> : <><Download size={18} /> Generate CSV Report</>}
        </button>

        {reportUrl && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <p style={{ color: '#22c55e', fontWeight: 500, marginBottom: 8 }}>✅ Report generated successfully!</p>
            <a
              href={reportUrl}
              download="ignis_report.csv"
              style={{ color: 'var(--accent)', fontWeight: 600 }}
            >
              ⬇ Download ignis_report.csv
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
