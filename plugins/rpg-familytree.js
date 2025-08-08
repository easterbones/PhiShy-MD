import { createCanvas, loadImage } from 'canvas'
import Database from '../lib/database.js'
import fs from 'fs/promises'
import path from 'path'

// Usa la stessa istanza del database come in rpg-familia.js
const db = new Database('database.json')

// Funzione per normalizzare il JID per consistenza tra plugin
function normalizeJid(jid) {
    if (!jid) return null
    // Assicurati che abbia il formato corretto (user@s.whatsapp.net)
    if (typeof jid === 'string' && jid.includes('@')) {
        // Rimuovi eventuali parti multiple come user@server@s.whatsapp.net
        return jid.replace(/^(.+)@.+@.+$/, '$1@s.whatsapp.net')
    }
    // Aggiungi il suffisso se manca
    return jid + '@s.whatsapp.net'
}

const generationMap = {
    'nonno': -2, 'nonna': -2,
    'zio': -1, 'zia': -1,
    'mamma': -1, 'papà': -1, 'papá': -1, 'papa': -1,
    'step-mamma': -1, 'step-papà': -1, 'step-papá': -1, 'step-papa': -1,
    'partner': 0, 'sposo': 0, 'sposa': 0,
    'fratello': 0, 'sorella': 0, 'step-fratello': 0, 'step-sorella': 0,
    'Tu': 1,
    'figlio': 2, 'figlia': 2,
    'nipote': 3
}

let handler = async (m, { conn }) => {
    try {
        // DEBUG: Controlla lo stato del db
        console.log('DB check - db esistente:', !!db)
        console.log('DB check - db.data esistente:', !!db.data)
        
        if (!db.data) db.data = { users: {} }
        if (!db.data.users) db.data.users = {}
        
        // Confronta il db caricato con quello dell'altro plugin
        console.log('DB check - numero utenti in db:', Object.keys(db.data.users).length)
        
        const user = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
        
        // DEBUG: Controlla che il JID sia corretto
        console.log('USER JID:', user)
        console.log('USER JID type:', typeof user)
        
        // DEBUG: Verifica i formati JID conosciuti
        const senderNormalized = m.sender?.split('@')[0] + '@s.whatsapp.net'
        console.log('USER JID normalized:', senderNormalized)
        console.log('USER exists in DB:', !!db.data.users[user])
        console.log('USER normalized exists in DB:', !!db.data.users[senderNormalized])
        
        // Prova entrambi i formati JID
        let userJid = user
        if (!db.data.users[userJid] && db.data.users[senderNormalized]) {
            console.log('Usando JID normalizzato')
            userJid = senderNormalized
        }
        
        // Crea utente se non esiste
        if (!db.data.users[userJid]) {
            console.log('Creazione nuovo utente in db:', userJid)
            db.data.users[userJid] = { family: {}, partner: null }
        }
        
        if (!db.data.users[userJid].family || typeof db.data.users[userJid].family !== 'object') {
            console.log('Inizializzazione campo family per:', userJid)
            db.data.users[userJid].family = {}
        }
        
        // DEBUG: Mostra la struttura famiglia
        console.log('DEBUG FAMILY STRUCTURE JID:', userJid)
        console.log('DEBUG FAMILY STRUCTURE:', JSON.stringify(db.data.users[userJid].family || {}, null, 2))
        
        // Verifica famiglia nella memoria corrente
        const hasFamily = Object.keys(db.data.users[userJid]?.family || {}).length > 0
        const hasPartner = !!db.data.users[userJid]?.partner

        // Log più dettagliati
        console.log('hasFamily:', hasFamily, 'membriCount:', Object.keys(db.data.users[userJid]?.family || {}).length)
        console.log('hasPartner:', hasPartner, 'partner:', db.data.users[userJid]?.partner)
        
        // Forza caricamento dal disco per verificare
        console.log('Ricarichiamo dal disco per conferma')
        db._load()
        console.log('Dopo ricarica - utente esiste:', !!db.data.users[userJid])
        console.log('Dopo ricarica - famiglia esiste:', !!db.data.users[userJid]?.family)
        console.log('Dopo ricarica - membri famiglia:', Object.keys(db.data.users[userJid]?.family || {}).length)

        if (!hasFamily && !hasPartner) {
            return m.reply('❌ Questo utente non ha ancora una famiglia registrata.')
        }

        const familyData = await getFamilyTreeData(userJid, conn)

        if (!familyData || familyData.length === 0) {
            let partnerBlock = ''
            if (hasPartner) {
                const partnerId = db.data.users[userJid].partner
                const partnerName = await conn.getName(partnerId)
                partnerBlock = `• *sposo/a*: ${partnerName}\n`
            }
            // DEBUG: Mostra la struttura famiglia anche qui
            console.log('DEBUG FAMILY STRUCTURE (empty familyData):', JSON.stringify(db.data.users[userJid].family, null, 2))
            return m.reply(`❌ Questo utente non ha ancora una famiglia registrata.\n${partnerBlock}`)
        }
        
        const minGen = Math.min(...familyData.map(m => m.generation))
        const maxGen = Math.max(...familyData.map(m => m.generation))
        const genCount = maxGen - minGen + 1
        const width = Math.max(900, familyData.length * 180)
        const height = Math.max(600, genCount * 180 + 120)
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')
        
        const grad = ctx.createLinearGradient(0, 0, width, height)
        grad.addColorStop(0, '#f8fafc')
        grad.addColorStop(1, '#dbeafe')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)
        
        ctx.save()
        ctx.globalAlpha = 0.08
        for (let i = 0; i < width; i += 40) {
            for (let j = 0; j < height; j += 40) {
                ctx.beginPath()
                ctx.arc(i, j, 2, 0, Math.PI * 2)
                ctx.fillStyle = '#60a5fa'
                ctx.fill()
            }
        }
        ctx.restore()
        
        await drawFamilyTreeModern(ctx, familyData, width, height, minGen)
        
        const buffer = canvas.toBuffer('image/png')
        const tempPath = './tmp/family_tree.png'
        await fs.writeFile(tempPath, buffer)
        await conn.sendFile(m.chat, tempPath, 'family_tree.png', '🌳 Albero Genealogico della Famiglia', m)
        await fs.unlink(tempPath)
    } catch (error) {
        console.error('Errore:', error)
        m.reply('❌ Errore nella generazione dell\'albero genealogico: ' + error.message)
    }
}

async function getFamilyTreeData(userId, conn) {
    const visited = new Set()
    let members = []
    
    // Normalizza userId per consistenza
    console.log('getFamilyTreeData - userId ricevuto:', userId)
    const normalizedUserId = typeof userId === 'string' && userId.includes('@') ? 
        userId : 
        (userId + '@s.whatsapp.net').replace(/^(.+)@.+@.+$/, '$1@s.whatsapp.net')
    
    console.log('getFamilyTreeData - userId normalizzato:', normalizedUserId)
    console.log('getFamilyTreeData - utente esiste:', !!db.data.users[normalizedUserId])
    
    try {
        // Assicurati che l'utente esista nel DB
        if (!db.data.users[normalizedUserId]) {
            console.log('getFamilyTreeData - utente non trovato, creazione...')
            db.data.users[normalizedUserId] = { family: {}, partner: null }
        }
        
        console.log('getFamilyTreeData - famiglia utente:', JSON.stringify(db.data.users[normalizedUserId].family || {}))
        console.log('getFamilyTreeData - partner utente:', db.data.users[normalizedUserId].partner)
        
        // Partner
        if (db.data.users[normalizedUserId]?.partner) {
            try {
                const partnerId = db.data.users[normalizedUserId].partner
                console.log('getFamilyTreeData - elaborazione partner:', partnerId)
                let rel = 'partner'
                if (db.data.users[partnerId]?.gender) {
                    rel = db.data.users[partnerId].gender === 'male' ? 'sposo' : db.data.users[partnerId].gender === 'female' ? 'sposa' : 'partner'
                }
                const memberObj = await buildMember(partnerId, conn, rel, 0, false)
                if (memberObj) {
                    console.log('getFamilyTreeData - partner aggiunto:', memberObj.name)
                    members.push(memberObj)
                }
            } catch (e) {
                console.error('Errore nel costruire il partner:', e)
            }
        }
        
        // Main user
        try {
            if (!members.some(m => m.id === normalizedUserId && m.relation === 'Tu')) {
                console.log('getFamilyTreeData - costruzione utente principale')
                const memberObj = await buildMember(normalizedUserId, conn, 'Tu', 1, true)
                if (memberObj) {
                    console.log('getFamilyTreeData - utente principale aggiunto:', memberObj.name)
                    members.push(memberObj)
                }
            }
        } catch (e) {
            console.error('Errore nel costruire l\'utente principale:', e)
        }
        
        // Build generations (fix: always use .type from {type, jid})
        console.log('getFamilyTreeData - avvio buildGenerations')
        await buildGenerations(normalizedUserId, conn, 1, members, visited)
        
        // Remove duplicates
        const unique = {}
        for (const m of members) {
            if (m && m.id && m.relation) {
                unique[m.id + '_' + m.relation] = m
            }
        }
        
        // Only filter out extra 'Tu' entries
        return Object.values(unique).filter(m => m && !(m.id === userId && m.relation !== 'Tu'))
    } catch (e) {
        console.error('Errore in getFamilyTreeData:', e)
        return members.filter(m => m !== null && m !== undefined) // Ritorna comunque ciò che abbiamo
    }
}

async function buildGenerations(userId, conn, selfGen, members, visited) {
    try {
        if (visited.has(userId)) return
        visited.add(userId)
        
        // DEBUG: Verifica l'ID utente e come viene usato per accedere ai dati
        console.log('buildGenerations per userId:', userId)
        console.log('buildGenerations userId type:', typeof userId)
        console.log('db.data.users keys:', Object.keys(db.data.users).slice(0, 5)) // mostra primi 5 per debug
        
        const userData = db.data.users[userId]
        console.log('userData trovato:', !!userData)
        
        if (!userData?.family) {
            console.log('Famiglia non trovata per:', userId)
            return
        }
        
        console.log('Membri famiglia trovati:', Object.keys(userData.family).length)
        console.log('Membri famiglia raw:', JSON.stringify(userData.family, null, 2))
        
        for (const [id, memberData] of Object.entries(userData.family)) {
            try {
                // DEBUG: Log dettagliati per ogni membro
                console.log(`Processando membro family[${id}]:`, JSON.stringify(memberData))
                
                // Always expect {type, jid}
                let relation = null
                if (memberData && typeof memberData === 'object' && memberData.type) {
                    relation = memberData.type
                    console.log('Trovato relation da memberData.type:', relation)
                } else if (typeof memberData === 'string') {
                    relation = memberData
                    console.log('Trovato relation da stringa:', relation)
                }
                
                if (!relation) {
                    console.log('Nessuna relazione trovata, skip')
                    continue
                }
                
                let gen = selfGen + (generationMap[relation] ?? 0)
                console.log(`Costruzione membro: id=${id}, relation=${relation}, gen=${gen}`)
                
                const memberObj = await buildMember(id, conn, relation, gen, false)
                if (memberObj) {
                    console.log('Membro costruito con successo:', memberObj.name)
                    members.push(memberObj)
                } else {
                    console.log('Costruzione membro fallita')
                }
                
                if ([
                    'mamma','papà','papá','papa','step-mamma','step-papà','step-papá','step-papa',
                    'figlio','figlia','nonno','nonna','nipote'
                ].includes(relation)) {
                    console.log(`Ricorsione per: ${id} con relazione ${relation}`)
                    await buildGenerations(id, conn, gen, members, visited)
                }
            } catch (e) {
                console.error(`Errore nel processare membro ${id}:`, e)
            }
        }
    } catch (e) {
        console.error('Errore in buildGenerations:', e)
    }
}

async function buildMember(id, conn, relation, generation, isMain) {
    try {
        // Recupera nome con protezione
        let name = 'Utente'
        try {
            name = await conn.getName(id)
            if (typeof name !== 'string') name = String(name || 'Utente')
            name = name.normalize('NFKD').replace(/[^\p{L}\p{N} .,'_-]/gu, '')
            name = name.replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '')
            if (name.length < 2) name = 'Utente'
        } catch (e) {
            console.error(`Errore nel recuperare il nome per ${id}:`, e)
        }
        
        // Normalizza la relazione
        let rel = 'parente'
        try {
            if (!relation) {
                rel = 'parente'
            } else if (relation === 'figlio' || relation === 'figlia') {
                rel = relation
            } else if (relation === 'mamma' || relation === 'papà' || relation === 'papá' || relation === 'papa') {
                rel = relation
            } else if (relation === 'Tu') {
                rel = 'Tu'
            } else {
                rel = relation
            }
        } catch (e) {
            console.error('Errore nel processare la relazione:', e)
        }
        
        // Ottieni foto profilo con protezione
        let profilePic = null
        try {
            profilePic = await getProfilePicture(conn, id)
        } catch (e) {
            console.error(`Errore nel recuperare la foto profilo per ${id}:`, e)
            // Genera una foto profilo predefinita
            try {
                const canvas = createCanvas(100, 100)
                const ctx = canvas.getContext('2d')
                ctx.fillStyle = '#b0b0b0'
                ctx.fillRect(0, 0, 100, 100)
                ctx.fillStyle = '#FFFFFF'
                ctx.beginPath()
                ctx.arc(50, 35, 20, 0, Math.PI * 2)
                ctx.fill()
                ctx.beginPath()
                ctx.arc(50, 90, 30, Math.PI, Math.PI * 2)
                ctx.fill()
                profilePic = canvas
            } catch (canvasErr) {
                console.error('Errore nel creare foto profilo predefinita:', canvasErr)
            }
        }
        
        return { 
            id, 
            name, 
            relation: rel, 
            generation: typeof generation === 'number' ? generation : 0, 
            profilePic: profilePic || createCanvas(100, 100), 
            isMain: !!isMain 
        }
    } catch (e) {
        console.error('Errore in buildMember:', e)
        return null
    }
}

async function getProfilePicture(conn, userId) {
    try {
        const ppUrl = await conn.profilePictureUrl(userId, 'image')
        return await loadImage(ppUrl)
    } catch {
        try {
            return await loadImage(path.join(process.cwd(), 'src', 'img', 'default_profile.png'))
        } catch {
            const canvas = createCanvas(100, 100)
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = '#b0b0b0'
            ctx.fillRect(0, 0, 100, 100)
            ctx.fillStyle = '#FFFFFF'
            ctx.beginPath()
            ctx.arc(50, 35, 20, 0, Math.PI * 2)
            ctx.fill()
            ctx.beginPath()
            ctx.arc(50, 90, 30, Math.PI, Math.PI * 2)
            ctx.fill()
            return canvas
        }
    }
}

async function drawFamilyTreeModern(ctx, members, width, height, minGen) {
    const byGen = {}
    members.forEach(m => {
        if (!byGen[m.generation]) byGen[m.generation] = []
        byGen[m.generation].push(m)
    })
    const genKeys = Object.keys(byGen).map(Number).sort((a,b) => a-b)
    const levelHeight = 170
    const baseY = 100
    ctx.save()
    ctx.strokeStyle = '#8bb174'
    ctx.lineWidth = 4
    for (let g = 0; g < genKeys.length-1; g++) {
        const currGen = byGen[genKeys[g]]
        const nextGen = byGen[genKeys[g+1]]
        if (!currGen || !nextGen) continue
        currGen.forEach((parent, i) => {
            nextGen.forEach((child, j) => {
                if (isParentChild(parent, child)) {
                    const px = (width/(currGen.length+1))*(i+1)
                    const py = baseY + (g * levelHeight)
                    const cx = (width/(nextGen.length+1))*(j+1)
                    const cy = baseY + ((g+1) * levelHeight)
                    ctx.beginPath()
                    ctx.moveTo(px, py+60)
                    ctx.bezierCurveTo(px, (py+cy)/2, cx, (py+cy)/2, cx, cy-60)
                    ctx.stroke()
                }
            })
        })
    }
    ctx.restore()
    for (let g = 0; g < genKeys.length; g++) {
        const gen = genKeys[g]
        const genMembers = byGen[gen]
        const y = baseY + g*levelHeight
        genMembers.forEach((member, idx) => {
            const x = (width/(genMembers.length+1))*(idx+1)
            drawMemberNodeModern(ctx, x, y, member)
        })
    }
    ctx.save()
    ctx.font = 'bold 32px Segoe UI, Arial'
    ctx.fillStyle = '#2d3a4b'
    ctx.textAlign = 'center'
    ctx.shadowColor = '#b0c4de'
    ctx.shadowBlur = 10
    ctx.fillText('Albero Genealogico', width/2, 60)
    ctx.restore()
}

function isParentChild(parent, child) {
    const up = [
        'mamma','papà','papá','papa','step-mamma','step-papà','step-papá','step-papa',
        'nonno','nonna'
    ]
    const down = ['figlio','figlia','nipote']
    if (up.includes(parent.relation) && (child.relation === 'Tu' || down.includes(child.relation))) return true
    if (parent.relation === 'Tu' && down.includes(child.relation)) return true
    if (parent.relation === 'Tu' && child.relation === 'partner') return true
    if (parent.relation === 'partner' && child.relation === 'Tu') return true
    return false
}

function drawMemberNodeModern(ctx, x, y, member) {
    ctx.save()
    ctx.shadowColor = '#60a5fa'
    ctx.shadowBlur = 18
    ctx.beginPath()
    ctx.arc(x, y, 56, 0, Math.PI*2)
    ctx.fillStyle = member.isMain ? '#fffbe6' : '#f1f5f9'
    ctx.fill()
    ctx.lineWidth = member.isMain ? 6 : 3
    ctx.strokeStyle = member.isMain ? '#fbbf24' : '#60a5fa'
    ctx.stroke()
    ctx.shadowBlur = 0
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, 48, 0, Math.PI*2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(member.profilePic, x-48, y-48, 96, 96)
    ctx.restore()
    ctx.save()
    ctx.font = 'bold 20px Segoe UI, Arial'
    ctx.fillStyle = '#1e293b'
    ctx.textAlign = 'center'
    ctx.fillText(member.name.length>18?member.name.slice(0,15)+'...':member.name, x, y+72)
    ctx.restore()
    ctx.save()
    ctx.font = 'italic 16px Segoe UI, Arial'
    ctx.fillStyle = '#64748b'
    ctx.textAlign = 'center'
    ctx.fillText(member.relation, x, y+94)
    ctx.restore()
    ctx.restore()
}

handler.help = ['alberofamiliare']
handler.tags = ['family']
handler.command = /^(alberofamiliare|familytree|genealogia)$/i
export default handler