 const API_BASE_URL = 'https://truvapay-api.onrender.com';
let currentDeal = null;

const urlParams = new URLSearchParams(window.location.search);
const dealId = urlParams.get('id');

async function loadDealDetails() {
    const root = document.getElementById('dealRoot');
    if (!dealId) {
        root.innerHTML = `<div style="text-align:center;padding:50px;"><h2>❌ No Deal ID</h2></div>`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/deals/${dealId}`);
        const data = await response.json();

        if (data.success) {
            currentDeal = data.deal;
            renderDealUI(currentDeal);
        } else {
            root.innerHTML = `<div style="text-align:center;padding:50px;"><h2>⚠️ Deal Not Found</h2></div>`;
        }
    } catch (error) {
        root.innerHTML = `<div style="text-align:center;padding:50px;"><h2>📡 Connection Error</h2></div>`;
    }
}

function renderDealUI(deal) {
    const root = document.getElementById('dealRoot');
    
    // Formatting the date nicely
    const displayDate = deal.date ? new Date(deal.date).toLocaleDateString() : 'No Date Set';

    root.innerHTML = `
      <div class="card">
        <div class="deal-title-row">
            <h1>${deal.title}</h1>
            <span class="badge ${deal.status === 'funded' ? 'badge-funded' : 'badge-pending'}">
                ${deal.status === 'funded' ? '🔒 Funded' : '⌛ Pending Payment'}
            </span>
        </div>
        <p class="deal-desc">${deal.desc || 'No description provided.'}</p>

        <div class="meta-grid">
            <div>
                <div class="meta-label">AMOUNT</div>
                <div class="meta-val">₦${deal.amount.toLocaleString()}</div>
            </div>
            <div>
                <div class="meta-label">DEADLINE</div>
                <div class="meta-val">${displayDate}</div>
            </div>
            <div>
                <div class="meta-label">SELLER</div>
                <div class="meta-val">${deal.seller || 'N/A'}</div>
            </div>
            <div>
                <div class="meta-label">BUYER</div>
                <div class="meta-val">${deal.buyer || 'N/A'}</div>
            </div>
        </div>

        <div class="deal-actions">
            ${deal.status === 'pending' ? 
                `<button class="btn btn-primary btn-lg btn-full" onclick="openModal('modalFund')">Fund Deal Now (₦${deal.amount.toLocaleString()})</button>` :
                `<button class="btn btn-success btn-lg btn-full" disabled>✓ Deal Funded</button>`
            }
        </div>
      </div>
    `;

    // Update the amount inside the popup modal too
    const modalAmt = document.getElementById('modalAmt');
    if (modalAmt) modalAmt.textContent = `₦${deal.amount.toLocaleString()}`;
}

/* --- MODAL CONTROL --- */
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('show'); 
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
}

/* --- INTERSWITCH PAYMENT --- */
async function initiatePayment() {
    const email = document.getElementById('payerEmail').value;
    if (!email) { alert("Please enter your email for the receipt."); return; }

    try {
        const response = await fetch(`${API_BASE_URL}/api/pay/initialize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dealId: dealId, email: email })
        });
        
        const result = await response.json();
        
        if (result.success && result.paymentUrl) {
            // Redirect to Interswitch
            window.location.href = result.paymentUrl; 
        } else {
            alert("Error: " + result.message);
        }
    } catch (e) {
        alert("Server is offline. Run 'node server.js'");
    }
}

document.addEventListener('DOMContentLoaded', loadDealDetails);