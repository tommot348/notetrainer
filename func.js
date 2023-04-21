const dom_parser = new DOMParser()
const inst = new Instrument("piano")
const top_line = 88
const solfege = ["do", "do diesis/re bemolle", "re", "re diesis/mi bemolle", "mi", "fa", "fa diesis/sol bemolle", "sol", "sol diesis/la bemolle", "la", "la diesis/si bemolle", "si"]
const abc = ["c", "c#/db", "d", "d#/eb", "e", "f", "f#/gb", "g", "g#/ab", "a", "a#,bb", "b"]
const midi_values = [-89, -88, -86, -84, -83, -81, -79]
let score = 0
let to_find = 0
function check(x) {
    const result = x === to_find % 7
    if (result) {
        score++
    } else {
        score = 0
    }
    to_find = Math.floor((Math.random() * 35))
    add_note(to_find)
    document.getElementById("score").textContent = score
}
async function get_svg(path) {
    const data = await fetch(path)
    const txt = await data.text()
    const parsed = dom_parser.parseFromString(txt, "image/svg+xml")
    return parsed
}
async function main() {
    const staff = await get_svg("staff.svg")
    let anchor = document.getElementById("anchor")
    anchor.appendChild(staff.firstChild)
    document.getElementById("solfege").onclick = to_solfege
    document.getElementById("abc").onclick = to_abc
    set_scale("c")
    to_find = Math.floor((Math.random() * 35))
    add_note(to_find)
}
async function add_note(y = 0) {
    const old = document.getElementById("ganzenote")
    if (old) {
        old.remove()
    }
    let n = await get_svg("note.svg")
    const staff = document.getElementById("staff")
    const note = n.firstChild.getElementById("ganzenote")
    note.setAttribute("transform", `scale(0.115) translate(1100 ${top_line + y * 61})`)
    staff.insertBefore(note, staff.getElementById("staffcontents"))
    const octave = Math.floor(to_find/7)
    const midi_note = midi_values[to_find%7] + (12*octave)
    setTimeout(() => {
        inst.tone(midi_note, 1, 1)
    }, 10);
}
function to_solfege(e) {
    const buttons = document.getElementById("buttons").getElementsByTagName("button")
    let i = 0
    for (const name of solfege) {
        buttons[i].textContent = name
        ++i
    }
}
function to_abc(e) {
    const buttons = document.getElementById("buttons").getElementsByTagName("button")
    let i = 0
    for (const name of abc) {
        buttons[i].textContent = name
        ++i
    }
}
function set_scale(name) {
    for (const bttn of document.getElementById("buttons").getElementsByTagName("button")) {
        bttn.onclick = reset
    }
    let notes = []
    let midi = []
    switch (name) {
        case "c":
            notes=["f", "e", "d", "c", "b", "a", "g"]
            midi=[-89, -88, -86, -84, -83, -81, -79]
            break
        case "g":
            notes=["f#", "e", "d", "c", "b", "a", "g"]
            midi=[-90, -88, -86, -84, -83, -81, -79]
            break
        case "d":
            notes=["f#", "e", "d", "c#", "b", "a", "g"]
            midi=[-90, -88, -86, -85, -83, -81, -79]
            break
        default:
            break;
    }
    midi.forEach((v, i) => midi_values[i] = v)
    notes.forEach((v, i)=>{
        const bttn = document.getElementById(v)
        bttn.onclick = () => check(i)
    })
}
function reset() {
    score = 0;
    document.getElementById("score").textContent = score
}
main()