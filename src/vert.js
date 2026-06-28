const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const fileName = process.argv[2];
let code = "";

if (!fileName) {
    console.log (`Vert 0.1.0-beta (tags/v0.1.0-beta) on win 32`)
    rl.setPrompt(">>> ");

    rl.prompt();

    rl.on("line", function (line) {
        let c = code_lexer (line);
        c = code_analyze (c);
        try {
            let runc = new Function(c);
            runc();
        }
        catch (e) {
            console.log(e);
            console.log(`VertExitMessage: Ignore by code 1`);
        }
        rl.prompt();
    });
} else {
    code = fs.readFileSync(fileName, "utf-8");
}




function code_lexer (fullcode) {
    const specific_list = "+-*/%^!&|=,:.?()[]{}<>;".split("");
    const double_ops = ["==", "!=", "<=", ">=", "&&", "||", "++", "--", "+=", "-=", "*=", "/=", "%="];
    const lexer_done_array = [];
    let current_line = [];
    let current_token = "";
    let current_string = "";
    let string_quote = null;

    function make_token(value) {
        if (specific_list.includes(value) || double_ops.includes(value)) {
            return {
                type: "ops",
                value: value
            };
        }

        if (/^-?\d+(\.\d+)?$/.test(value)) {
            return {
                type: "number",
                value: Number(value)
            };
        }

        if (
            (value.startsWith("\"") && value.endsWith("\"")) ||
            (value.startsWith("'") && value.endsWith("'")) ||
            (value.startsWith("`") && value.endsWith("`"))
        ) {
            return {
                type: "string",
                value: value.slice(1, -1)
            };
        }

        return {
            type: "other",
            value: value
        };
    }

    function push_token() {
        if (current_token) {
            current_line.push(make_token(current_token));
            current_token = "";
        }
    }

    function push_line() {
        push_token();

        if (current_line.length) {
            lexer_done_array.push(current_line);
            current_line = [];
        }
    }

    for (let i = 0; i < fullcode.length; i++) {
        const char = fullcode[i];

        if (string_quote) {
            current_string += char;

            if (char === "\\" && i + 1 < fullcode.length) {
                current_string += fullcode[i + 1];
                i++;
                continue;
            }

            if (char === string_quote) {
                current_line.push(make_token(current_string));
                current_string = "";
                string_quote = null;
            }

            continue;
        }

        if (char === "\"" || char === "'" || char === "`") {
            push_token();
            string_quote = char;
            current_string = char;
            continue;
        }

        if (char === "\n") {
            push_line();
            continue;
        }

        if (/\s/.test(char)) {
            push_token();
            continue;
        }

        const next_char = fullcode[i + 1];
        const double_op = char + next_char;
        if (double_ops.includes(double_op)) {
            push_token();
            current_line.push(make_token(double_op));
            i++;
            continue;
        }

        if (specific_list.includes(char)) {
            push_token();
            current_line.push(make_token(char));
            continue;
        }

        current_token += char;
    }

    push_line();

    return lexer_done_array;
}

function code_analyze (fullcode_array) {
    let full = "";
    let imported_js = `
    function _log (value) {
        console.log(value);
    }
    
    function _range (a, b) {
        let li = [];
        for (let i = a; i < b; i ++) {
            li.push(i);
        }
        return li;
    }
    
    function _exit () {
        process.exit(0);
    }
    `;
    let final_gen_code = [];
    let gen_code = [];
    let import_code = [];
    const var_list = [];
    const specific_list = "+-*/%^!&|=,:.?()[]{}<>".split("");

    for (let i = 0; i < fullcode_array.length; i ++) {
        let current_line = fullcode_array[i];

        for (let j = 0; j < current_line.length; j ++) {
            let current_token = current_line[j];
            let ctv = current_token.value;
            let ctt = current_token.type;

            if (ctt === "number") {
                gen_code.push (ctv);
            }
            else if (ctt === "ops") {
                gen_code.push (ctv);
            }
            else if (ctt === "string") {
                gen_code.push (JSON.stringify(ctv))
            }
            else if (ctt === "other") {
                if (ctv === "let") {
                    gen_code.push ("let");
                    var_list.push ({"name": `${current_line[j + 1].value}`, "type": "default"})
                }
                else if (ctv === "fn") {
                    gen_code.push ("function");
                }
                else if (ctv === "return") {
                    gen_code.push ("return");
                }
                else if (ctv === "for") {
                    gen_code.push ("for");
                }
                else if (ctv === "in") {
                    gen_code.push ("in");
                }
                else if (ctv === "while") {
                    gen_code.push ("while");
                }
                else if (ctv === "if") {
                    gen_code.push ("if");
                }
                else if (ctv === "else") {
                    gen_code.push ("else");
                }
                else if (ctv === "import") {
                    let import_src = current_line[j + 1].value;
                    let imported_source = fs.readFileSync(import_src, "utf-8");
                    if (import_src.split(".")[1] === "js") {
                        imported_js += imported_source + "\n";
                    }
                    else {
                        let imported_tokens = code_lexer(imported_source);
                        let imported_code = code_analyze(imported_tokens);
                        import_code = import_code.concat(imported_code);
                    }
                    j++;
                }
                else {
                    gen_code.push (`_${current_token.value}`);
                }
            }
        }
        final_gen_code.push(gen_code);
        gen_code = [];
    }
    full += imported_js
    full += import_code.join("\n")
    for(let i = 0; i < final_gen_code.length; i ++){
        for(let j = 0; j < final_gen_code[i].length; j ++) {
            full += final_gen_code[i][j] + " ";
        }
        full += "\n";
    }
    return full;
}

function main (txt) {
    let a = new Function(code_analyze(code_lexer(txt)) + "\nif (typeof _main === \"function\") { _main(); }");
    a ();
}
if (fileName) {
    try {
        main(code);
    }
    catch (e) {
        console.log(e);
        console.log(`VertExitMessage: Exit by code 1`);
    }
    process.exit(0)
}
