const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

// ===============================
// TEST ROUTE
// ===============================
app.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend is working!"
    });
});

// ===============================
// TRANSLATION ROUTE
// ===============================
app.post("/api/translate", async (req, res) => {

    console.log("================================");
    console.log("POST /api/translate RECEIVED");
    console.log("Request body:", req.body);

    try {

        const {
            text,
            sourceLanguage,
            targetLanguage
        } = req.body;

        if (!text) {
            return res.status(400).json({
                error: "Text is required."
            });
        }

        if (!targetLanguage) {
            return res.status(400).json({
                error: "Target language is required."
            });
        }

        const source =
            sourceLanguage === "auto"
                ? "en"
                : sourceLanguage;

        const apiUrl =
            `https://api.mymemory.translated.net/get` +
            `?q=${encodeURIComponent(text)}` +
            `&langpair=${source}|${targetLanguage}`;

        console.log("Calling MyMemory API...");

        const response = await fetch(apiUrl);

        console.log(
            "MyMemory status:",
            response.status
        );

        const data = await response.json();

        console.log(
            "Translation received:",
            data.responseData
        );

        if (
            !data.responseData ||
            !data.responseData.translatedText
        ) {
            return res.status(500).json({
                error: "No translation was returned."
            });
        }

        res.json({
            translatedText:
                data.responseData.translatedText
        });

    } catch (error) {

        console.error(
            "Translation error:",
            error
        );

        res.status(500).json({
            error: error.message
        });
    }
});


// ===============================
// SERVE FRONTEND
// ===============================
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {

    console.log("");
    console.log(
        "================================"
    );

    console.log(
        `Server running at http://localhost:${PORT}`
    );

    console.log(
        "Translation API: POST /api/translate"
    );

    console.log(
        "Test API: GET /test"
    );

    console.log(
        "================================"
    );
});