const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// التأكد من وجود ملف devices.json
if (!fs.existsSync('devices.json')) {
    fs.writeFileSync('devices.json', JSON.stringify([]));
}

// تسجيل جهاز جديد
app.post('/register', (req, res) => {
    const { phoneName } = req.body;
    let devices = JSON.parse(fs.readFileSync('devices.json', 'utf8'));
    if (!devices.find(d => d.name === phoneName)) {
        devices.push({ name: phoneName, ringing: false });
        fs.writeFileSync('devices.json', JSON.stringify(devices));
    }
    res.json({ status: 'registered' });
});

// إرسال أمر الرنين
app.post('/ring/:phoneName', (req, res) => {
    let devices = JSON.parse(fs.readFileSync('devices.json', 'utf8'));
    const device = devices.find(d => d.name === req.params.phoneName);
    if (device) {
        device.ringing = true;
        fs.writeFileSync('devices.json', JSON.stringify(devices));
        res.json({ status: 'ringing' });
    } else res.status(404).json({ status: 'not found' });
});

// تغيير حالة الرنين (زر الرن ↔ توقف)
app.post('/status/:phoneName', (req, res) => {
    let devices = JSON.parse(fs.readFileSync('devices.json', 'utf8'));
    const device = devices.find(d => d.name === req.params.phoneName);
    if (device) {
        const { ringing } = req.body;
        device.ringing = ringing;
        fs.writeFileSync('devices.json', JSON.stringify(devices));
        res.json({ status: 'ok', ringing: device.ringing });
    } else res.status(404).json({ status: 'not found' });
});

// حذف جهاز
app.post('/delete/:phoneName', (req, res) => {
    let devices = JSON.parse(fs.readFileSync('devices.json', 'utf8'));
    devices = devices.filter(d => d.name !== req.params.phoneName);
    fs.writeFileSync('devices.json', JSON.stringify(devices));
    res.json({ status: 'deleted' });
});

// جلب الأجهزة (لواجهة الموقع)
app.get('/devices', (req, res) => {
    let devices = JSON.parse(fs.readFileSync('devices.json', 'utf8'));
    res.json(devices);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
