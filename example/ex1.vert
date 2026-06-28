fn star () {
    let text = ""
    for (let i in range (0, 5)) {
        for (let j in range (0, i)) {
            text += "*"
        }
        log (text)
        text = ""
    }
}

fn main() {
    star()
}
