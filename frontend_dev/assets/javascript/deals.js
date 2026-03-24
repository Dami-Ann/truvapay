<!-- ===== JAVASCRIPT ===== -->
<script>
  /* ---- Badge map ---- */
  const STATUS_MAP = {
    pending:   { label:'⏳ Pending Payment',    cls:'badge-pending' },
    funded:    { label:'💰 In Progress',         cls:'badge-funded' },
    delivered: { label:'📦 Delivered',           cls:'badge-delivered' },
    approved:  { label:'✅ Approved',            cls:'badge-approved' },
    completed: { label:'✅ Completed',           cls:'badge-completed' },
    disputed:  { label:'⚠️ In Dispute',         cls:'badge-dispute' },
  };

  /* ---- Demo data shown when localStorage is empty ---- */
  const DEMO = [
    { dealId:'TRV-2026-00124', type:'standard', title:'Logo Design Project', desc:'Design a modern logo with 3 initial concepts and 2 rounds of revisions.', amount:'200000', date:'2026-04-30', seller:'Okafor Mary', buyer:'Sarah Johnson', status:'funded', created:'2026-04-25T09:00:00' },
    { dealId:'TRV-2026-00098', type:'standard', title:'Landing Page Development', desc:'Build a responsive landing page for product launch.', amount:'350000', date:'2026-04-20', seller:'You', buyer:'Ahmed Ibrahim', status:'completed', created:'2026-04-15T10:00:00' },
    { dealId:'TRV-2026-00077', type:'milestone', title:'Website Redesign Project', desc:'Full website redesign — 3 pages, mobile responsive, CMS handover.', amount:'750000', date:'2026-05-20', seller:'You', buyer:'Grace Obi', status:'pending', created:'2026-04-22T11:00:00' },
    { dealId:'TRV-2026-00055', type:'standard', title:'Brand Identity Package', desc:'Full branding: logo, colors, typography, brand guidelines PDF.', amount:'120000', date:'2026-04-10', seller:'You', buyer:'Tech Startup NG', status:'delivered', created:'2026-04-01T09:00:00' },
  ];

  function getDeals() {
    const stored = JSON.parse(localStorage.getItem('truvapay_deals') || '[]');
    return stored.length > 0 ? stored : DEMO;
  }

  function fmt(n) {
    return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',minimumFractionDigits:0}).format(n);
  }

  function fmtDate(d) {
    return new Date(d).toLocaleDateString('en-NG',{month:'short',day:'numeric',year:'numeric'});
  }

  function renderDeals() {
    const filter = document.getElementById('filterStatus').value;
    let deals = getDeals();
    const all = deals;

    // Update stats
    const inEscrow = all.filter(d => ['funded','delivered'].includes(d.status)).reduce((s,d) => s + Number(d.amount),0);
    const completed = all.filter(d => ['completed','approved'].includes(d.status)).length;
    const disputes = all.filter(d => d.status === 'disputed').length;
    const score = all.length > 0 ? Math.min(100, Math.round(((completed + 0.5*(all.length - completed - disputes)) / all.length) * 100)) : 0;

    document.getElementById('statTotal').textContent     = all.length;
    document.getElementById('statEscrow').textContent    = inEscrow > 0 ? '₦' + Number(inEscrow).toLocaleString() : '₦0';
    document.getElementById('statCompleted').textContent = completed;
    document.getElementById('statScore').textContent     = all.length > 0 ? score + '%' : '—';

    // Trust score card
    document.getElementById('tsNum').textContent        = all.length > 0 ? score : '—';
    document.getElementById('tsDone').textContent       = all.length;
    document.getElementById('tsCompleted').textContent  = completed;
    document.getElementById('tsEscrow').textContent     = inEscrow > 0 ? '₦' + Number(inEscrow).toLocaleString() : '₦0';
    document.getElementById('tsDisputes').textContent   = disputes;

    // Filter
    if (filter !== 'all') deals = deals.filter(d => d.status === filter);

    const list = document.getElementById('dealsList');

    if (deals.length === 0) {
      list.innerHTML = `
        <div style="text-align:center;padding:60px 20px;background:white;border-radius:var(--r-lg);box-shadow:var(--shadow);">
          <div style="font-size:3rem;margin-bottom:12px;">🤝</div>
          <h3 style="margin-bottom:8px;">No deals found</h3>
          <p style="color:var(--text-light);margin-bottom:20px;">Create your first secure deal to get started</p>
          <a href="create-deal.html" class="btn btn-primary btn-lg">Create Your First Deal</a>
        </div>`;
      return;
    }

    list.innerHTML = deals.map(d => {
      const s   = STATUS_MAP[d.status] || STATUS_MAP.pending;
      const amt = fmt(d.amount);
      const dt  = fmtDate(d.date);
      const typePill = d.type === 'milestone'
        ? '<span style="font-size:.72rem;background:#EEF6FF;color:var(--blue);padding:2px 8px;border-radius:99px;font-weight:700;">🪙 Milestone</span>'
        : '';
      return `
        <div class="deal-row" onclick="window.location.href='deal.html?id=${d.dealId}'">
          <div class="deal-row-left" style="flex:1;">
            <h3>${d.title} ${typePill}</h3>
            <p>${d.desc ? d.desc.slice(0,70) + (d.desc.length>70?'…':'') : 'No description'}</p>
          </div>
          <div class="deal-row-right">
            <div>
              <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-light);">Amount</div>
              <div class="deal-row-amount">${amt}</div>
            </div>
            <div>
              <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-light);">Client</div>
              <div class="deal-row-meta" style="font-weight:600;color:var(--text);">${d.buyer || '—'}</div>
            </div>
            <div>
              <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-light);">Deadline</div>
              <div class="deal-row-meta">${dt}</div>
            </div>
            <span class="badge ${s.cls}">${s.label}</span>
          </div>
        </div>`;
    }).join('');
  }

  function copyTrustLink() {
    navigator.clipboard.writeText(`https://truvapay.app/trust/${encodeURIComponent('You')}`);
    const t = document.getElementById('toast');
    t.textContent = '✓ Trust profile link copied! Share it on LinkedIn, Twitter, or your portfolio.';
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 3500);
  }

  renderDeals();
