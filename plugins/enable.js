let handler = async (message, {
  conn: connection,
  usedPrefix: prefix,command,args,isOwner, isAdmin,isROwner}) => {
  const helpText = ("> 𝐃𝐢𝐠𝐢𝐭𝐚 " + prefix + "𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐢 𝐩𝐞𝐫 𝐥𝐚 𝐥𝐢𝐬𝐭𝐚 𝐝𝐞𝐥𝐥𝐞 𝐟𝐮𝐧𝐳𝐢𝐨𝐧𝐢 𝐚𝐭𝐭𝐢𝐯𝐚𝐛𝐢𝐥𝐢 / 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐛𝐢𝐥𝐢 ").trim();
  let isEnabling = /true|Enable|attiva|(turn)?on|1/i.test(command);
  let chatData = global.db.data.chats[message.chat];
  let settings = global.db.data.settings[connection.user.jid] || {};
  let optionName = (args[0] || '').toLowerCase();
  let isGlobalSetting = false;
  
  switch (optionName) {
    case "benvenuto":
      if (!message.isGroup) {
        if (!isOwner) {
          global.dfail("group", message, connection);
          throw false;
        }
      } else {
        if (!isAdmin) {
          global.dfail("admin", message, connection);
          throw false;
        }
      }
      chatData.welcome = isEnabling;
      break;
      
    case 'detect':
      if (!message.isGroup) {
        if (!isOwner) {
          global.dfail("group", message, connection);
          throw false;
        }
      } else {
        if (!isAdmin) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.detect = isEnabling;
      break;
      
    case "delete":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData["delete"] = isEnabling;
      break;
      
    case "chatgpt":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.chatgpt = isEnabling;
      break;
      
    case 'bestemmiometro':
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.bestemmiometro = isEnabling;
      break;
      
    case 'comandieseguiti':
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.comandieseguiti = isEnabling;
      break;
      
    case "antielimina":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antielimina = isEnabling;
      break;
      
    case "public":
      isGlobalSetting = true;
      if (!isROwner) {
        global.dfail("rowner", message, connection);
        throw false;
      }
      global.opts.self = !isEnabling;
      break;
      
    case 'antilink':
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antiLink = isEnabling;
      break;
      
    case "antilinkgp":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail("admin", message, connection);
          throw false;
        }
      }
      chatData.antilinkbase = isEnabling;
      break;
      
    case "antilinkhard":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antilinkbase2 = isEnabling;
      break;
      
    case 'autosticker':
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.autosticker = isEnabling;
      break;
      
    case "antispam":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antiSpam = isEnabling;
      break;
      
    case "antiviewonce":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antiviewonce = isEnabling;
      break;
      
    case "modoadmin":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail("admin", message, connection);
          throw false;
        }
      }
      chatData.modoadmin = isEnabling;
      break;
      
    case 'audios':
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.audios = isEnabling;
      break;
      
    case "restrict":
      isGlobalSetting = true;
      if (!isOwner) {
        global.dfail('owner', message, connection);
        throw false;
      }
      settings.restrict = isEnabling;
      break;
      
    case "jadibot":
      isGlobalSetting = true;
      if (!isOwner) {
        global.dfail('owner', message, connection);
        throw false;
      }
      settings.jadibot = isEnabling;
      break;
      
    case 'autoread':
      isGlobalSetting = true;
      if (!isROwner) {
        global.dfail("rowner", message, connection);
        throw false;
      }
      global.opts.autoread = isEnabling;
      break;
      
    case 'pconly':
    case "soloprivato":
      isGlobalSetting = true;
      if (!isROwner) {
        global.dfail("rowner", message, connection);
        throw false;
      }
      global.opts.pconly = isEnabling;
      break;
      
    case "gconly":
    case "sologruppo":
      isGlobalSetting = true;
      if (!isROwner) {
        global.dfail("rowner", message, connection);
        throw false;
      }
      global.opts.gconly = isEnabling;
      break;
      
    case "swonly":
    case "statusonly":
      isGlobalSetting = true;
      if (!isROwner) {
        global.dfail("rowner", message, connection);
        throw false;
      }
      global.opts.swonly = isEnabling;
      break;
      
    case "anticall":
      isGlobalSetting = true;
      if (!isROwner) {
        global.dfail("rowner", message, connection);
        throw false;
      }
      settings.antiCall = isEnabling;
      break;
      
    case "antiprivato":
      isGlobalSetting = true;
      if (!isROwner) {
        global.dfail("rowner", message, connection);
        throw false;
      }
      settings.antiPrivate = isEnabling;
      break;
      
    case 'gpt':
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.gpt = isEnabling;
      break;
      
    case "antitrava":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antiTraba = isEnabling;
      break;
      
    case 'risposte':
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.risposte = isEnabling;
      break;
      
    case "antiinsta":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail("admin", message, connection);
          throw false;
        }
      }
      chatData.antiinsta = isEnabling;
      break;
      
    case "antitiktok":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antitiktok = isEnabling;
      break;
      
    case "antitelegram":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antitelegram = isEnabling;
      break;
      
    case "antiporno":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antiporno = isEnabling;
      break;
      
    case "antipaki":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antiArab = isEnabling;
      break;
     
     case "antivoip":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antivoip = isEnabling;
      break;
      
      case "talk":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.talk = isEnabling;
      break;
          
       case "autolevelup":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.autolevelup = isEnabling;
      break;    
          
    case "antiruba":
      if (message.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', message, connection);
          throw false;
        }
      }
      chatData.antiruba = isEnabling;
      break;
      
    default:
      let notFoundMessage = {
        'key': {
          'participants': "0@s.whatsapp.net",
          'fromMe': false,
          'id': 'Halo'
        },
        'message': {
          'locationMessage': {
            'name': "𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐧𝐨𝐧 𝐭𝐫𝐨𝐯𝐚𝐭𝐨 ✗",
            'jpegThumbnail': fs.readFileSync("./settings.png"),
            'vcard': "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=15395490858:+1 (539) 549-0858\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
          }
        },
        'participant': "0@s.whatsapp.net"
      };
      
      if (!/[01]/.test(command)) {
        return await connection.sendMessage(message.chat, {
          'text': helpText
        }, {
          'quoted': notFoundMessage
        });
      }
      throw false;
  }
  
  let disabledMsg = {
    'key': {
      'participants': "0@s.whatsapp.net",
      'fromMe': false,
      'id': 'Halo'
    },
    'message': {
      'locationMessage': {
        'name': "𝐒𝐭𝐚𝐭𝐨 »",
        'jpegThumbnail': Buffer.from(await (await fetch('https://telegra.ph/file/de558c2aa7fc80d32b8c3.png')).arrayBuffer()),
        'vcard': "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=15395490858:+1 (539) 549-0858\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
      }
    },
    'participant': "0@s.whatsapp.net"
  };
  
  let enabledMsg = {
    'key': {
      'participants': "0@s.whatsapp.net",
      'fromMe': false,
      'id': 'Halo'
    },
    'message': {
      'locationMessage': {
        'name': "𝐒𝐭𝐚𝐭𝐨 »",
        'jpegThumbnail': Buffer.from(await (await fetch("https://telegra.ph/file/00edd0958c94359540a8f.png")).arrayBuffer()),
        'vcard': "BEGIN:VCARD\nVERSION:3.0\nN:;Unlimited;;;\nFN:Unlimited\nORG:Unlimited\nTITLE:\nitem1.TEL;waid=15395490858:+1 (539) 549-0858\nitem1.X-ABLabel:Unlimited\nX-WA-BIZ-DESCRIPTION:ofc\nX-WA-BIZ-NAME:Unlimited\nEND:VCARD"
      }
    },
    'participant': "0@s.whatsapp.net"
  };
  
  connection.reply(message.chat, "> 𝐅𝐮𝐧𝐳𝐢𝐨𝐧𝐞 » *" + optionName + '*', null, {
    'quoted': isEnabling ? enabledMsg : disabledMsg
  });
};

handler.help = ["attiva", "disabilita"].map(cmd => cmd + "<option>");
handler.tags = ["group", "owner"];
handler.command = /^((attiva|disabilita)|(turn)?[01])$/i;
handler.admin = true;

export default handler;