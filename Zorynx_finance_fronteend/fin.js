// Data load from Local Storage or default
let data = JSON.parse(localStorage.getItem('finData')) || {
    balance: 0,
    deposits: 0,
    withdrawals: 0,
    history: []
};

function checkRole() {
    const role = document.getElementById('roleSelect').value;
    const adminPanel = document.getElementById('adminActions');
    
    
    if(role === 'Viewer') {
        adminPanel.style.display = 'none';  
    } else {
        adminPanel.style.display = 'block'; 
    }
}

function doAction(type) {
    const amount = parseFloat(document.getElementById('amountInput').value);
    const role = document.getElementById('roleSelect').value;

    if (isNaN(amount) || amount <= 0) return alert("Enter valid amount");

    if (type === 'Withdraw' && amount > data.balance) {
        return alert("Not enough balance!");
    }

    // Update numbers
    if (type === 'Deposit') {
        data.balance += amount;
        data.deposits += amount;
    } else {
        data.balance -= amount;
        data.withdrawals += amount;
    }

    // Add to history
    data.history.unshift({
        time: new Date().toLocaleString(),
        user: role,
        type: type,
        amount: (type === 'Deposit' ? '+' : '-') + '$' + amount,
        style: type === 'Deposit' ? 'var(--success)' : 'var(--danger)'
    });

    saveAndUpdate();
}

function saveAndUpdate() {
    localStorage.setItem('finData', JSON.stringify(data));
    updateUI();
}

function updateUI() {
    document.getElementById('balanceDisplay').innerText = `$${data.balance.toFixed(2)}`;
    document.getElementById('depositDisplay').innerText = `$${data.deposits.toFixed(2)}`;
    document.getElementById('withdrawDisplay').innerText = `$${data.withdrawals.toFixed(2)}`;

    document.getElementById('historyBody').innerHTML = data.history.map(h => `
        <tr>
            <td>${h.time}</td>
            <td><span class="badge">${h.user}</span></td>
            <td><strong>${h.type}</strong></td>
            <td><span style="color:var(--success)">Completed</span></td>
            <td style="color:${h.style}; font-weight:bold">${h.amount}</td>
        </tr>
    `).join('');
}


function toggle() {
    document.getElementById('Slidebar').classList.toggle('active');
}

function exportData() {
    const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance_report.json';
    a.click();
}


window.onload = () => {
    updateUI();
    checkRole();
    
    const insights = [
        {title: "Gold Price", desc: "Gold hit $2,400 per ounce today."},
        {title: "Tech Stocks", desc: "AI sector leading the market growth."},
        {title: "Crypto Update", desc: "Bitcoin surges past $30,000."},
        {title: "Market Sentiment", desc: "Investors optimistic about Q3 earnings."}

    ];

    document.getElementById('content').innerHTML = insights.map(i => `
        <div style="background:#1f2937; padding:15px; border-radius:10px; margin-bottom:10px;">
            <h4 style="margin:0; color:#4f46e5;">${i.title}</h4>
            <p style="margin:5px 0 0; font-size:0.85rem; opacity:0.8;">${i.desc}</p>
        </div>
    `).join('');
};

function toggleModes() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    
    
    body.classList.toggle('dark-mode');

   
    if (body.classList.contains('dark-mode')) {
        icon.classList.replace('ph-moon', 'ph-sun');
    } else {
        icon.classList.replace('ph-sun', 'ph-moon');
    }

   
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}


window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').classList.replace('ph-moon', 'ph-sun');
    }
});
