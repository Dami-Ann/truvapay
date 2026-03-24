!-- ===== JAVASCRIPT ===== -->
<script>
  /* ---- Utilities ---- */
  function param(n) { return new URLSearchParams(window.location.search).get(n); }
  function fmt(n)    { return new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',minimumFractionDigits:0}).format(n); }
  function fmtDate(d){ return new Date(d).toLocaleDateString('en-NG',{month:'short',day:'numeric',year:'numeric'}); }
  function toast(m)  {
    const t = document.getElementById('toast');
    t.textContent = m; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 3500);
  }
  function openModal(id)  { document.getElementById(id).classList.add('open'); }
  function closeModal(id) { document.getElementById(id).classList.remove('open'); }

  /* ---- Deal data ---- */
  const dealId = param('id');
  let deal = null;

  const DEMO_DEALS = [
    { dealId:'TRV-2026-00124', type:'standard', title:'Logo Design Project', desc:'Design a modern logo with 3 initial concepts and 2 rounds of revisions.', amount:'200000', date:'2026-04-30', seller:'Okafor Mary Chimaobi', buyer:'Sarah Johnson', status:'funded', created:'2026-04-25T09:00:00' },
    { dealId:'TRV-2026-00098', type:'standard', title:'Landing Page Development', desc:'Build a responsive landing page for product launch with SEO optimization.', amount:'350000', date:'2026-04-20', seller:'You', buyer:'Ahmed Ibrahim', status:'completed', created:'2026-04-15T10:00:00' },
    { dealId:'TRV-2026-00077', type:'milestone', title:'Website Redesign Project', desc:'Full redesign including 3 pages, mobile responsive, CMS setup.', amount:'750000', date:'2026-05-20', seller:'You', buyer:'Grace Obi', status:'pending', created:'2026-04-22T11:00:00',
      milestones:[
        {num:1,name:'Design Mockups',amount:200000,date:'2026-04-30',status:'pending'},
        {num:2,name:'Frontend Development',amount:350000,date:'2026-05-10',status:'pending'},
        {num:3,name:'Final Launch & Handover',amount:200000,date:'2026-05-20',status:'pending'},
      ]
    },
  ];

  function loadDeal() {
    const stored = JSON.parse(localStorage.getItem('truvapay_deals') || '[]');
    deal = stored.find(d => d.dealId === dealId) || DEMO_DEALS.find(d => d.dealId === dealId);

    if (!deal) {
      // Create a fresh demo deal for any unknown ID
      deal = { dealId: dealId || 'TRV-2026-00124', type:'standard', title:'Logo Design Project', desc:'Design a modern logo with 3 initial concepts and 2 rounds of revisions.', amount:'200000', date:'2026-04-30', seller:'Okafor Mary Chimaobi', buyer:'Sarah Johnson', status:'funded', created:'2026-04-25T09:00:00' };
    }

    render();
  }

  /* ---- Status map ---- */
  const STATUS = {
    pending:   { label:'⏳ Pending Payment',       cls:'badge-pending',   step:0 },
    funded:    { label:'💰 Funded – In Progress',   cls:'badge-funded',    step:1 },
    delivered: { label:'📦 Delivered – Awaiting Approval', cls:'badge-delivered', step:2 },
    approved:  { label:'✅ Approved',              cls:'badge-approved',  step:3 },
    completed: { label:'✅ Completed',             cls:'badge-completed', step:4 },
    disputed:  { label:'⚠️ In Dispute',            cls:'badge-dispute',   step:2 },
  };

  const TL_STEPS = [
    { name:'Created',   sub:'Deal created' },
    { name:'Funded',    sub:'Payment received' },
    { name:'Delivered', sub:'Work submitted' },
    { name:'Approved',  sub:'Buyer approved' },
    { name:'Completed', sub:'Payment released' },
  ];

  /* ---- Main render ---- */
  function render() {
    const s    = STATUS[deal.status] || STATUS.pending;
    const pct  = [0,25,50,75,100][s.step] || 0;
    const amtF = fmt(deal.amount);
    const dateF = fmtDate(deal.date);

    document.getElementById('modalAmt').textContent = amtF;

    const html = `
      <!-- HEADER CARD -->
      <div class="card">
        <div class="deal-title-row">
          <h1>${deal.title}</h1>
          <span class="badge ${s.cls}">${s.label}</span>
        </div>
        <p class="deal-desc">${deal.desc || 'No description provided.'}</p>

        <!-- Meta grid -->
        <div class="meta-grid">
          <div>
            <div class="meta-label">Amount</div>
            <div class="meta-val">${amtF}</div>
          </div>
          <div>
            <div class="meta-label">Buyer</div>
            <div class="meta-val" style="font-size:.88rem;">${deal.buyer || '—'}</div>
            <div class="meta-sub">Client</div>
          </div>
          <div>
            <div class="meta-label">Seller</div>
            <div class="meta-val" style="font-size:.88rem;">${deal.seller}</div>
            <div class="meta-sub">Freelancer</div>
          </div>
          <div>
            <div class="meta-label">Deadline</div>
            <div class="meta-val" style="font-size:.88rem;">${dateF}</div>
          </div>
        </div>

        <!-- Timeline -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <h3 style="font-size:.95rem;font-weight:700;">Deal Progress</h3>
          <span style="font-size:.78rem;color:var(--text-light);">Deal ID: #${deal.dealId}</span>
        </div>

        <div class="timeline">
          <div class="tl-track"><div class="tl-fill" style="width:${pct}%"></div></div>
          ${TL_STEPS.map((st,i) => `
            <div class="tl-node">
              <div class="tl-circle ${i < s.step ? 'done' : i === s.step ? 'active' : ''}">
                ${i < s.step ? '✓' : i+1}
              </div>
              <div class="tl-label">
                <span class="tl-name">${st.name}</span>
                <span class="tl-sub">${st.sub}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Escrow banner (if funded+) -->
        ${deal.status !== 'pending' ? `
        <div class="escrow-banner">
          <div class="escrow-banner-left">
            <span style="font-size:1.3rem;">✅</span>
            <div>
              <h4>Funds are secured in escrow</h4>
              <p>${amtF} is held safely and will be released upon approval</p>
            </div>
          </div>
          <div class="secure-tag">🔒 Secure & Protected</div>
        </div>` : ''}
      </div>

      <!-- ACTION CARD -->
      <div class="card">
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:16px;">Current Action Required</h3>
        ${getActionHTML()}
      </div>

      ${deal.type === 'milestone' ? getMilestoneHTML() : ''}

      <!-- BOTTOM TWO GRID -->
      <div class="two-col">
        <!-- Deliver work -->
        <div class="card" style="margin-bottom:0;">
          <h3 style="font-size:.95rem;font-weight:700;margin-bottom:6px;">Deliver Your Work</h3>
          <p style="font-size:.82rem;color:var(--text-light);margin-bottom:16px;">Upload files or share a delivery link when your work is ready.</p>
          ${deal.status === 'funded' ? `
          <div class="upload-area" onclick="openModal('modalDeliver')">
            <div style="font-size:1.8rem;">☁️</div>
            <p>Click to upload or paste a link</p>
          </div>
          <button class="btn btn-primary btn-full" style="margin-top:12px;" onclick="openModal('modalDeliver')">Submit Work</button>
          ` : (deal.status === 'delivered' || deal.status === 'approved' || deal.status === 'completed') ? `
          <div class="upload-area" style="background:#F0FDF4;border-color:#BBF7D0;cursor:default;">
            <div style="font-size:1.8rem;">✅</div>
            <p style="color:var(--success);font-weight:600;">Work delivered successfully!</p>
          </div>
          ` : `
          <div class="upload-area" style="opacity:.4;pointer-events:none;">
            <div style="font-size:1.8rem;">📁</div>
            <p>Available after deal is funded</p>
          </div>
          `}
        </div>

        <!-- Trust & Security -->
        <div class="card" style="margin-bottom:0;">
          <h3 style="font-size:.95rem;font-weight:700;margin-bottom:16px;">Trust & Security</h3>
          <div class="sec-list">
            <div class="sec-item"><span class="sec-icon">🛡️</span><div><h4>Protected by TruvaPay</h4><p>Your funds are 100% safe with escrow protection</p></div></div>
            <div class="sec-item"><span class="sec-icon">🔒</span><div><h4>Escrow Secured</h4><p>Money held until you approve. Auto-releases in 3–5 days.</p></div></div>
            <div class="sec-item"><span class="sec-icon">⚡</span><div><h4>Powered by Interswitch</h4><p>Nigeria's leading payment infrastructure</p></div></div>
            <div class="sec-item"><span class="sec-icon">⚖️</span><div><h4>Dispute Protection</h4><p>Raise a dispute anytime — both sides get fair review</p></div></div>
          </div>
        </div>
      </div>

      <!-- Trust Score Card -->
      <div class="trust-score-card" style="margin-top:20px;">
        <div class="trust-score-badge">⭐ Freelancer Trust Score</div>
        <div class="trust-score-number">94</div>
        <div class="trust-score-label">Trust rating for ${deal.seller}</div>
        <div class="trust-score-row">
          <div class="trust-metric"><span>Completed</span><strong>12 Deals</strong></div>
          <div class="trust-metric"><span>On Time</span><strong>96%</strong></div>
          <div class="trust-metric"><span>Disputes</span><strong>0</strong></div>
          <div class="trust-metric"><span>Avg Rating</span><strong>4.9/5</strong></div>
        </div>
        <!-- Protected Badge -->
        <div class="deal-badge" onclick="copyBadge()" style="margin-top:18px;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);">
          <div class="badge-img">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
          </div>
          <div>
            <h4 style="color:white;">Protected by TruvaPay ✓</h4>
            <p style="color:rgba(255,255,255,.6);">Click to copy badge link for your portfolio or invoices</p>
          </div>
        </div>
      </div>

      <!-- Proof of Payment Card (shown when completed) -->
      <div class="proof-card ${deal.status === 'completed' || deal.status === 'approved' ? 'show' : ''}" id="proofCard">
        <div style="font-size:2.5rem;margin-bottom:8px;">🎉</div>
        <h3>Deal Completed!</h3>
        <div class="proof-amount">${amtF}</div>
        <p>"${deal.title}" — Payment released to ${deal.seller}</p>
        <p style="font-size:.75rem;opacity:.5;">Secured by TruvaPay + Interswitch · ${new Date().toLocaleDateString()}</p>
        <div class="proof-share-btns">
          <button class="proof-share-btn share-twitter" onclick="shareProofTwitter()">🐦 Share on Twitter</button>
          <button class="proof-share-btn share-whatsapp" onclick="shareProofWhatsApp()">📱 Share on WhatsApp</button>
          <button class="proof-share-btn share-copy" onclick="copyProof()">📋 Copy</button>
        </div>
      </div>
    `;

    document.getElementById('dealRoot').innerHTML = html;
  }

  /* ---- Action HTML based on status ---- */
  function getActionHTML() {
    const amtF = fmt(deal.amount);

    if (deal.status === 'pending') {
      return `
        <div class="fund-cta">
          <div style="display:flex;align-items:center;gap:14px;">
            <span style="font-size:1.5rem;">💳</span>
            <div>
              <h4>Fund the Deal to Get Started</h4>
              <p>Securely pay ${amtF} to escrow to begin the project</p>
            </div>
          </div>
          <button class="btn btn-accent" onclick="openModal('modalFund')">Fund Deal Now →</button>
        </div>
        <div class="trust-pills">
          <span class="trust-pill">✅ Money held in escrow</span>
          <span class="trust-pill">✅ Released only after approval</span>
          <span class="trust-pill">✅ 100% secure payment</span>
        </div>`;
    }

    if (deal.status === 'funded') {
      return `
        <div style="background:var(--gray-bg);border-radius:var(--r);padding:18px;margin-bottom:14px;">
          <p style="font-weight:700;margin-bottom:4px;">✅ Deal is funded! Now deliver your work.</p>
          <p style="font-size:.85rem;color:var(--text-light);">Upload your completed work or share a link. The client will be notified to review.</p>
        </div>
        <div class="auto-release-bar">
          <div>
            <h4>⏱️ Auto-Release Active</h4>
            <p>If client doesn't respond within 3–5 days of delivery, payment auto-releases to you.</p>
          </div>
          <div class="countdown" id="countdownTimer">3d 00:00:00</div>
        </div>
        <button class="btn btn-primary" style="margin-top:14px;width:100%;" onclick="openModal('modalDeliver')">📦 Submit Work Now</button>`;
    }

    if (deal.status === 'delivered') {
      return `
        <div style="background:var(--gray-bg);border-radius:var(--r);padding:18px;margin-bottom:16px;">
          <p style="font-weight:700;margin-bottom:4px;">📦 Work has been delivered. Please review.</p>
          <p style="font-size:.85rem;color:var(--text-light);">Approve to release payment, request a revision, or open a dispute.</p>
        </div>
        <div class="approval-btns">
          <button class="btn btn-success" onclick="setStatus('completed')">✅ Approve & Release Payment</button>
          <button class="btn btn-gold" onclick="setStatus('funded')">🔄 Request Revision</button>
          <button class="btn btn-danger" onclick="openModal('modalDispute')">⚠️ Open Dispute</button>
        </div>
        <div class="auto-release-bar" style="margin-top:14px;">
          <div>
            <h4>⏱️ Auto-Release Countdown</h4>
            <p>Payment releases automatically if you do not respond.</p>
          </div>
          <div class="countdown">4d 23:59:59</div>
        </div>`;
    }

    if (deal.status === 'completed' || deal.status === 'approved') {
      return `
        <div style="background:#F0FDF4;border:1.5px solid #BBF7D0;border-radius:var(--r);padding:22px;text-align:center;">
          <div style="font-size:2rem;margin-bottom:8px;">🎉</div>
          <p style="font-weight:700;color:var(--success);font-size:1rem;">Deal Completed! Payment Released.</p>
          <p style="font-size:.85rem;color:var(--text-light);margin-top:4px;">Funds released to ${deal.seller}. Thank you for using TruvaPay!</p>
          <button onclick="document.getElementById('proofCard').classList.add('show');document.getElementById('proofCard').scrollIntoView({behavior:'smooth'})" class="btn btn-outline" style="margin-top:14px;">📤 View & Share Proof of Payment</button>
        </div>`;
    }

    if (deal.status === 'disputed') {
      return `
        <div style="background:#FFF5F5;border:1.5px solid #FFCDD2;border-radius:var(--r);padding:22px;">
          <p style="font-weight:700;color:var(--danger);margin-bottom:6px;">⚠️ Dispute Under Review</p>
          <p style="font-size:.85rem;color:var(--text-light);">Our team is reviewing evidence from both parties. You will be notified within 48 hours. Funds remain in escrow during review.</p>
        </div>`;
    }

    return '';
  }

  /* ---- Milestone section ---- */
  function getMilestoneHTML() {
    if (!deal.milestones) return '';
    const total = deal.milestones.reduce((s,m) => s + Number(m.amount), 0);
    return `
      <div class="card">
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:4px;">🪙 Multi-Milestone Breakdown</h3>
        <p style="font-size:.82rem;color:var(--text-light);margin-bottom:16px;">This is a milestone deal. Each stage is funded and released separately.</p>
        <div class="milestone-list">
          ${deal.milestones.map(m => `
            <div class="milestone-item">
              <div class="m-num">${m.num}</div>
              <div class="m-info">
                <h4>${m.name}</h4>
                <p>${m.date ? fmtDate(m.date) : 'No date set'}</p>
              </div>
              <div class="m-amount">${fmt(m.amount)}</div>
              <span class="badge ${m.status === 'completed' ? 'badge-completed' : m.status === 'funded' ? 'badge-funded' : 'badge-pending'}">${m.status === 'completed' ? '✓ Done' : m.status === 'funded' ? '💰 Active' : '⏳ Pending'}</span>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:14px;padding:12px 16px;background:var(--gray-bg);border-radius:var(--r-sm);display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:.85rem;color:var(--text-light);">Total Project Value</span>
          <strong style="font-size:1.1rem;color:var(--navy);">${fmt(total)}</strong>
        </div>
      </div>`;
  }

  /* ---- Status update ---- */
  function setStatus(newStatus) {
    deal.status = newStatus;
    // Update localStorage if stored
    const deals = JSON.parse(localStorage.getItem('truvapay_deals') || '[]');
    const i = deals.findIndex(d => d.dealId === deal.dealId);
    if (i > -1) { deals[i].status = newStatus; localStorage.setItem('truvapay_deals', JSON.stringify(deals)); }
    render();
    const msgs = {
      funded: '💰 Deal funded! Time to deliver your work.',
      delivered: '📦 Work submitted! Client notified.',
      completed: '🎉 Payment released! Deal complete.',
      disputed: '⚠️ Dispute opened. Team notified.',
    };
    toast(msgs[newStatus] || '✓ Updated!');
  }

  /* ---- Payment simulation ---- */
  function initiatePayment() {
    closeModal('modalFund');
    toast('🔀 Redirecting to Interswitch...');
    // In real app: POST to your backend → get Interswitch payment URL → redirect
    // For demo: simulate after 2s
    setTimeout(() => { setStatus('funded'); }, 2000);
  }

  function submitDelivery() {
    closeModal('modalDeliver');
    setStatus('delivered');
  }

  function submitDispute() {
    const reason = document.getElementById('disputeReason').value.trim();
    if (!reason) { alert('Please describe the reason for the dispute.'); return; }
    closeModal('modalDispute');
    setStatus('disputed');
  }

  /* ---- Share functions ---- */
  function copyBadge() {
    navigator.clipboard.writeText(`🛡️ Protected by TruvaPay | Deal: ${deal.title} | ${fmt(deal.amount)} | truvapay.app/deal/${deal.dealId}`);
    toast('✓ Badge text copied! Paste on your portfolio or invoice.');
  }

  function shareProofTwitter() {
    const msg = `Just completed a secure deal on TruvaPay! 🎉\n\n"${deal.title}" — ${fmt(deal.amount)} released.\n\nFunds were held in escrow, zero risk. 🔒\n\n#TruvaPay #Freelance #Nigeria`;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(msg), '_blank');
  }

  function shareProofWhatsApp() {
    const msg = `✅ Deal completed on TruvaPay!\n\n"${deal.title}"\n💰 ${fmt(deal.amount)} released safely\n🔒 Secured by TruvaPay + Interswitch\n\nNo more getting scammed on freelance deals!`;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  }

  function copyProof() {
    navigator.clipboard.writeText(`✅ DEAL COMPLETED\n\n"${deal.title}"\nAmount: ${fmt(deal.amount)}\nSeller: ${deal.seller}\nDate: ${new Date().toLocaleDateString()}\nSecured by TruvaPay + Interswitch\nDeal ID: #${deal.dealId}`);
    toast('✓ Proof copied to clipboard!');
  }

  /* ---- Close modals on overlay click ---- */
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); });
  });

  /* ---- Fake countdown timer ---- */
  function startCountdown() {
    const el = document.getElementById('countdownTimer');
    if (!el) return;
    let secs = 3 * 24 * 60 * 60; // 3 days in seconds
    setInterval(() => {
      if (secs <= 0) return;
      secs--;
      const d = Math.floor(secs / 86400);
      const h = Math.floor((secs % 86400) / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      if (el) el.textContent = `${d}d ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }, 1000);
  }

  /* ---- Init ---- */
  loadDeal();
  setTimeout(startCountdown, 500);
</script>
