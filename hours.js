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

const SERVICES = {
    picnic:       { label: "a picnic",     hours: "picnic" },
    viewing:      { label: "a viewing",    hours: "office" },
    venue:        { label: "the venue",    hours: null },
    accomodation: { label: "accomodation", hours: null },
    spa:          { label: "the spa",      hours: null },
};

const WHATSAPP_NUMBER = "27732239762";

function buildEnquiry(form, today) {
    const service = SERVICES[form.service];
    if (!service) return { ok: false, reason: "Please choose a service." };
    if (form.name.trim() === "") return { ok: false, reason: "Please type your name." };
    if (form.date === "") return { ok: false, reason: "Please choose a date." };
    if (!Number.isInteger(form.people) || form.people < 1) {
        return { ok: false, reason: "People must be a whole number, 1 or more." };
    }

    let when;
    if (service.hours) {
        const check = checkBooking(service.hours, form.date, form.start, form.hours, today);
        if (!check.ok) return check;
        const end = fromMinutes(toMinutes(form.start) + form.hours * 60);
        when = `on ${form.date} from ${form.start} to ${end}`;
    } else {
        if (form.date < today) return { ok: false, reason: "That date has already passed." };
        when = `on ${form.date}`;
    }

    const who = form.people === 1 ? "1 person" : `${form.people} people`;
    const text = `Hello Matlapeng, my name is ${form.name.trim()}. ` +
                 `I'd like to book ${service.label} ${when} for ${who}. Is it available?`;
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    return { ok: true, text, link };
}

if (typeof module !== "undefined") module.exports = { checkBooking, toMinutes, fromMinutes, buildEnquiry, SERVICES };