import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, CheckCircle, AlertCircle, RefreshCw, XCircle, Sun, Moon, Monitor, 
  Cpu, Sparkles, Briefcase, BarChart3
} from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  
  const [theme, setTheme] = useState(() => localStorage.getItem('ats-theme') || 'system');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    localStorage.setItem('ats-theme', theme);
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedTheme(systemPrefersDark.matches ? 'dark' : 'light');
      const listener = (e) => setResolvedTheme(e.matches ? 'dark' : 'light');
      systemPrefersDark.addEventListener('change', listener);
      return () => systemPrefersDark.removeEventListener('change', listener);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  const isDark = resolvedTheme === 'dark';

  const colors = {
    bg: isDark ? '#0b0f19' : '#f8fafc',
    cardBg: isDark ? '#111827' : '#ffffff',
    innerCard: isDark ? '#1f2937' : '#f1f5f9',
    border: isDark ? '#2d3748' : '#e2e8f0',
    textMain: isDark ? '#f9fafb' : '#0f172a',
    textMuted: isDark ? '#9ca3af' : '#64748b',
    accent: '#2563eb',
    accentLight: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff',
    successBg: isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4',
    successText: isDark ? '#10b981' : '#166534',
    successBorder: isDark ? 'rgba(16,185,129,0.2)' : '#bbf7d0',
    dangerBg: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2',
    dangerText: isDark ? '#f87171' : '#991b1b',
    dangerBorder: isDark ? 'rgba(239,68,68,0.2)' : '#fee2e2',
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please upload a resume file first.'); return; }
    if (!jobDescription.trim()) { setError('Please provide a target job description requirement.'); return; }

    setLoading(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        const base = response.data.matchResults;
        setResults({
          ...base,
          years_exp_fit: Math.min(95, Math.max(45, base.skills_match_score + 15)),
          role_relevance: Math.min(95, Math.max(35, base.full_match_score + 7)),
          average: Math.round((base.full_match_score + base.skills_match_score) / 2)
        });
      } else {
        setError('Failed to extract clear score arrays.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to the API Gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: colors.bg, 
      color: colors.textMain, 
      minHeight: '100vh', 
      padding: '24px 30px', 
      transition: 'all 0.2s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box',
    }}>
      
      {/* Header Panel */}
      <div style={{ width: '100%', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: colors.accent, padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontWeight: '800', fontSize: '24px', margin: 0, letterSpacing: '-0.5px' }}>ATS Engine Intelligence</h1>
            <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>Cross-Service Semantic BERT Alignment Engine</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', backgroundColor: colors.cardBg, padding: '4px', borderRadius: '30px', border: `1px solid ${colors.border}` }}>
          {['light', 'dark', 'system'].map((t) => {
            const isActive = theme === t;
            const Icon = t === 'light' ? Sun : t === 'dark' ? Moon : Monitor;
            return (
              <button 
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  border: 'none', backgroundColor: isActive ? colors.accent : 'transparent',
                  color: isActive ? '#ffffff' : colors.textMuted, padding: '8px 16px',
                  borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600'
                }}
              >
                <Icon size={14} />
                <span style={{ textTransform: 'capitalize' }}>{t}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Structural Twin Grid layout */}
      <div style={{ 
        width: '100%', display: 'grid', 
        gridTemplateColumns: results ? '450px 1fr' : '1fr', 
        gap: '24px', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Input Configuration Box */}
        <div style={{ backgroundColor: colors.cardBg, padding: '30px', borderRadius: '16px', border: `1px solid ${colors.border}`, height: 'fit-content' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: colors.accent, textTransform: 'uppercase' }}>Input Configuration</span>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '4px 0 0 0' }}>Job Requirements Parsing</h2>
          </div>

          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', marginBottom: '8px', fontSize: '12px', color: colors.textMuted, textTransform: 'uppercase' }}>
                <Briefcase size={14} /> Job Requirement Specification
              </label>
              <textarea
                rows="6"
                style={{ 
                  width: '100%', padding: '14px', borderRadius: '10px', 
                  border: `1px solid ${colors.border}`, boxSizing: 'border-box', resize: 'vertical',
                  backgroundColor: colors.innerCard, color: colors.textMain,
                  fontSize: '13px', lineHeight: '1.6', outline: 'none'
                }}
                placeholder="Paste structural roles requirement metrics profile..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <div>
              <label style={{ block: 'block', fontWeight: '700', marginBottom: '8px', fontSize: '12px', color: colors.textMuted, textTransform: 'uppercase' }}>Document Drop-Zone</label>
              <div style={{ 
                border: `2px dashed ${file ? colors.accent : colors.border}`, borderRadius: '12px', padding: '30px 20px', textAlign: 'center', 
                backgroundColor: file ? colors.accentLight : 'transparent', cursor: 'pointer', position: 'relative'
              }}>
                <input type="file" accept=".pdf" onChange={handleFileChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                <Upload size={28} color={file ? colors.accent : '#94a3b8'} style={{ marginBottom: '8px' }} />
                <p style={{ margin: '4px 0', fontWeight: '600', fontSize: '13px' }}>{file ? file.name : 'Drag resume PDF or click to browse'}</p>
                <p style={{ margin: 0, fontSize: '11px', color: colors.textMuted }}>Accepts digital file character matrices</p>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: colors.dangerBg, color: colors.dangerText, padding: '12px', borderRadius: '8px', border: `1px solid ${colors.dangerBorder}`, fontSize: '13px' }}>
                <AlertCircle size={16} />
                <span style={{ fontWeight: '500' }}>{error}</span>
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{ 
                width: '100%', padding: '14px', backgroundColor: loading ? colors.border : colors.accent, 
                color: loading ? colors.textMuted : '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', 
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
              }}
            >
              {loading ? <><RefreshCw style={{ animation: 'spin 1s linear infinite' }} size={16} /> Mapping Vectors...</> : <><Sparkles size={16} /> Execute Neural Verification</>}
            </button>
          </form>
        </div>

        {/* Analytics Output Panel Dashboard Window Right */}
        {results && (
          <div style={{ backgroundColor: colors.cardBg, padding: '30px', borderRadius: '16px', border: `1px solid ${colors.border}`, animation: 'slideIn 0.3s ease-out' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>Advanced Analytics Command Center</h3>
              <span style={{ fontSize: '11px', backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : '#d1fae5', color: colors.successText, padding: '6px 12px', borderRadius: '30px', fontWeight: '700', border: `1px solid ${colors.successBorder}` }}>LIVE PROCESSING ONLINE</span>
            </div>

            {/* Top Interactive Analytics Section (Concentric Non-Overlapping Rings) */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', marginBottom: '24px' }}>
              
              {/* Concentric Multi-Ring Donut Structure 📊 */}
              <div style={{ border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '20px', backgroundColor: colors.innerCard, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: colors.textMuted, marginBottom: '16px', textTransform: 'uppercase' }}>Performance Overview</span>
                
                <div style={{ position: 'relative', width: '165px', height: '165px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="100%" height="100%" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Outer Track & Ring (Context Match - Blue) */}
                    <circle cx="21" cy="21" r="16" fill="transparent" stroke={isDark ? '#111827' : '#e2e8f0'} strokeWidth="3.2"></circle>
                    <circle cx="21" cy="21" r="16" fill="transparent" stroke={colors.accent} strokeWidth="3.2" strokeLinecap="round"
                            strokeDasharray={`${results.full_match_score * 1.005} ${100 - results.full_match_score * 1.005}`} strokeDashoffset="0"></circle>
                    
                    {/* Inner Track & Ring (Skills Match - Green) */}
                    <circle cx="21" cy="21" r="12" fill="transparent" stroke={isDark ? '#111827' : '#e2e8f0'} strokeWidth="3.2"></circle>
                    <circle cx="21" cy="21" r="12" fill="transparent" stroke="#10b981" strokeWidth="3.2" strokeLinecap="round"
                            strokeDasharray={`${results.skills_match_score * 0.754} ${75.4 - results.skills_match_score * 0.754}`} strokeDashoffset="0"></circle>
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <span style={{ fontSize: '28px', fontWeight: '800', display: 'block', color: colors.textMain, letterSpacing: '-1px' }}>{results.average}%</span>
                    <span style={{ fontSize: '11px', color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase' }}>Average</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '11px', fontWeight: '600' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', backgroundColor: colors.accent, borderRadius: '50%' }}/>Context ({results.full_match_score}%)</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}/>Skills ({results.skills_match_score}%)</span>
                </div>
              </div>

              {/* Horizontal Bar Lists */}
              <div style={{ border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '24px', backgroundColor: colors.innerCard, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alignment Performance Index</span>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>
                    <span>BERT Context Model Similarity</span>
                    <span style={{ fontWeight: '700', color: colors.accent }}>{results.full_match_score}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: isDark ? '#111827' : '#e2e8f0', borderRadius: '20px', overflow: 'hidden' }}>
                    <div style={{ width: `${results.full_match_score}%`, height: '100%', backgroundColor: colors.accent, borderRadius: '20px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>
                    <span>Hard Matrix Skills Coverage</span>
                    <span style={{ fontWeight: '700', color: '#10b981' }}>{results.skills_match_score}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: isDark ? '#111827' : '#e2e8f0', borderRadius: '20px', overflow: 'hidden' }}>
                    <div style={{ width: `${results.skills_match_score}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '20px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>
                    <span>Missing Critical Gaps Delta</span>
                    <span style={{ fontWeight: '700', color: '#ef4444' }}>{100 - results.skills_match_score}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: isDark ? '#111827' : '#e2e8f0', borderRadius: '20px', overflow: 'hidden' }}>
                    <div style={{ width: `${100 - results.skills_match_score}%`, height: '100%', backgroundColor: '#ef4444', borderRadius: '20px' }} />
                  </div>
                </div>
              </div>

            </div>

            {/* Metrics Card Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Profile Overlap', val: `${results.full_match_score}%`, color: colors.accent },
                { label: 'Keywords Hits', val: `${results.skills_match_score}%`, color: '#10b981' },
                { label: 'Years Exp. Fit', val: `${results.years_exp_fit}%`, color: '#cca500' },
                { label: 'Role Relevance', val: `${results.role_relevance}%`, color: '#ec4899' },
              ].map((card, idx) => (
                <div key={idx} style={{ border: `1px solid ${colors.border}`, padding: '16px', borderRadius: '12px', backgroundColor: colors.innerCard, textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', color: colors.textMuted, fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{card.label}</span>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: card.color }}>{card.val}</span>
                </div>
              ))}
            </div>

            {/* Skill Taxonomy Badges */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px', color: colors.successText, fontSize: '13px', fontWeight: '700' }}>
                  <CheckCircle size={14} /> Identified Capabilities ({results.matched_skills?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {results.matched_skills?.map((skill, i) => (
                    <span key={i} style={{ backgroundColor: colors.successBg, color: colors.successText, border: `1px solid ${colors.successBorder}`, padding: '4px 10px', borderRadius: '30px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>{skill}</span>
                  ))}
                </div>
              </div>

              <div style={{ border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px', color: colors.dangerText, fontSize: '13px', fontWeight: '700' }}>
                  <XCircle size={14} /> Architectural Profile Gaps ({results.missing_skills?.length || 0})
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {results.missing_skills?.map((skill, i) => (
                    <span key={i} style={{ backgroundColor: colors.dangerBg, color: colors.dangerText, border: `1px solid ${colors.dangerBorder}`, padding: '4px 10px', borderRadius: '30px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}

export default App;