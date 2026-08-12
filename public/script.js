const inputText =
    document.getElementById("inputText");

const sourceLanguage =
    document.getElementById("sourceLanguage");

const targetLanguage =
    document.getElementById("targetLanguage");

const translateButton =
    document.getElementById("translateButton");

const buttonText =
    document.getElementById("buttonText");

const translationResult =
    document.getElementById("translationResult");

const statusMessage =
    document.getElementById("statusMessage");

const charCount =
    document.getElementById("charCount");

const clearButton =
    document.getElementById("clearButton");

const copyButton =
    document.getElementById("copyButton");

const speakButton =
    document.getElementById("speakButton");

const swapButton =
    document.getElementById("swapButton");


// ================================
// Character Counter
// ================================

inputText.addEventListener("input", () => {

    charCount.textContent =
        `${inputText.value.length} / 5000`;

});


// ================================
// Translate
// ================================

translateButton.addEventListener(
    "click",
    async () => {

        const text =
            inputText.value.trim();

        const source =
            sourceLanguage.value;

        const target =
            targetLanguage.value;

        if (!text) {

            showStatus(
                "Please enter some text first.",
                "error"
            );

            return;
        }

        if (
            source !== "auto" &&
            source === target
        ) {

            showStatus(
                "Source and target languages should be different.",
                "error"
            );

            return;
        }

        translateButton.disabled = true;

        buttonText.textContent =
            "Translating...";

        showStatus(
            "Translating your text...",
            "normal"
        );

        try {

            const response =
                await fetch(
                    "/api/translate",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            text: text,
                            sourceLanguage: source,
                            targetLanguage: target
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Translation failed."
                );
            }

            translationResult.textContent =
                data.translatedText;

            showStatus(
                "Translation completed successfully!",
                "success"
            );

        } catch (error) {

            console.error(error);

            translationResult.textContent =
                "Unable to translate.";

            showStatus(
                error.message,
                "error"
            );

        } finally {

            translateButton.disabled = false;

            buttonText.textContent =
                "Translate";
        }

    }
);


// ================================
// Clear Button
// ================================

clearButton.addEventListener(
    "click",
    () => {

        inputText.value = "";

        translationResult.textContent =
            "Your translation will appear here...";

        charCount.textContent =
            "0 / 5000";

        statusMessage.textContent = "";
    }
);


// ================================
// Copy Button
// ================================

copyButton.addEventListener(
    "click",
    async () => {

        const text =
            translationResult.textContent;

        if (
            !text ||
            text ===
            "Your translation will appear here..."
        ) {

            showStatus(
                "Nothing to copy.",
                "error"
            );

            return;
        }

        try {

            await navigator.clipboard
                .writeText(text);

            showStatus(
                "Translation copied!",
                "success"
            );

        } catch {

            showStatus(
                "Copy failed.",
                "error"
            );
        }
    }
);


// ================================
// Text To Speech
// ================================

speakButton.addEventListener(
    "click",
    () => {

        const text =
            translationResult.textContent;

        if (
            !text ||
            text ===
            "Your translation will appear here..."
        ) {

            showStatus(
                "Nothing to read.",
                "error"
            );

            return;
        }

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.lang =
            getSpeechLanguage(
                targetLanguage.value
            );

        window.speechSynthesis.cancel();

        window.speechSynthesis.speak(
            speech
        );
    }
);


// ================================
// Swap Languages
// ================================

swapButton.addEventListener(
    "click",
    () => {

        if (
            sourceLanguage.value ===
            "auto"
        ) {

            showStatus(
                "Choose a source language before swapping.",
                "error"
            );

            return;
        }

        const oldSource =
            sourceLanguage.value;

        sourceLanguage.value =
            targetLanguage.value;

        targetLanguage.value =
            oldSource;
    }
);


// ================================
// Status Message
// ================================

function showStatus(message, type) {

    statusMessage.textContent =
        message;

    if (type === "error") {

        statusMessage.style.color =
            "#d93025";

    } else if (type === "success") {

        statusMessage.style.color =
            "#188038";

    } else {

        statusMessage.style.color =
            "#555";
    }
}


// ================================
// Speech Language Mapping
// ================================

function getSpeechLanguage(language) {

    const languages = {

        en: "en-US",

        hi: "hi-IN",

        mr: "mr-IN",

        fr: "fr-FR",

        es: "es-ES",

        de: "de-DE",

        it: "it-IT",

        ja: "ja-JP",

        ko: "ko-KR",

        zh: "zh-CN"
    };

    return languages[language]
        || "en-US";
}