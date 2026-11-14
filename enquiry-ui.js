
const enquiryForm = document.getElementById("enquiry-form");
const resultBox = document.getElementById("enquiry-result");


function todayText() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
}

enquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    resultBox.textContent = "";

    const form = {
        service: document.getElementById("service").value,
        name: document.getElementById("name").value,
        date: document.getElementById("date").value,
        start: document.getElementById("start").value,
        hours: Number(document.getElementById("hours-wanted").value),
        people: Number(document.getElementById("people").value),
    };
    const r = buildEnquiry(form, todayText());

    if (!r.ok) {
        const p = document.createElement("p");
        p.className = "problem";
        p.textContent = r.reason;
        resultBox.append(p);
    }
    const preview = document.createElement("p");
    preview.textContent = r.text;
    const go = document.createElement("a");
    go.className = "btn";
    go.href = r.link;
    go.target = "_blank";
    go.textContent = "Open WhatsApp";
    const note = document.createElement("p");
    note.textContent = "Press Send in WhatsApp. Your booking is confirmed only when Matlapeng replies.";
    resultBox.append(preview, go, note);
});