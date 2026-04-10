const { generateToken } = require("../middleware/auth");

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM teachers WHERE email=? AND password=?",
        [email, password],
        (err, result) => {

            if (result.length === 0) {
                return res.send("Invalid Login");
            }

            const token = generateToken({
                id: result[0].id,
                email,
                role: "teacher"
            });

            res.json({ token });
        }
    );
});