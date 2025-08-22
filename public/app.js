const phoneNameSpan = document.getElementById('phoneName');
const ringBtn = document.getElementById('ringBtn');
const deleteBtn = document.getElementById('deleteBtn');

let phoneName = null;
let ringing = false;

// جلب الهاتف المسجل (أول جهاز فقط)
async function loadPhone() {
    const res = await fetch('/devices');
    const devices = await res.json();
    if (devices.length === 0) {
        phoneNameSpan.textContent = 'لا يوجد هاتف مسجل';
        ringBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
        return;
    }

    phoneName = devices[0].name;
    phoneNameSpan.textContent = phoneName;
    updateButton(devices[0].ringing);
}

// تحديث زر الرن حسب حالة ringing
function updateButton(state) {
    ringing = state;
    ringBtn.textContent = ringing ? 'توقف' : 'رن';
}

// عند النقر على زر الرن
ringBtn.onclick = async () => {
    const newState = !ringing;
    await fetch(`/status/${phoneName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ringing: newState })
    });
    updateButton(newState);
};

// عند النقر على زر حذف الهاتف
deleteBtn.onclick = async () => {
    await fetch(`/delete/${phoneName}`, { method: 'POST' });
    phoneNameSpan.textContent = 'لا يوجد هاتف مسجل';
    ringBtn.style.display = 'none';
    deleteBtn.style.display = 'none';
};

// تحميل الهاتف عند فتح الصفحة
loadPhone();
