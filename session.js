router.post("/create", async (req, res) => {

    const { class_id, date } = req.body;

    const token = Date.now();

    const url = `http://localhost:5500/index.html?session=${token}`;

    const qrImage = await QRCode.toDataURL(url);

    db.query(
        "INSERT INTO sessions(class_id,session_date,qr_token) VALUES (?,?,?)",
        [class_id, date, token]
    );

    res.json({ qrImage, token });
});