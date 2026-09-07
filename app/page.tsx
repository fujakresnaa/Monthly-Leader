'use client'

import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'

type Project = {
  id: string
  name: string
  status: string
  tone: 'good' | 'watch' | 'risk'
  progress: number
  priority: 'High' | 'Medium'
  description: string
  contributors: string[]
  update: string
}

const projects: Project[] = [
  { id: 'mega-insurance', name: 'Mega Insurance', status: 'UAT this Wednesday', tone: 'watch', progress: 80, priority: 'Medium', description: 'Migrasi API data forwarding untuk flow klaim kesehatan, terintegrasi dengan sembuh.ai API.', contributors: ['Fuja Kresna · Project Manager', 'Raya · Content Engineer', 'Ozy · Backend Engineer', 'Sylva · QA'], update: 'Konten sudah masuk ke production. UAT bersama tim Mega dijadwalkan hari Rabu ini.' },
  { id: 'wegs', name: 'WEGS', status: 'Blocked — resourcing capacity', tone: 'watch', progress: 85, priority: 'Medium', description: 'Insurance Agency Platform.', contributors: ['Fuja Kresna · Project Manager', 'Cuy · Fullstack Developer'], update: 'Ada beberapa feedback dari hasil UAT terakhir yang perlu dieksekusi, namun tertahan karena beban kerja Cuy sedang tinggi. Masih menunggu penentuan prioritas bersama tim product sebelum eksekusi dilanjutkan.' },
  { id: 'bni-life', name: 'BNI Life (Revamp Websites)', status: 'On track — target Nov 2026', tone: 'good', progress: 87, priority: 'High', description: 'Revamp website existing BNI Life dan integrasi chatbot ke sales platform.', contributors: ['Fuja Kresna · Project Manager', 'Raya · Content Engineer', 'Ozy · Backend Engineer', 'Sylva · QA'], update: 'Memasuki tahap akhir UAT (Dev Env) untuk modul kalkulator. Sempat tertahan karena pihak BNI Life baru menyelesaikan API Kalkulator dua minggu lalu. Target seluruh modul sudah di production sebelum ulang tahun BNI Life di November.' },
  { id: 'rsab', name: 'RSAB Harapan Kita', status: 'Blocked — WABA number & SIMRS API', tone: 'risk', progress: 25, priority: 'Medium', description: 'Chatbot NLP, Omnichannel, dan WhatsApp Broadcast.', contributors: ['Fuja Kresna · Project Manager', 'Zidni · Content Engineer', 'Ozy · Backend Engineer', 'Sylva · QA'], update: 'Dua blocker aktif: nomor WABA existing tidak bisa dimigrasikan karena nomornya sudah dipakai pihak lain — saat ini sedang pengajuan nomor baru; flow appointment juga belum bisa dibangun karena API SIMRS dari tim RSAB belum tersedia. Konten chatbot untuk usecase existing sudah selesai dibuat dan access account sudah diregister. Catatan penagihan: proses billing tetap bisa berjalan, didukung surat dari user yang menyatakan keterlambatan terjadi dari pihak RSAB.' },
  { id: 'bgn-peruri', name: 'BGN x Peruri', status: 'Regression test & knowledge base', tone: 'watch', progress: 100, priority: 'Medium', description: 'Not started ada deskripsi resmi. Aktivitas saat ini berfokus pada penyelesaian temuan keamanan (VAPT) dan transisi chatbot dari GenAI ke NLP.', contributors: ['Fuja Kresna · Project Manager', 'Annisa · Product Manager', 'Ozy · Backend Engineer', 'Sylva · QA', 'Dimas · Fullstack', 'Hedy · Frontend', 'Jovi · Content Engineer'], update: 'Temuan VAPT sudah dikerjakan dan saat ini memasuki tahap regression test. Pasca switching dari GenAI ke NLP chatbot, masih berlangsung penambahan knowledge dalam jumlah cukup banyak, dikerjakan oleh Jovi hingga saat ini.' },
  { id: 'korlantas', name: 'Korlantas', status: 'Recurring WABA template blocks', tone: 'watch', progress: 100, priority: 'Medium', description: 'WhatsApp Broadcast.', contributors: ['Fuja Kresna · Project Manager'], update: 'Pembuatan template broadcast dilakukan berulang kali karena nomor WABA sering diblokir oleh customer, yang berimbas pada template ikut diblokir oleh Meta. Sekitar 3 template yang digunakan harus dibuat ulang dan tidak bisa memakai redaksi yang sama seperti sebelumnya.' },
  { id: 'pertalife', name: 'Pertalife', status: 'Partial go-live — 2 active blockers', tone: 'risk', progress: 80, priority: 'High', description: 'GenAI dan Omnichannel.', contributors: ['Fuja Kresna · Project Manager', 'Zidni · Content Engineer', 'Ozy · Backend Engineer', 'Sylva · QA'], update: 'The project is already running and partially live. Dua blocker masih aktif: akun Google dibanned oleh Google sehingga channel Google My Business belum bisa digunakan, dan SDK mobile apps belum terintegrasi karena mobile developer di sisi Pertalife resign dan belum ada penggantinya. Catatan: hari ini dijadwalkan offline meeting untuk membahas solusi kedua blocker tersebut, sekaligus BAST go-live dan penagihan.' },
  { id: 'frisian-flag', name: 'Frisian Flag Project', status: 'New flow content — weekly cadence', tone: 'watch', progress: 95, priority: 'High', description: 'Chatbot NLP and WhatsApp Campaign.', contributors: ['Jovi · Content Engineer', 'Ozy · Backend Engineer'], update: 'Masih ada pekerjaan dari konten flow baru hampir di setiap minggunya, dan permintaan ini masuk secara direct ke Jovi dari user.' },
  { id: 'saint-gobain', name: 'Saint Gobain Call Center', status: 'Live — awaiting BAST signature', tone: 'good', progress: 90, priority: 'High', description: 'Penambahan channel call untuk web dan mobile.', contributors: ['Fuja Kresna · Project Manager', 'Firman · Mobile Developer', 'Ozy · Backend Engineer', 'Febia · QA'], update: 'The project is live and running; only the BAST signature remains.' },
]

const tracker = [
  ['Mega Insurance', 'Not started', 'Awaiting UAT completion this Wednesday', 'No update available'], ['WEGS', 'No update available', '', 'No update available'], ['BNI Life (Revamp Websites)', 'Not started', 'All modules targeted to go live before Nov 2026', 'No update available'], ['RSAB Harapan Kita', 'Not started', 'Project is at 25% with active blockers', 'In progress'], ['BGN x Peruri', 'No update available', '', 'No update available'], ['Korlantas', 'No update available', '', 'No update available'], ['Pertalife', 'In progress today', 'Offline meeting for go-live BAST is scheduled today', 'In progress today'], ['Frisian Flag Project', 'No update available', '', 'No update available'], ['Saint Gobain Call Center', 'Not started', 'Already live; awaiting BAST signature', 'Awaiting BAST'],
]

function Donut({ value, tone }: { value: number; tone: Project['tone'] }) {
  return <div className={`donut ${tone}`} style={{ '--value': `${value * 3.6}deg` } as CSSProperties}><strong>{value}<small>%</small></strong></div>
}

export default function Page() {
  const [filter, setFilter] = useState<'all' | Project['tone']>('all')
  const visibleProjects = useMemo(() => filter === 'all' ? projects : projects.filter((project) => project.tone === filter), [filter])

  return (
    <main className="report-shell">
      <div className="deck" id="top">
        <section className="hero slide" id="overview">
          <div className="eyebrow"><span className="eyebrow-line" /> Monthly project report <span className="eyebrow-date">08 SEP 2026</span></div>
          <div className="hero-grid">
            <div><h1>Monthly<br /><em>Leadership</em> Report</h1><p className="hero-copy">A structured view of delivery progress, attention areas, and commercial follow-through across the active project portfolio.</p></div>
            <aside className="hero-aside"><span className="aside-label">This month at a glance</span><div className="hero-stat"><strong>9</strong><span>active<br />projects</span></div><p>Every project has a named owner, active contributors, and a current delivery update.</p></aside>
          </div>
          <div className="hero-footer"><span>Prepared for leadership review</span><span>01 / 06</span></div>
        </section>

        <section className="slide light-slide" id="portfolio">
          <div className="section-head"><div><p className="kicker">01 / Portfolio pulse</p><h2>Delivery continues,<br /><em>with two critical areas.</em></h2></div><p className="section-intro">The portfolio is broadly advanced, but external dependencies and team capacity are the main variables to manage this month.</p></div>
          <div className="metric-grid"><div className="metric-card accent"><strong>9</strong><span>active projects</span><small>100% of portfolio</small></div><div className="metric-card"><strong>81<small>%</small></strong><span>average progress</span><small>weighted by project count</small></div><div className="metric-card alert"><strong>2</strong><span>high attention</span><small>RSAB Harapan Kita + Pertalife</small></div><div className="metric-card"><strong>0</strong><span>without detail</span><small>every project has an update</small></div></div>
          <div className="radar"><div><p className="kicker">Leadership attention radar</p><h3>What needs a decision?</h3></div><div className="radar-list"><div><span className="radar-dot risk" /><strong>RSAB Harapan Kita</strong><p>The WABA number and SIMRS API remain external blockers.</p><b>25%</b></div><div><span className="radar-dot risk" /><strong>Pertalife</strong><p>Partial go-live; the Google channel and mobile SDK remain unresolved.</p><b>80%</b></div><div><span className="radar-dot watch" /><strong>WEGS</strong><p>UAT feedback is waiting on capacity and prioritization.</p><b>85%</b></div></div></div>
          <div className="slide-number">02 / 06</div>
        </section>

        <section className="slide dark-slide">
          <div className="section-head dark-head"><div><p className="kicker">02 / Data readout</p><h2>Momentum<br /><em>by project.</em></h2></div><div className="legend"><span><i className="legend-dot good" />On track</span><span><i className="legend-dot watch" />Watch</span><span><i className="legend-dot risk" />Risk</span></div></div>
          <div className="bar-chart">{projects.map((project) => <a href={`#${project.id}`} className="bar-row" key={project.id}><span>{project.name}</span><div className="bar-track"><i className={project.tone} style={{ width: `${project.progress}%` }} /></div><b>{project.progress}%</b></a>)}</div>
          <div className="slide-number">03 / 06</div>
        </section>

        <section className="slide light-slide" id="tracker">
          <div className="section-head"><div><p className="kicker">03 / Commercial readiness</p><h2>BAST & billing<br /><em>tracker.</em></h2></div><p className="section-intro">Commercial follow-through still needs to align with delivery progress. Three projects have active BAST or invoicing activity; six require a clear status update.</p></div>
          <div className="tracker-strip"><div><strong>0</strong><span>BAST completed</span></div><div className="tracker-focus"><strong>3</strong><span>BAST / invoicing in progress</span></div><div><strong>6</strong><span>no update available</span></div></div>
          <div className="table-wrap"><table><thead><tr><th>Project</th><th>BAST status</th><th>Billing / invoice status</th></tr></thead><tbody>{tracker.map(([name, bast, note, invoice]) => <tr key={name}><td><strong>{name}</strong></td><td><span className={`table-badge ${bast === 'No update available' ? 'muted' : bast.includes('Proses') ? 'blue' : 'amber'}`}>{bast}</span>{note && <small>{note}</small>}</td><td><span className={`table-badge ${invoice === 'No update available' ? 'muted' : invoice.includes('Proses') || invoice.includes('berjalan') ? 'blue' : 'amber'}`}>{invoice}</span></td></tr>)}</tbody></table></div>
          <div className="slide-number">04 / 06</div>
        </section>

        <section className="slide light-slide projects-slide" id="details">
          <div className="section-head projects-head"><div><p className="kicker">04 / Project register</p><h2>Every project,<br /><em>in full context.</em></h2></div><div className="filter-group" role="group" aria-label="Filter projects">{(['all', 'good', 'watch', 'risk'] as const).map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)} type="button">{item === 'all' ? 'All' : item === 'good' ? 'On track' : item === 'watch' ? 'Watch' : 'Risk'}</button>)}</div></div>
          <div className="project-grid">{visibleProjects.map((project) => <article className={`project-card ${project.tone}`} id={project.id} key={project.id}><div className="project-card-head"><div><span className="project-index">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span><h3>{project.name}</h3></div><Donut value={project.progress} tone={project.tone} /></div><span className={`status ${project.tone}`}>{project.status}</span><p className="project-description">{project.description}</p><div className="contributors"><span className="mini-label">Contributors</span>{project.contributors.map((person) => <span className="person" key={person}>{person}</span>)}</div><div className={`update ${project.tone}`}><span className="mini-label">Latest update</span>{project.update}</div><div className="priority"><span>Priority</span><strong>{project.priority}</strong></div></article>)}</div>
          <div className="slide-number">05 / 06</div>
        </section>

        <section className="slide outro-slide">
          <div className="outro-content"><p className="kicker">05 / Closing view</p><h2>Keep the<br /><em>momentum.</em></h2><p>Protect the progress already made, resolve external blockers, and improve BAST visibility as the next operating priority.</p><div className="closing-points"><span><b>01</b>Escalate external dependencies</span><span><b>02</b>Lock resourcing decisions</span><span><b>03</b>Close the commercial loop</span></div></div><div className="outro-footer"><span>Thank you</span><span>06 / 06</span></div>
        </section>
      </div>
    </main>
  )
}
