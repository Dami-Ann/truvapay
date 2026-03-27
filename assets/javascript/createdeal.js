 /* ---------- Configuration ---------- */
const API_BASE_URL = 'https://truvapay-api.onrender.com';

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
        const mList = document.getElementById('milestoneList');
        if (mList && mList.children.length === 0) {
            addMilestone(); addMilestone(); 
        }
    }
}

/* ---------- Milestones Logic ---------- */
let mCount = 0;
function addMilestone() {
    mCount++;
    const div = document.createElement('div');
    div.className = 'milestone-item';
    div.style.padding = '16px';
    div.style.gap = '10px';
    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
        <div class="m-num">${mCount}</div>
        <strong style="font-size:.88rem;">Milestone ${mCount}</strong>
        <button onclick="this.closest('.milestone-item').remove()" style="margin-left:auto;background:none;border:none;cursor:pointer;color:gray;">✕</button>
      </div>
      <input type="text" class="m-name" placeholder="Milestone name" style="width:100%;padding:10px;margin-bottom:5px;border:1px solid #ddd;border-radius:8px;"/>
      <div style="display:flex;gap:10px;">
        <input type="number" class="m-amt" placeholder="Amount (₦)" style="flex:1;padding:10px;border:1px solid #ddd;border-radius:8px;"/>
        <input type="date" class="m-date" style="flex:1;padding:10px;border:1px solid #ddd;border-radius:8px;"/>
      </div>
    `;
    document.getElementById('milestoneList').appendChild(div);
}

/* ---------- Initialization ---------- */
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    const dateEl = document.getElementById('dealDate');
    if (dateEl) dateEl.min = today;
});

/* ---------- CREATE DEAL ---------- */
async function createDeal() {
    let dealData = {};

    try {
        if (dealType === 'standard') {
            const title = document.getElementById('dealTitle').value.trim();
            const amount = document.getElementById('dealAmount').value;
            const dateValue = document.getElementById('dealDate').value;
            const seller = document.getElementById('sellerName').value.trim();

            if (!title || !amount || !dateValue || !seller) {
                alert('Please fill in: Title, Amount, Date, and Seller Name.');
                return;
            }

            dealData = {
                title,
                desc: document.getElementById('dealDesc').value.trim(),
                amount: Number(amount),
                deadline: dateValue, // FIXED: Changed from 'date' to 'deadline'
                seller,
                buyer: document.getElementById('buyerName').value.trim(),
                email: document.getElementById('sellerEmail').value.trim(),
                status: 'pending'
            };
        } else {
            // Milestone logic
            const title = document.getElementById('mTitle').value.trim();
            const seller = document.getElementById('mSeller').value.trim();
            const items = document.querySelectorAll('#milestoneList .milestone-item');
            
            if (!title || !seller || items.length === 0) {
                alert('Please fill in Title, Seller, and Milestones.');
                return;
            }

            const milestones = Array.from(items).map((el, i) => ({
                num: i + 1,
                name: el.querySelector('.m-name').value || `Milestone ${i+1}`,
                amount: Number(el.querySelector('.m-amt').value) || 0,
                deadline: el.querySelector('.m-date').value || '' // FIXED: Changed from 'date' to 'deadline'
            }));

            dealData = {
                title,
                desc: document.getElementById('mDesc').value.trim(),
                amount: milestones.reduce((s, m) => s + m.amount, 0),
                deadline: milestones[milestones.length - 1]?.deadline || 'No Deadline', // Added overall deadline
                seller,
                milestones,
                status: 'pending'
            };
        }

        showToast("Generating secure link...");
        
        const response = await fetch(`${API_BASE_URL}/api/deals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dealData)
        });

        const resultData = await response.json();

        if (resultData.success) {
            const newId = resultData.deal.dealId;
            const finalLink = window.location.href.replace('createdeal.html', 'deal.html') + '?id=' + newId;

            document.getElementById('generatedLink').textContent = finalLink;
            document.getElementById('viewDealBtn').setAttribute('href', finalLink);
            
            document.getElementById('dealResult').classList.add('show');
            document.getElementById('dealResult').scrollIntoView({ behavior: 'smooth' });
            showToast("✓ Deal live!");
        } else {
            alert("Error: " + resultData.message);
        }
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Server is offline or connection failed!");
    }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function copyLink() {
    const link = document.getElementById('generatedLink').textContent;
    navigator.clipboard.writeText(link).then(() => showToast('✓ Link copied!'));
}