const TIMETABLES = { 
    office: { label: "Office", open: "09:00", close: "16:00" },
    picnic: { label: "Picnics", open: "09:00", close: "18:00" },
};

function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

function fromMinutes(total) {
    const h = String(Math.floor(total / 60)).padStart(2, "0");
    const m = String(total % 60).padStart(2, "0");
    return `${h}:${m}`;
}

function checkBooking(service, date, start, hours, today) {
    const table = TIMETABLES[service];
    if (!table) return { ok: false, reason: `No set hours for ${service}. Send an enquiry instead.` };
    if (date < today) return { ok: false, reason: "That date has already passed." };
    if (!(hours > 0)) return { ok: false, reason: "Hours must be more than 0." };

    const begin = toMinutes(start);
    const end = begin + hours * 60;
    if (begin < toMinutes(table.open)) {
        return { ok: false, reason: `${table.label} open at ${table.open}.` };
    }
    if (end > toMinutes(table.close)) {
        return { ok: false, reason: `${table.label} close at ${table.close}. ${start} for ${hours} hours ends at ${fromMinutes(end)}.` };
    }
    return { ok: true, reason: `${table.label}: ${start} to ${fromMinutes(end)} fits.` };
}

if (typeof module !== "undefined") module.exports = { checkBooking, toMinutes, fromMinutes };