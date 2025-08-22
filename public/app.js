async function loadDevices() {
    const res = await fetch('/devices');
    const devices = await res.json();
    const list = document.getElementById('deviceList');
    list.innerHTML = '';

    devices.forEach(device => {
        const li = document.createElement('li');
        li.textContent = device.name + ' ';

        const btn = document.createElement('button');
        btn.textContent = 'رن';
        btn.onclick = async () => {
            const response = await fetch('/ring/' + device.name, { method: 'POST' });
            if (response.ok) {
                alert(device.name + ' سيتم رنينه');
            } else {
                alert('فشل تشغيل الرنين');
            }
        };

        li.appendChild(btn);
        list.appendChild(li);
    });
}

loadDevices();
