router.post("/mark", (req, res) => {

    const { student_id, session_id, status } = req.body;

    db.query(
        "SELECT * FROM sessions WHERE id=?",
        [session_id],
        (err, session) => {

            if (session.length === 0)
                return res.send("Invalid session");

            const created = new Date(session[0].created_at);
            const now = new Date();

            const diff = (now - created) / 1000;

            if (diff > 300) {
                return res.send("QR Expired (5 min)");
            }

            // continue marking attendance
            db.query(
                "INSERT INTO attendance(session_id,student_id,status) VALUES (?,?,?)",
                [session_id, student_id, status]
            );

            res.send("Attendance Marked");
        }
    );
});