const ESTADO = {
    RETIRADO: { value: 1, name: "retirado" },
    MAU: { value: 2, name: "mau" },
    SATISFAZ: { value: 3, name: "satisfaz" },
    BOM: { value: 4, name: "bom" },
    EXCELENTE: { value: 5, name: "excelente" },
    NOVO: { value: 6, name: "novo" }
};

function getValue(name) {
    var value;
    switch (name) {
        case ESTADO.RETIRADO.name:
            value = ESTADO.RETIRADO.value;
            break;
        case ESTADO.MAU.name:
            value = ESTADO.MAU.value;
            break;
        case ESTADO.SATISFAZ.name:
            value = ESTADO.SATISFAZ.value;
            break;
        case ESTADO.BOM.name:
            value = ESTADO.BOM.value;
            break;
        case ESTADO.EXCELENTE.name:
            value = ESTADO.EXCELENTE.value;
            break;
        case ESTADO.NOVO.name:
            value = ESTADO.NOVO.value;
            break;
        default:
            break;
    }
    return value;
}

module.exports.getValue = getValue;