function thanks(ctx) {
    const contact = ctx.message.contact;
    ctx.reply(`Gràcies per compartir el vostre número de telèfon: ${contact.phone_number}`);
    ctx.reply('¿Que vols fer?', {
      reply_markup: {
          keyboard: [
              ['Finalizas servicio'],
              ['Iniciar servicio']
          ],
          resize_keyboard: true,
          one_time_keyboard: true
      }
    });
    // Guardar el número de teléfono en el contexto del usuario
    ctx.session = { phoneNumber: contact.phone_number };
    ctx.session.step = 'askType';
}

function askCorrect(ctx,step) {
    const contact = ctx.message.contact;
    ctx.reply('¿Dirección correcta?', {
      reply_markup: {
          keyboard: [
              ['Si'],
              ['No']
          ],
          resize_keyboard: true,
          one_time_keyboard: true
      }
    });
    ctx.session.step = step;
}


module.exports = { thanks,askCorrect };