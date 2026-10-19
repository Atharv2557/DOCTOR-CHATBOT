require("dotenv").config();

const {
  default: makeWASocket,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");

const qrcode = require("qrcode-terminal");

const connectDB = require("./config/db");

const handleMessage = require(
  "./handlers/messageHandler"
);

async function startBot() {
  try {
    const { state, saveCreds } =
      await useMultiFileAuthState("auth");

    const sock = makeWASocket({
      auth: state,
    });

    sock.ev.on(
      "creds.update",
      saveCreds
    );

    sock.ev.on(
      "connection.update",
      ({ connection, qr }) => {
        if (qr) {
          qrcode.generate(qr, {
            small: true,
          });
        }

        if (connection === "open") {
          console.log(
            "✅ WhatsApp Connected"
          );
        }
      }
    );

    sock.ev.on(
      "messages.upsert",
      async ({ messages }) => {
        const msg = messages[0];

        await handleMessage(
          sock,
          msg
        );
      }
    );
  } catch (error) {
    console.error(error);
  }
}

connectDB();

startBot();