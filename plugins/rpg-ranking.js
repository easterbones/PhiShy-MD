let handler = m => m;

handler.before = function (m) {
    let user = global.db.data.users[m.sender];
    let level = user.level;

    const roles = [
        { min: 0, max: 1, role: '*💀 RANDOM SU VIRIDI V* 🪤' },
        { min: 2, max: 3, role: '*💀 RANDOM SU VIRIDI IV* 🪤' },
        { min: 4, max: 5, role: '*💀 RANDOM SU VIRIDI III* 🪤' },
        { min: 6, max: 7, role: '*💀 RANDOM SU VIRIDI II* 🪤' },
        { min: 8, max: 9, role: '*💀 RANDOM SU VIRIDI I* 🪤' },

        { min: 10, max: 11, role: '*🍼 PAIACCIO DI VIRIDI V* 🖤' },
        { min: 12, max: 13, role: '*🍼 PAIACCIO DI VIRIDI IV* 🖤' },
        { min: 14, max: 15, role: '*🍼 PAIACCIO DI VIRIDI III* 🖤' },
        { min: 16, max: 17, role: '*🍼 PAIACCIO DI VIRIDI II* 🖤' },
        { min: 18, max: 19, role: '*🍼 PAIACCIO DI VIRIDI I* 🖤' },

        { min: 20, max: 21, role: '*😈 SPAMMERINO V*' },
        { min: 22, max: 23, role: '*😈 SPAMMERINO IV*' },
        { min: 24, max: 25, role: '*😈 SPAMMERINO III*' },
        { min: 26, max: 27, role: '*😈 SPAMMERINO II*' },
        { min: 28, max: 29, role: '*😈 SPAMMERINO I*' },

        { min: 30, max: 31, role: '*🎭 MORTO DENTRO V* 🖤' },
        { min: 32, max: 33, role: '*🎭 MORTO DENTRO IV* 🖤' },
        { min: 34, max: 35, role: '*🎭 MORTO DENTRO III* 🖤' },
        { min: 36, max: 37, role: '*🎭 MORTO DENTRO II* 🖤' },
        { min: 38, max: 39, role: '*🎭 MORTO DENTRO I* 🖤' },

        { min: 40, max: 41, role: '*🔥 ZOZZAPER V* 🕷️' },
        { min: 42, max: 43, role: '*🔥 ZOZZAPER IV* 🕷️' },
        { min: 44, max: 45, role: '*🔥 ZOZZAPER III* 🕷️' },
        { min: 46, max: 47, role: '*🔥 ZOZZAPER II* 🕷️' },
        { min: 48, max: 49, role: '*🔥 ZOZZAPER I* 🕷️' },

        { min: 50, max: 51, role: '*👹 HATER DI EBOLINI V* ⚔️' },
        { min: 52, max: 53, role: '*👹 HATER DI EBOLINI IV* ⚔️' },
        { min: 54, max: 55, role: '*👹 HATER DI EBOLINI III* ⚔️' },
        { min: 56, max: 57, role: '*👹 HATER DI EBOLINI II* ⚔️' },
        { min: 58, max: 59, role: '*👹 HATER DI EBOLINI I* ⚔️' },

        { min: 60, max: 61, role: '*🎩 CHAD DEL SERVER V* 💪' },
        { min: 62, max: 63, role: '*🎩 CHAD DEL SERVER IV* 💪' },
        { min: 64, max: 65, role: '*🎩 CHAD DEL SERVER III* 💪' },
        { min: 66, max: 67, role: '*🎩 CHAD DEL SERVER II* 💪' },
        { min: 68, max: 69, role: '*🎩 CHAD DEL SERVER I* 💪' },

        { min: 70, max: 71, role: '*👑 SEMIDIO DEL MEME III* 🌌' },
        { min: 72, max: 73, role: '*👑 SEMIDIO DEL MEME II* 🌌' },
        { min: 74, max: 75, role: '*👑 SEMIDIO DEL MEME I* 🌌' },

        { min: 76, max: 77, role: '*😼 PRO DI PHISHY II* 🎮' },
        { min: 78, max: 79, role: '*😼 PRO DI PHISHY I* 🎮' },

        { min: 80, max: 81, role: '*👑 EMO SUPREMO II* 🕶️' },
        { min: 82, max: 83, role: '*👑 EMO SUPREMO I* 🕶️' },

        { min: 84, max: 85, role: '*💀 LEGGENDARIA PRESENZA II* 🌑' },
        { min: 86, max: 87, role: '*💀 LEGGENDARIA PRESENZA I* 🌑' },

        { min: 88, max: 89, role: '*⚡ DEMONE DI PHISHY II* 👿' },
        { min: 90, max: 91, role: '*⚡ DEMONE DI PHISHY I* 👿' },

        { min: 92, max: 93, role: '*🔥 ANIMA DANNATA II* 🕯️' },
        { min: 94, max: 95, role: '*🔥 ANIMA DANNATA I* 🕯️' },

        { min: 96, max: 97, role: '*💎 ASCESO II* ✨' },
        { min: 98, max: 99, role: '*💎 ASCESO I* ✨' },

        { min: 100, max: 101, role: '*👑 ÉLITE SUPREMA* 🏁' },
        { min: 102, max: Infinity, role: '*👑 ∞ ÉLITE ASSOLUTA* 💎🏁' }
    ];

    // Assegna il ruolo
    user.role = roles.find(r => level >= r.min && level <= r.max)?.role || '*👑 ∞ ÉLITE ASSOLUTA* 💎🏁';

    return true;
};

export default handler;