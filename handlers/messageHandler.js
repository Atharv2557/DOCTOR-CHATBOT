const sessions = {};

module.exports = async (sock, msg) => {
  if (!msg.message) return;

  const sender = msg.key.remoteJid;

  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text;

  if (!text) return;

  if (!sessions[sender]) {
    sessions[sender] = {
      step: 0,
    };
  }

  const session = sessions[sender];

  if (text.toLowerCase() === "hi") {
    session.step = 1;

    await sock.sendMessage(sender, {
      text:
        "🏥 Welcome to Doctor Clinic\n\n1. Book Appointment",
    });

    return;
  }

  if (session.step === 1 && text === "1") {
    session.step = 2;

    await sock.sendMessage(sender, {
      text: "Enter Your Name",
    });

    return;
  }

  if (session.step === 2) {
    session.name = text;

    session.step = 3;

    await sock.sendMessage(sender, {
      text: "Enter Mobile Number",
    });

    return;
  }

  if (session.step === 3) {
    session.mobile = text;

    await sock.sendMessage(sender, {
      text:
        `✅ Appointment Request Saved\n\nName: ${session.name}\nMobile: ${session.mobile}`,
    });

    delete sessions[sender];
  }
};