import { createCanvas, loadImage } from 'canvas'
import db from '../lib/database.js'
import fs from 'fs/promises'
import path from 'path'

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
        if (!db.data) db.data = { users: {} }
        if (!db.data.users) db.data.users = {}
        const user = m.mentionedJid?.[0] || m.quoted?.sender || m.sender
        
        if (!db.data.users[user]) {
            db.data.users[user] = { family: {}, partner: null }
        }
        if (!db.data.users[user].family || typeof db.data.users[user].family !== 'object') {
            db.data.users[user].family = {}
        }
        
        const hasFamily = Object.keys(db.data.users[user].family || {}).length > 0
        const hasPartner = !!db.data.users[user]?.partner
        
        if (!hasFamily && !hasPartner) {
            return m.reply('❌ Questo utente non ha ancora una famiglia registrata.')
        }
        
        const familyData = await getFamilyTreeData(user, conn)
        
        if (!familyData || familyData.length === 0) {
            let partnerBlock = ''
            if (hasPartner) {
                const partnerId = db.data.users[user].partner
                const partnerName = await conn.getName(partnerId)
                partnerBlock = `• *sposo/a*: ${partnerName}\n`
            }
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
    if (db.data.users[userId]?.partner) {
        const partnerId = db.data.users[userId].partner
        let rel = 'partner'
        if (db.data.users[partnerId]?.gender) {
            rel = db.data.users[partnerId].gender === 'male' ? 'sposo' : db.data.users[partnerId].gender === 'female' ? 'sposa' : 'partner'
        }
        members.push(await buildMember(partnerId, conn, rel, 0, false))
    }
    if (!members.some(m => m.id === userId && m.relation === 'Tu')) {
        members.push(await buildMember(userId, conn, 'Tu', 1, true))
    }
    await buildGenerations(userId, conn, 1, members, visited)
    const unique = {}
    for (const m of members) unique[m.id + '_' + m.relation] = m
    return Object.values(unique).filter(m => !(m.id === userId && m.relation !== 'Tu'))
}

async function buildGenerations(userId, conn, selfGen, members, visited) {
    if (visited.has(userId)) return
    visited.add(userId)
    const userData = db.data.users[userId]
    if (!userData?.family) return
    for (const [id, memberData] of Object.entries(userData.family)) {
        // Correzione per leggere correttamente il tipo di relazione
        const relation = typeof memberData === 'object' ? memberData.type : memberData
        if (!relation) continue
        
        let gen = selfGen + (generationMap[relation] ?? 0)
        members.push(await buildMember(id, conn, relation, gen, false))
        if ([
            'mamma','papà','papá','papa','step-mamma','step-papà','step-papá','step-papa',
            'figlio','figlia','nonno','nonna','nipote'
        ].includes(relation)) {
            await buildGenerations(id, conn, gen, members, visited)
        }
    }
}

async function buildMember(id, conn, relation, generation, isMain) {
    let name = await conn.getName(id) || 'Utente'
    name = name.normalize('NFKD').replace(/[^\p{L}\p{N} .,'_-]/gu, '')
    name = name.replace(/[\u200B-\u200D\uFEFF\u202A-\u202E]/g, '')
    if (name.length < 2) name = 'Utente'
    let rel = relation
    if (relation === 'figlio' || relation === 'figlia') rel = relation
    else if (relation === 'mamma' || relation === 'papà' || relation === 'papá' || relation === 'papa') rel = relation
    else if (relation === 'Tu') rel = 'Tu'
    else rel = relation
    const profilePic = await getProfilePicture(conn, id)
    return { id, name, relation: rel, generation, profilePic, isMain }
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