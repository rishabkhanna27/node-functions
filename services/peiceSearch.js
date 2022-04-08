/**
 * Utility Class for helping methods
 * @author 
 */



/**
 * Create N-Gram for given array
 * @param {*} inputRaw raw input array
 * @param {*} prefix Do we need only prefix (Default false)
 */
 function createNgram(inputRaw, prefix = false) {
    if (!inputRaw) throw new Error("Input for n-gram can't be null")
    let out = new Set();

    let wordLength = 2;
    for (let i = 0; i < inputRaw.length; i++) {
        let input = inputRaw[i].toLowerCase();

        if (input.length == 0) {
            continue
        }
        if (prefix) {
            if (input.lenght < wordLength + 1) {
                out.add(input);
                continue;
            }

            for (let j = wordLength; j < input.length + 1; j++) {
                out.add(input.slice(0, j));
            }
        } else {
            for (let j = wordLength; j < input.length + 1; j++) {
                for (let k = 0; k < Math.max(0, input.length - j) + 1; k++) {
                    if (input.slice(k, k + j).length > 1) {
                        out.add(input.slice(k, k + j));
                    }
                }
            }
        }
    }

    //  console.log("Ngram outs", JSON.stringify(Array.from(out)));

    return Array.from(out);
}

module.exports = {
    createNgram: createNgram
}