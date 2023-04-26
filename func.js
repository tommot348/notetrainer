const dom_parser = new DOMParser()
const inst = new Instrument("piano")
const top_line = 88
const solfege = ["do bemolle", "do", "do diesis/re bemolle", "re", "re diesis/mi bemolle", "mi", "fa", "fa diesis/sol bemolle", "sol", "sol diesis/la bemolle", "la", "la diesis/si bemolle", "si"]
const abc = ["cb", "c", "c#/db", "d", "d#/eb", "e", "f", "f#/gb", "g", "g#/ab", "a", "a#,bb", "b"]
const midi_values = [-89, -88, -86, -84, -83, -81, -79]
//                         f#      c#        g#          d#           a#         e#
const sharp_coordinates = [[0, 0], [0.5, 2], [1, -0.65], [1.5, 1.35], [2, 3.35], [2.5, 0.65]]
//                        bb        eb           ab         db           gb      cb 
const flat_coordinates = [[0, 2.7], [0.5, 0.65], [1, 3.35], [1.5, 1.35], [2, 4], [2.5, 2]]
const ba_const = 9.35
let score = 0
let to_find = 0
let scales = {}
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
async function get_json(path) {
    const data = await fetch(path)
    const txt = await data.text()
    const parsed = JSON.parse(txt)
    return parsed
}
async function main() {
    const staff = await get_svg("staff.svg")
    let anchor = document.getElementById("anchor")
    anchor.appendChild(staff.firstChild)
    document.getElementById("solfege").onclick = to_solfege
    document.getElementById("abc").onclick = to_abc
    scales = await get_json("scales.json")
    set_scale("c")
    to_find = Math.floor((Math.random() * 35))
    add_note(to_find)
    const scale_btns = Array.from(document.getElementById("scales-menu").getElementsByClassName("pure-menu-link"))
    scale_btns.forEach(x => x.onclick = () => set_scale(x.textContent.toLowerCase()))
}
function clear_notes() {
    const old = document.getElementsByClassName("ganzenote")
    Array.from(old).forEach(x => x.remove())
}
async function add_note(y = 0) {
    clear_notes()
    let n = await get_svg("note.svg")
    const staff = document.getElementById("staff")
    const note = n.firstChild.getElementsByClassName("ganzenote")[0]
    note.setAttribute("transform", `scale(0.115) translate(1700 ${top_line + y * 61})`)
    staff.insertBefore(note, staff.getElementById("staffcontents"))
    const octave = Math.floor(to_find / 7)
    const midi_note = midi_values[to_find % 7] + (12 * octave)
    setTimeout(() => {
        inst.tone(midi_note, 1, 1)
    }, 10);
}
function clear_sharpflat() {
    const old = document.getElementsByClassName("sharpflat")
    Array.from(old).forEach(x => x.remove())
}
async function add_sharpflat(type, x, y) {
    let scale = "0.45"
    if (type == "flat") {
        x += 1
        y += 2
    }
    let n = await get_svg(`${type}.svg`)
    const staff = document.getElementById("staff")
    const note = n.firstChild.getElementsByClassName("sharpflat")[0]
    note.setAttribute("transform", `scale(${scale}) translate(${140 + x * 47} ${47 + y * (47 / 2)})`)
    staff.insertBefore(note, staff.getElementById("staffcontents"))
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
    let scale = scales[name]
    if (scale === undefined) {
        scale = scales["c"]
    }
    clear_sharpflat()
    let num_sharpflat = scale["num_sharpflat"]
    let type_sharpflat = scale["type_sharpflat"]
    notes = scale["notes"]
    midi = scale["midi"]
    midi.forEach((v, i) => midi_values[i] = v)
    notes.forEach((v, i) => {
        const bttn = document.getElementById(v)
        bttn.onclick = () => check(i)
    })
    let coordinates = sharp_coordinates
    if (type_sharpflat === "flat") {
        coordinates = flat_coordinates
    }
    if (num_sharpflat > 0) {
        for (let i = 0; i < num_sharpflat; ++i) {
            add_sharpflat(type_sharpflat, coordinates[i][0], coordinates[i][1])
            add_sharpflat(type_sharpflat, coordinates[i][0], coordinates[i][1] + ba_const)
        }
    }
}
function reset() {
    score = 0;
    document.getElementById("score").textContent = score
}
main()