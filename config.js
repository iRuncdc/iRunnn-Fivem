
     // INTEGRASI LANYARD API
        // Ganti 'USER_ID_KAMU' dengan ID Discord asli kamu (contoh: 472782348328...)
        const DISCORD_ID = '579419762321522694'; 

        async function updateAllStatus() {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const res = await response.json();
    if (!res.success) return;

    const user = res.data;

    // --- LOGIKA GAME ---
    const game = user.activities.find(act => act.type === 0);
    if (game) {
        document.getElementById('activity-card').style.display = 'block';
        document.getElementById('activity-name').innerText = game.name;
        document.getElementById('activity-state').innerText = game.state || "In game";
        
        // Handle image
        if (game.assets && game.assets.large_image) {
            let imgId = game.assets.large_image;
            document.getElementById('activity-icon').src = imgId.startsWith("mp:external") 
                ? `https://media.discordapp.net/external/${imgId.split("mp:external/")[1]}`
                : `https://cdn.discordapp.com/app-assets/${game.application_id}/${imgId}.png`;
        }
    } else {
        document.getElementById('activity-card').style.display = 'none';
    }

    // --- LOGIKA SPOTIFY ---
    if (user.listening_to_spotify) {
        document.getElementById('spotify-card').style.display = 'block';
        document.getElementById('spotify-song').innerText = user.spotify.song;
        document.getElementById('spotify-artist').innerText = user.spotify.artist;
        document.getElementById('spotify-album-art').src = user.spotify.album_art_url;
        
        // Progress bar
        const progress = ((Date.now() - user.spotify.timestamps.start) / (user.spotify.timestamps.end - user.spotify.timestamps.start)) * 100;
        document.getElementById('spotify-progress').style.width = Math.min(progress, 100) + "%";
    } else {
        document.getElementById('spotify-card').style.display = 'none';
    }
}


const BADGE_MAP = {
    1: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordstaff.svg",
    2: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordpartner.svg",
    4: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/hypesquadevents.svg",
    8: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/bravery.svg",
    16: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/brilliance.svg",
    32: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/balance.svg",
    64: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/earlysupporter.svg",
    131072: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/developer.svg",
};

async function fetchStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const { data } = await response.json();

        // Profile & Status
        document.getElementById('discord-avatar').src = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png`;
        document.getElementById('display-name').innerText = data.discord_user.global_name || data.discord_user.username;
        document.getElementById('status-dot').className = `status-dot ${data.discord_status}`;

        // Badges
        const badgeContainer = document.getElementById('badge-container');
        badgeContainer.innerHTML = "";
        Object.keys(BADGE_MAP).forEach(flag => {
            if (data.discord_user.public_flags & flag) {
                badgeContainer.innerHTML += `<img src="${BADGE_MAP[flag]}" class="badge-icon">`;
            }
        });

        // Activity (Game)
        const game = data.activities.find(a => a.type === 0);
        if (game) {
            document.getElementById('activity-card').style.display = 'block';
            document.getElementById('activity-name').innerText = game.name;
            document.getElementById('activity-details').innerText = game.details || "In-game";
            if (game.assets) {
                let imgId = game.assets.large_image;
                document.getElementById('activity-icon').src = imgId.startsWith("mp:external") 
                    ? `https://media.discordapp.net/external/${imgId.split("mp:external/")[1]}`
                    : `https://cdn.discordapp.com/app-assets/${game.application_id}/${imgId}.png`;
            }
        } else {
            document.getElementById('activity-card').style.display = 'none';
        }

        // Spotify
        if (data.listening_to_spotify) {
            document.getElementById('spotify-card').style.display = 'block';
            document.getElementById('spotify-song').innerText = data.spotify.song;
            document.getElementById('spotify-artist').innerText = data.spotify.artist;
            document.getElementById('spotify-album').src = data.spotify.album_art_url;
            
            const prog = ((Date.now() - data.spotify.timestamps.start) / (data.spotify.timestamps.end - data.spotify.timestamps.start)) * 100;
            document.getElementById('spotify-bar').style.width = Math.min(prog, 100) + "%";
        } else {
            document.getElementById('spotify-card').style.display = 'none';
        }

    } catch (e) { console.error("API Error", e); }
}

setInterval(fetchStatus, 1000);
fetchStatus();
setInterval(updateAllStatus, 1000); // Update setiap detik untuk kelancaran progress barUpdate tiap 30 detik   
 
