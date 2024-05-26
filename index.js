const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const LocalSession = require('telegraf-session-local');
const comm = require('./commands');
const contact  = require('./contact');
const GeocodingService = require('./google');
const bot = new Telegraf("7188197586:AAESoki4dxMmRwzmb6yvKEzZx7WnDp_qqyI")

// Sessio del usuari
const localSession = new LocalSession({
  database: 'sessions.json',
  storage: LocalSession.storageFileSync
});
bot.use(localSession.middleware());

// Comanda inici /start
bot.start((ctx) => {
  comm.start(ctx);
});

// Comanda finalització /stop
bot.command('stop', (ctx) => {
  comm.stop(ctx);
});

// Manejo de la respuesta de contacto
bot.on('contact', (ctx) => {
  contact.thanks(ctx);
});

// Manejo del nombre del usuario
bot.on('text', (ctx) => {
    //Comprovem en tot moment si tenim el telefon del usuari
    if(ctx.session.phoneNumber == null){
      comm.start(ctx);
      return;
    }
    const text = ctx.message.text;
    // Flujo de conversación basado en el paso actual
    if ((ctx.session.step === 'askType') || (ctx.session.step === 'askOriginCorrect' && text === 'No')) {
      ctx.session.type = text;
      ctx.reply(`Puedes escribe la dirección de origen con este formato "Dirección, numero, ciudad".`);
      ctx.session.step = 'askOrigin';
    }else if (ctx.session.step === 'askOrigin' ) {
      getCoordinatesOrigin(ctx,text);
    } else if ((ctx.session.step === 'askOriginCorrect' && text === 'Si') || (ctx.session.step === 'askDestinationCorrect' && text === 'No')) {
      getCoordinatesDestination(ctx,text);
    } else if(ctx.session.step === 'askDestinationCorrect' && text === 'Si'){
      ctx.reply(`Todo correcto`);
    } 
});

async function getCoordinatesOrigin(ctx,text){
  ctx.session.origin = null;
  const location = await GeocodingService.getCoordinates(text);
  if(location==null){
    await ctx.reply(`Puedes escribe la dirección de origen con este formato "Dirección, numero, ciudad".`);
    await  ctx.reply(`Dirección no identificada.`);
    ctx.session.step = 'askOrigin';
    return;
  }  
  ctx.session.origin = location;
  await  ctx.reply(`Esta es la dirección identificada ${location.address}.`);
  contact.askCorrect(ctx,"askOriginCorrect");
}

async function getCoordinatesDestination(ctx,text){
  ctx.session.destination = null;
  const location = await GeocodingService.getCoordinates(text);
  if(location==null){
    await ctx.reply(`Puedes escribe la dirección de destino con este formato "Dirección, numero, ciudad".`);
    await  ctx.reply(`Dirección no identificada.`);
    ctx.session.step = 'askDestination';
    return;
  }  
  ctx.session.destination = location;
  await  ctx.reply(`Esta es la dirección identificada ${location.address}.`);
  contact.askCorrect(ctx,"askDestinationCorrect");
}

// Inicia el bot
bot.launch()
  .then(() => console.log('Bot iniciado'))
  .catch(err => console.error('Error al iniciar el bot:', err));

// Para cerrar el bot adecuadamente en eventos de cierre del proceso
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
