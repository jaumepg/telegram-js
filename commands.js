function start(ctx) {
    ctx.reply('Por favor, comparte tu número de teléfono.', {
        reply_markup: {
        keyboard: [
            [{ text: 'Compartir mi número de teléfono', request_contact: true }]
        ],
        one_time_keyboard: true
        }
    });
}

function stop(ctx) {
    ctx.session = {}; //Termina la sesión
    ctx.reply('Moltes gracies per utilitzar Taxiecologic.');
}


module.exports = { start, stop };