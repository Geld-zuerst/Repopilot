'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Folder, FolderOpen, FileCode, FileText, Search, GitBranch, ChevronRight, Bot, CheckCircle, ExternalLink } from 'lucide-react'

const fileTree = [
  { type: 'folder', name: 'src', depth: 0, open: true },
  { type: 'file', name: 'auth.py', depth: 1, lang: 'py', active: true },
  { type: 'file', name: 'middleware.py', depth: 1, lang: 'py' },
  { type: 'folder', name: 'routes', depth: 1, open: false },
  { type: 'file', name: 'api.py', depth: 2, lang: 'py' },
  { type: 'file', name: 'users.py', depth: 2, lang: 'py' },
  { type: 'folder', name: 'models', depth: 1, open: false },
  { type: 'file', name: 'user.py', depth: 2, lang: 'py' },
  { type: 'folder', name: 'utils', depth: 0, open: false },
  { type: 'file', name: 'helpers.py', depth: 1, lang: 'py' },
  { type: 'folder', name: 'tests', depth: 0, open: false },
  { type: 'file', name: 'test_auth.py', depth: 1, lang: 'py' },
  { type: 'file', name: 'requirements.txt', depth: 0, lang: 'txt' },
  { type: 'file', name: 'README.md', depth: 0, lang: 'md' },
]

const codeLines = [
  { n: 1,  code: <><span className="syntax-keyword">import</span> <span className="syntax-import">jwt</span></> },
  { n: 2,  code: <><span className="syntax-keyword">from</span> <span className="syntax-import">datetime</span> <span className="syntax-keyword">import</span> <span className="syntax-variable">timedelta</span></> },
  { n: 3,  code: <><span className="syntax-keyword">from</span> <span className="syntax-import">functools</span> <span className="syntax-keyword">import</span> <span className="syntax-variable">wraps</span></> },
  { n: 4,  code: '' },
  { n: 5,  code: <><span className="syntax-comment"># JWT Configuration</span></> },
  { n: 6,  code: <><span className="syntax-variable">SECRET_KEY</span> = <span className="syntax-string">os.environ.get('JWT_SECRET')</span></> },
  { n: 7,  code: <><span className="syntax-variable">ALGORITHM</span> = <span className="syntax-string">'HS256'</span></> },
  { n: 8,  code: '' },
  { n: 9,  code: <><span className="syntax-keyword">def</span> <span className="syntax-function">create_token</span>(<span className="syntax-variable">user_id</span>: <span className="syntax-type">str</span>) -&gt; <span className="syntax-type">str</span>:</> },
  { n: 10, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="syntax-variable">payload</span> = &#123;</> },
  { n: 11, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="syntax-string">'sub'</span>: <span className="syntax-variable">user_id</span>,</> },
  { n: 12, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="syntax-string">'exp'</span>: <span className="syntax-variable">datetime.utcnow</span>() + <span className="syntax-variable">timedelta</span>(<span className="syntax-variable">hours</span>=<span className="syntax-number">24</span>),</> },
  { n: 13, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&#125;</> },
  { n: 14, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="syntax-keyword">return</span> <span className="syntax-function">jwt.encode</span>(<span className="syntax-variable">payload</span>, <span className="syntax-variable">SECRET_KEY</span>)</> },
  { n: 15, code: '' },
  { n: 16, code: <><span className="syntax-keyword">def</span> <span className="syntax-function">require_auth</span>(<span className="syntax-variable">f</span>):</> },
  { n: 17, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="syntax-function">@wraps</span>(<span className="syntax-variable">f</span>)</> },
  { n: 18, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="syntax-keyword">def</span> <span className="syntax-function">decorated</span>(*<span className="syntax-variable">args</span>, **<span className="syntax-variable">kwargs</span>):</> },
  { n: 19, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="syntax-variable">token</span> = <span className="syntax-function">request.headers.get</span>(<span className="syntax-string">'Authorization'</span>)</> },
  { n: 20, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="syntax-keyword">if</span> <span className="syntax-keyword">not</span> <span className="syntax-variable">token</span>:</> },
  { n: 21, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="syntax-keyword">return</span> <span className="syntax-function">jsonify</span>(&#123;<span className="syntax-string">'error'</span>: <span className="syntax-string">'Unauthorized'</span>&#125;), <span className="syntax-number">401</span></> },
]

const langColors: Record<string, string> = {
  py: '#3B82F6',
  txt: '#94A3B8',
  md: '#22D3EE',
  js: '#F59E0B',
  ts: '#60A5FA',
}

export default function CodeExplorer() {
  const [activeFile, setActiveFile] = useState('auth.py')
  const [question] = useState('Where is authentication handled?')
  const [showAnswer, setShowAnswer] = useState(true)

  return (
    <section id="explorer" style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg" style={{ opacity: 0.4 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>01 — PRODUCT PREVIEW</div>
          <h2 style={{ marginBottom: 16 }}>
            Your AI-Powered<br />
            <span className="gradient-text">Investigation Workspace</span>
          </h2>
          <p style={{ maxWidth: 560, margin: '0 auto', fontSize: '1.125rem' }}>
            A sophisticated IDE merged with an AI investigation engine.
            Ask questions, trace evidence, and inspect every source reference.
          </p>
        </motion.div>

        {/* IDE Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: 'rgba(13,15,26,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)',
          }}
        >
          {/* Toolbar */}
          <div style={{
            background: 'rgba(7,8,15,0.8)',
            borderBottom: '1px solid rgba(99,102,241,0.15)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Window dots */}
            <div style={{ display: 'flex', gap: 6 }}>
              {['#FF5F56', '#FFBD2E', '#27C93F'].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <GitBranch size={14} color="#6366F1" />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#94A3B8' }}>
                myproject / main
              </span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
                <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
                  INDEXED
                </span>
                <span className="badge badge-violet" style={{ fontSize: '0.65rem' }}>LOCAL AI</span>
              </div>
            </div>
          </div>

          {/* Three panels */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 300px', height: 520 }}
            className="ide-panels">
            {/* LEFT — File Tree */}
            <div style={{
              borderRight: '1px solid rgba(99,102,241,0.12)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Search size={12} color="#6366F1" />
                  <input
                    readOnly
                    value="Find files..."
                    style={{
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: '#475569',
                      fontSize: '0.75rem',
                      fontFamily: 'JetBrains Mono',
                      cursor: 'default',
                    }}
                  />
                </div>
              </div>
              <div style={{ padding: '8px 0', overflowY: 'auto', flex: 1 }} className="panel-scroll">
                {fileTree.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => item.type === 'file' && setActiveFile(item.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 16px',
                      paddingLeft: `${16 + item.depth * 14}px`,
                      cursor: 'pointer',
                      background: activeFile === item.name ? 'rgba(139,92,246,0.15)' : 'transparent',
                      borderLeft: activeFile === item.name ? '2px solid #8B5CF6' : '2px solid transparent',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (activeFile !== item.name) {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.08)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeFile !== item.name) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {item.type === 'folder' ? (
                      item.open ? <FolderOpen size={13} color="#8B5CF6" /> : <Folder size={13} color="#6366F1" />
                    ) : (
                      <FileCode size={13} color={langColors[item.lang || 'txt'] || '#94A3B8'} />
                    )}
                    <span style={{
                      fontSize: '0.775rem',
                      fontFamily: 'JetBrains Mono',
                      color: activeFile === item.name ? '#C4B5FD' : '#94A3B8',
                      fontWeight: activeFile === item.name ? 600 : 400,
                    }}>
                      {item.name}
                    </span>
                    {item.lang && (
                      <span style={{
                        marginLeft: 'auto',
                        width: 6, height: 6,
                        borderRadius: '50%',
                        background: langColors[item.lang] || '#475569',
                      }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CENTER — Code Viewer */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(7,8,15,0.5)',
            }}>
              {/* File tab */}
              <div style={{
                borderBottom: '1px solid rgba(99,102,241,0.1)',
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center',
                height: 36,
              }}>
                <span style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.75rem',
                  color: '#8B5CF6',
                  borderBottom: '2px solid #8B5CF6',
                  paddingBottom: 4,
                  paddingTop: 6,
                  fontWeight: 600,
                }}>
                  {activeFile}
                </span>
              </div>

              {/* Code */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }} className="panel-scroll">
                {codeLines.map(({ n, code }) => (
                  <div
                    key={n}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 16,
                      padding: '2px 20px',
                      background: (n >= 9 && n <= 14) ? 'rgba(139,92,246,0.08)' : 'transparent',
                      borderLeft: (n >= 9 && n <= 14) ? '2px solid rgba(139,92,246,0.4)' : '2px solid transparent',
                    }}
                  >
                    <span style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: '0.72rem',
                      color: '#334155',
                      minWidth: 24,
                      textAlign: 'right',
                      userSelect: 'none',
                      paddingTop: 1,
                    }}>
                      {n}
                    </span>
                    <code style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: '0.78rem',
                      color: '#CBD5E1',
                      lineHeight: 1.7,
                      whiteSpace: 'pre',
                    }}>
                      {code}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — AI Panel */}
            <div style={{
              borderLeft: '1px solid rgba(99,102,241,0.12)',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(10,11,20,0.7)',
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(99,102,241,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <Bot size={14} color="#8B5CF6" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#C4B5FD' }}>RepoPilot AI</span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 16 }} className="panel-scroll">
                {/* User question */}
                <div style={{
                  background: 'rgba(99,102,241,0.12)',
                  borderRadius: '10px 10px 10px 2px',
                  padding: '10px 14px',
                  marginBottom: 16,
                  border: '1px solid rgba(99,102,241,0.2)',
                }}>
                  <p style={{ fontSize: '0.8rem', color: '#E2E8F0', lineHeight: 1.5 }}>{question}</p>
                </div>

                {/* AI Answer */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bot size={11} color="#fff" />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#6366F1', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>REPOPILOT</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.65 }}>
                    Authentication is handled via JWT tokens in{' '}
                    <span className="code-inline">src/auth.py</span>. The{' '}
                    <span className="code-inline">create_token()</span> function generates signed tokens, while{' '}
                    <span className="code-inline">require_auth</span> is a decorator that validates them on protected routes.
                  </p>
                </div>

                {/* Evidence citations */}
                <div style={{
                  background: 'rgba(13,15,26,0.8)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginBottom: 12,
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono', color: '#6366F1', fontWeight: 600 }}>EVIDENCE</span>
                  </div>
                  {[
                    { file: 'src/auth.py', lines: '9–14', desc: 'Token creation' },
                    { file: 'src/auth.py', lines: '16–24', desc: 'Auth decorator' },
                    { file: 'src/middleware.py', lines: '34–46', desc: 'Request validation' },
                  ].map((ref) => (
                    <div
                      key={ref.file + ref.lines}
                      style={{
                        padding: '8px 12px',
                        borderBottom: '1px solid rgba(99,102,241,0.06)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <FileCode size={11} color="#6366F1" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8B5CF6' }}>
                          {ref.file}:{ref.lines}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{ref.desc}</div>
                      </div>
                      <ExternalLink size={10} color="#475569" />
                    </div>
                  ))}
                </div>

                {/* Verified badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={13} color="#34D399" />
                  <span style={{ fontSize: '0.72rem', color: '#34D399', fontFamily: 'JetBrains Mono' }}>
                    Evidence verified — 3 source references
                  </span>
                </div>
              </div>

              {/* Input */}
              <div style={{ padding: 12, borderTop: '1px solid rgba(99,102,241,0.12)' }}>
                <div style={{
                  background: 'rgba(7,8,15,0.8)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <input
                    readOnly
                    value="Ask about this codebase..."
                    style={{
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: '#475569',
                      fontSize: '0.75rem',
                      fontFamily: 'JetBrains Mono',
                      flex: 1,
                    }}
                  />
                  <ChevronRight size={14} color="#6366F1" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ide-panels {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
        }
      `}</style>
    </section>
  )
}
