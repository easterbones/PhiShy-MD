import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  
  if (!mime.startsWith('image/')) {
    return m.reply('🍭 Rispondi a una *immagine.*')
  }
  await m.react('🕓')

  let media = await q.download()
  let formData = new FormData()
  formData.append('image', media, { filename: 'file' })

  let api = await axios.post('https://api.imgbb.com/1/upload?expiration=600&key=cd3375fba3a85183080285ba0cc5d3d9', formData, {
    headers: {
      ...formData.getHeaders()
    }
  })

  if (api.data.data) {
    let txt = '`- I B B  -  U P L O A D E R`\n\n'
        txt += `  *Titolo* : ${q.filename || 'x'}\n`
        txt += `  *Id* : ${api.data.data.id}\n`
        txt += `  *link da usare nel bot* : ${api.data.data.url}\n`
        txt += `  *link completo della pagina* : ${api.data.data.url_viewer}\n`
        txt += `  *Mime* : ${mime}\n`
        txt += `  *File* : ${q.filename || 'x.jpg'}\n`
        txt += `  *Estensione* : ${api.data.data.image.extension}\n`
        txt += `  *Link eliminazione* : ${api.data.data.delete_url}\n\n`
    await conn.sendFile(m.chat, api.data.data.url, 'ibb.jpg', txt, m, null, phishy)
    await m.react('✅')
  } else {
    await m.react('✖️')
  }
}

handler.tags = ['tools']
handler.help = ['ibb']
handler.command = /^(ibb)$/i
handler.register = true 
export default handler
