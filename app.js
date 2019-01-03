/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require("restify");
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var order = require("./order");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
  console.log("%s listening to %s", server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
  openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users
server.post("/api/messages", connector.listen());

/*----------------------------------------------------------------------------------------
 * Bot Storage: This is a great spot to register the private state storage for your bot.
 * We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
 * For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
 * ---------------------------------------------------------------------------------------- */

var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector).set("storage", inMemoryStorage); // Register in memory storage;
order.create(bot);
bot
  .dialog("/", [
    function(session) {
      var msg = new builder.Message(session);

      msg.attachments([
        new builder.HeroCard(session)
          .title("Hey. This is a bot. What can I do for you today?")
          .buttons([
            builder.CardAction.imBack(session, "order", "1. Order"),
            builder.CardAction.imBack(session, "faq", "2. FAQ")
          ])
      ]);

      builder.Prompts.choice(session, msg, "order|faq");
    },
    function(session, results) {
      var action, item;
      if (results.response.entity == "order") {
        order.beginDialog(session, action);
      } else {
        session.send(
          'Sorry. We are providing only "order" for now. Please type "menu" for back to menu'
        );
      }
    }
  ])
  .reloadAction("/", null, { matches: /^menu|show menu/i });
