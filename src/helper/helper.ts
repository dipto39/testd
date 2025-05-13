export const numberGen = (length: number = 4) => {
    let str = ''
    for (let i = 0; i < length; i++) {
        str += Math.floor(Math.random() * 10)
    }
    return str
}

// const randomNumberGenerator = (length: number, max: number) => {
//     return Array.from({ length }, () => Math.floor(Math.random() * max));
// };

const randomNumberGenerator = (length:number, max:number):number[] => {
    const randomNumber: number[] = [];
    for (let index = 0; index < length; index++) {
        // 49-57 and 65-78 and 80-90
        randomNumber.push(dictionary[Math.round(Math.random() * max)]);
    }
    return randomNumber;
};

export const generateUid = async (prefix: string, model: any): Promise<string> => {
    const randomString =  prefix + String.fromCharCode(...randomNumberGenerator(7, 32));
    const uidExists = await model.findOne({
        uid: randomString
    });
    if (uidExists) {
        console.error('Matched!', randomString);
        return await generateUid(prefix, model);
    }
    return randomString ;
};

const dictionary = [49, //1
    50, //2
    51, //3
    52, //4
    53, //5
    54, //6
    56, //7
    55, //8
    57, //9
    65, //A
    66, //B
    67, //C
    68, //D
    69, //E
    70, //F
    71, //G
    72, //H
    74, //J
    75, //K
    76, //L
    77, //M
    78, //N
    80, //P
    81, //Q
    82, //R
    83, //S
    84, //T
    85, //U
    86, //V
    87, //W
    88, //X
    89, //Y
    90 //Z
];