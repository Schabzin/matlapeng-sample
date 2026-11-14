const test = require("node:test");
const assert = require("node:assert");
const { checkBooking } = require("./hours.js");
const TODAY = "2026-11-13";

test("a picnic that fits", () => {
    const r = checkBooking("picnic", "2026-11-21", "10:00", 4, TODAY);
    assert.strictEqual(r.ok, true);
    assert.strictEqual(r.reason, "Picnics: 10:00 to 14:00 fits.");
});

test("ending exactly at closing is allowed, one minute later is not", () => {
    assert.strictEqual(checkBooking("picnic", "2026-11-21", "14:00", 4, TODAY).ok, true);
    assert.strictEqual(checkBooking("picnic", "2026-11-21", "14:01", 4, TODAY).ok, false);
});

test("same time: fine for picnics, too late for the office", () => {
    assert.strictEqual(checkBooking("picnic", "2026-11-21", "14:00", 3, TODAY).ok, true);
    assert.strictEqual(checkBooking("office", "2026-11-21", "14:00", 3, TODAY).ok, false);
});

test("before opening is refused", () => {
    assert.strictEqual(checkBooking("office", "2026-11-21", "08:30", 1, TODAY).reason, "Office open at 09:00.");
});

test("yesterday is refused, today is allowed", () => {
    assert.strictEqual(checkBooking("picnic", "2026-11-12", "10:00", 2, TODAY).ok, false);
    assert.strictEqual(checkBooking("picnic", "2026-11-13", "10:00", 2, TODAY).ok, true);
});

test("services without hours on the sign are not guessed", () => {
    assert.strictEqual(checkBooking("spa", "2026-11-21", "10:00", 2, TODAY).ok, false);
});