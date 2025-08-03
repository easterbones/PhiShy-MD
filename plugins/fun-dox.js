import { performance } from 'perf_hooks'
import PhoneNumber from 'awesome-phonenumber'
import { getDevice } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text }) => {
    const dispositivo = await getDevice(m.key.id)
    let start = `Iniziando dox... 0%`
    let msg = await m.reply(start)
    
    // Funzione per aggiornare il messaggio
    const updateMsg = async (percentage) => {
        let progressMsg = `Doxing in corso... ${percentage}%`
        await conn.relayMessage(m.chat, {
            protocolMessage: {
                key: msg.key,
                type: 14,
                editedMessage: {
                    conversation: progressMsg
                }
            }
        }, {})
    }
    
    // Simulazione progresso
    await updateMsg(pickRandom(['0','1','2','3','4','5','6','7','8','9','10']))
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await updateMsg(pickRandom(['11','12','13','14','15','16','17','18','19','20','21','22','23','24','25']))
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await updateMsg(pickRandom(['26','27','28','29','30','31','32','33','34','35','36','37','38','39','40']))
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await updateMsg(pickRandom(['41','42','43','44','45','46','47','48','49','50','51','52','53','54','55']))
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await updateMsg(pickRandom(['56','57','58','59','60','61','62','63','64','65','66','67','68','69','70']))
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await updateMsg(pickRandom(['71','72','73','74','75','76','77','78','79','80','81','82','83','84','85']))
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await updateMsg(pickRandom(['86','87','88','89','90','91','92','93','94','95','96','97','98','99','100']))
    await new Promise(resolve => setTimeout(resolve, 1000))

    let old = performance.now()
    let neww = performance.now()
    let speed = `${neww - old}`
    
    // Ottieni il dispositivo reale dell'utente
    const userDevice = m.device || dispositivo || 'Sconosciuto';

    let doxeo = `*[ ✔ ] Persona doxata con successo*\n\n` +
        `Nome: ${text}\n\n` +
        `Ip: ${pickRandom(['192.28.211.234','191.101.0.1', '192.100.1.1', '194.124.0.1'])}\n` +
        `*IPV6:* ${pickRandom(['4e4d:1176:3285:02bb:40c7:bd44:4094:4f37','806a:9b5d:c5b3:e852:b490:0492:bef9:085b'])}\n` +
        `*UPNP:* ${pickRandom(['enabled','disabled'])}\n` +
        `*Dispositivo:* ${userDevice}\n` +
        `*MAC:* ${pickRandom(['4A:93:23:18:BA:7F','F0:1A:30:3B:EA:D1'])}\n` +
        `*ISP:* ${pickRandom(['Telecom Italia','Vodafone','WINDTRE','Fastweb'])}\n` +
        `*DNS:* ${pickRandom(['8.8.8.8','8.8.4.4','1.1.1.1'])}\n` +
        `*SUBNET MASK:* ${pickRandom(['255.255.128.0','255.255.255.240'])}\n` +
        `*ROUTER VENDEDOR:* ${pickRandom(['ERICCSON','Asus','Cisco','D-Link'])}\n` +
        `*EXTERNAL MAC:* ${pickRandom(['4A:93:23:18:BA:7F','F0:1A:30:3B:EA:D1'])}\n` +
        `MODEM JUMPS: ${pickRandom(['61','62','63','64','65','66','67','68','69','70'])}`

    await conn.relayMessage(m.chat, {
        protocolMessage: {
            key: msg.key,
            type: 14,
            editedMessage: {
                conversation: doxeo
            }
        }
    }, {})
}

handler.help = ['doxear <nombre> | <@tag>']
handler.tags = ['fun']
handler.command = /^Dox|dox/i
handler.admin = true
export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}