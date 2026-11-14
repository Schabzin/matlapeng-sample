const test = require("node:test");
const assert = require("node:assert");
const { buildEnquiry } = require("./hours.js");
const TODAY = "2026-11-14";


function form(changes) {
    const base = { service: "picnic", name: "Lerato", date: "2026-11-21", start: "10:00", hours: 4, people: 6 };
    return { ...base, ...changes };
}

test("a picnic that fits becomes a WhatsApp message", () => {
    const r = buildEnquiry(form({}), TODAY);
    assert.strictEqual(r.ok, true);
    assert.strictEqual(r.text, "Hello Matlapeng, my name is Lerato. I'd like to book a picnic on 2026-11-21 from 10:00 to 14:00 for 6 people. Is it available?");
});

test("the timetable's refusal comes through unchanged", () => {
    const r = buildEnquiry(form({ service: "viewing", start: "14:00", hours: 3 }), TODAY);
    assert.strictEqual(r.reason, "Office close at 16:00. 14:00 for 3 hours ends at 17:00.");
});

test("the venue has no hours on the sign, so no time is promised", () => {
    const r = buildEnquiry(form({ service: "venue" }), TODAY);
    assert.strictEqual(r.text, "Hello Matlapeng, my name is Lerato. I'd like to book the venue on 2026-11-21 for 6 people. Is it available?");
});

test("an empty date asks for a date, not 'already passed'", () => {
    assert.strictEqual(buildEnquiry(form({ date: "" }), TODAY).reason, "Please choose a date.");
});

test("one person, not one people", () => {
    assert.ok(buildEnquiry(form({ people: 1 }), TODAY).text.includes("for 1 person."));
});

test("people must be a whole number, 1 or more", () => {
    for (const bad of [0, -2, 2.5]) {
        assert.strictEqual(buildEnquiry(form({ people: bad }), TODAY).ok, false);
    }
});

test("the link carries exactly the message", () => {
    const r = buildEnquiry(form({}), TODAY);
    assert.ok(r.link.startsWith("https://wa.me/27732239762?text="));
    assert.strictEqual(decodeURIComponent(r.link.split("text=")[1]), r.text);
});