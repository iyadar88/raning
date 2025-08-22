// server.js
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// تسجيل جهاز جديد
app.post('/register', (req, res) => {
    const { phoneName } = req.body;
    let devices = JSON.parse(fs.readFileSync('devices.json', 'utf8'));
    if(!devices.find(d => d.name === phoneName)){
        devices.push({ name: phoneName, ringing: false });
        fs.writeFileSync('devices.json', JSON.stringify(devices));
    }
    res.json({ status: 'registered' });
});

// إرسال أمر الرنين
app.post('/ring/:phoneName', (req, res) => {
    let devices = JSON.parse(fs.readFileSync('devices.json', 'utf8'));
    const device = devices.find(d => d.name === req.params.phoneName);
    if(device){
        device.ringing = true;
        fs.writeFileSync('devices.json', JSON.stringify(devices));
        res.json({ status: 'ringing' });
    } else res.status(404).json({ status: 'not found' });
});

// التحقق من حالة الرنين (للتطبيق)
app.get('/status/:phoneName', (req, res) => {
    let devices = JSON.parse(fs.readFileSync('devices.json', 'utf8'));
    const device = devices.find(d => d.name === req.params.phoneName);
    if(device){
        res.json({ ringing: device.ringing });
        device.ringing = false; // بعد قراءة الحالة، يتم إعادة ضبطها
        fs.writeFileSync('devices.json', JSON.stringify(devices));
    } else res.status(404).json({ status: 'not found' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
