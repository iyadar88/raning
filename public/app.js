async function loadDevices(){
    const res = await fetch('/devices.json');
    const devices = await res.json();
    const list = document.getElementById('deviceList');
    list.innerHTML = '';
    devices.forEach(device => {
        const li = document.createElement('li');
        li.textContent = device.name + ' ';
        const btn = document.createElement('button');
        btn.textContent = 'رن';
        btn.onclick = async () => {
            await fetch('/ring/' + device.name, { method: 'POST' });
            alert(device.name + ' سيتم رنينه');
        };
        li.appendChild(btn);
        list.appendChild(li);
    });
}

loadDevices();
