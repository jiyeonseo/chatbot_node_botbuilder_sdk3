var builder = require("botbuilder");

exports.beginDialog = function(session, options) {
  session.beginDialog("order", options || {});
};

var menuMsg = session =>
  new builder.Message(session)
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments([
      new builder.HeroCard(session)
        .title("Menu1")
        .subtitle("This is Menu2")
        .images([
          builder.CardImage.create(
            session,
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg"
          ).tap(
            builder.CardAction.showImage(
              session,
              "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/800px-Seattlenighttimequeenanne.jpg"
            )
          )
        ])
        .buttons([builder.CardAction.imBack(session, "menu1", "Order")]),
      new builder.HeroCard(session)
        .title("Menu2")
        .subtitle("This is Menu2")
        .images([
          builder.CardImage.create(
            session,
            "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg"
          ).tap(
            builder.CardAction.showImage(
              session,
              "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/800px-PikePlaceMarket.jpg"
            )
          )
        ])
        .buttons([builder.CardAction.imBack(session, "menu2", "Order")])
    ]);

exports.create = function(bot) {
  bot.dialog("order", [
    function(session) {
      session.send("This is food menu. Please insert what you want.");

      builder.Prompts.choice(session, menuMsg(session), "menu1|menu2|done");
    },
    function(session, results) {
      session.send(
        "Thank you. You order " +
          results.response.entity +
          ". Here is your receipt."
      );
      var msg = new builder.Message(session).attachments([
        new builder.ReceiptCard(session)
          .title("Recipient's Name")
          .items([
            builder.ReceiptItem.create(session, "$22.00", "EMP Museum").image(
              builder.CardImage.create(
                session,
                "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg"
              )
            ),
            builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(
              builder.CardImage.create(
                session,
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"
              )
            )
          ])
          .facts([
            builder.Fact.create(session, "1234567898", "Order Number"),
            builder.Fact.create(session, "VISA 4076", "Payment Method")
          ])
          .tax("$4.40")
          .total("$48.40")
      ]);

      session.endDialog(msg);
    }
  ]);
};
