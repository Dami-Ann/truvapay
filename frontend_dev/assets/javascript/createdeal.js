<!-- ===== JAVASCRIPT ===== -->
  /* ---------- Deal type toggle ---------- */
  let dealType = 'standard';
  function setType(type) {
    dealType = type;
    if (type === 'standard') {
      document.getElementById('standardForm').style.display = 'block';
      document.getElementById('milestoneForm').style.display = 'none';
      document.getElementById('typeStandard').className = 'btn btn-primary btn-sm';
      document.getElementById('typeMilestone').className = 'btn btn-outline btn-sm';
    } else {
      document.getElementById('standardForm').style.display = 'none';
      document.getElementById('milestoneForm').style.display = 'block';
      document.getElementById('typeStandard').className = 'btn btn-outline btn-sm';
      document.getElementById('typeMilestone').className = 'btn btn-primary btn-sm';
      if (document.getElementById('milestoneList').children.length === 0) {
        addMilestone(); addMilestone(); // start with 2
      }
    }
  }

  /* ---------- Milestones ---------- */
  let mCount = 0;
  function addMilestone() {
    mCount++;
    const div = document.createElement('div');
    div.className = 'milestone-item';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'stretch';
    div.style.padding = '16px';
    div.style.gap = '10px';
    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
        <div class="m-num">${mCount}</div>
        <strong style="font-size:.88rem;">Milestone ${mCount}</strong>
        <button onclick="this.closest('.milestone-item').remove()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:var(--text-light);font-size:1rem;">✕</button>
      </div>
      <input type="text" class="m-name" placeholder="Milestone name (e.g. Design Mockup)" style="width:100%;padding:10px 12px;border:1.5px solid var(--gray-border);border-radius:8px;font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;"/>
      <div style="display:flex;gap:10px;">
        <input type="number" class="m-amt" placeholder="Amount (₦)" min="0" style="flex:1;padding:10px 12px;border:1.5px solid var(--gray-border);border-radius:8px;font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;"/>
        <input type="date" class="m-date" style="flex:1;padding:10px 12px;border:1.5px solid var(--gray-border);border-radius:8px;font-family:'DM Sans',sans-serif;font-size:.88rem;outline:none;"/>
      </div>
    `;
    document.getElementById('milestoneList').appendChild(div);
  }

  /* ---------- Min date ---------- */
  document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    const dateEl = document.getElementById('dealDate');
    if (dateEl) dateEl.min = today;
  });

  /* ---------- Generate ID ---------- */
  function genId() {
    return 'TRV-2026-' + Math.floor(10000 + Math.random() * 90000);
  }

  /* ---------- Create Deal ---------- */
  function createDeal() {
    let deal = {};

    if (dealType === 'standard') {
      const title  = document.getElementById('dealTitle').value.trim();
      const amount = document.getElementById('dealAmount').value;
      const date   = document.getElementById('dealDate').value;
      const seller = document.getElementById('sellerName').value.trim();

      if (!title || !amount || !date || !seller) {
        alert('Please fill in: Deal Title, Amount, Delivery Date, and Your Name.');
        return;
      }

      deal = {
        dealId:   genId(),
        type:     'standard',
        title,
        desc:     document.getElementById('dealDesc').value.trim(),
        amount,
        date,
        seller,
        buyer:    document.getElementById('buyerName').value.trim(),
        email:    document.getElementById('sellerEmail').value.trim(),
        revision: document.getElementById('revisions').value.trim(),
        status:   'pending',
        created:  new Date().toISOString()
      };
    } else {
      const title  = document.getElementById('mTitle').value.trim();
      const seller = document.getElementById('mSeller').value.trim();
      const items  = document.querySelectorAll('#milestoneList .milestone-item');

      if (!title || !seller || items.length === 0) {
        alert('Please fill in Project Title, Your Name, and add at least one milestone.');
        return;
      }

      const milestones = Array.from(items).map((el, i) => ({
        num:    i + 1,
        name:   el.querySelector('.m-name').value || `Milestone ${i+1}`,
        amount: el.querySelector('.m-amt').value || 0,
        date:   el.querySelector('.m-date').value || '',
        status: 'pending'
      }));

      const total = milestones.reduce((s, m) => s + Number(m.amount), 0);

      deal = {
        dealId:     genId(),
        type:       'milestone',
        title,
        desc:       document.getElementById('mDesc').value.trim(),
        amount:     total,
        date:       milestones[milestones.length - 1].date || '',
        seller,
        buyer:      document.getElementById('mBuyer').value.trim(),
        milestones,
        status:     'pending',
        created:    new Date().toISOString()
      };
    }

    // Save to localStorage
    const deals = JSON.parse(localStorage.getItem('truvapay_deals') || '[]');
    deals.push(deal);
    localStorage.setItem('truvapay_deals', JSON.stringify(deals));

    // Show result
    const link = window.location.origin + '/deal.html?id=' + deal.dealId;
    document.getElementById('generatedLink').textContent = link;
    document.getElementById('viewDealBtn').href = 'deal.html?id=' + deal.dealId;
    const result = document.getElementById('dealResult');
    result.classList.add('show');
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---------- Copy & Share ---------- */
  function copyLink() {
    const link = document.getElementById('generatedLink').textContent;
    navigator.clipboard.writeText(link);
    showToast('✓ Link copied to clipboard!');
  }

  function shareWhatsApp() {
    const link = document.getElementById('generatedLink').textContent;
    const title = document.getElementById('dealTitle')?.value || document.getElementById('mTitle')?.value || 'Deal';
    window.open('https://wa.me/?text=' + encodeURIComponent(`🔒 I created a protected deal on TruvaPay!\n\n"${title}"\n\nClick to fund it securely: ${link}`), '_blank');
  }

  function shareTwitter() {
    const link = document.getElementById('generatedLink').textContent;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(`Just set up a protected deal on TruvaPay 🔒\n\nFunds held in escrow until delivery is confirmed. No more getting scammed!\n\n${link}`), '_blank');
  }

  /* ---------- Toast ---------- */
  function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

