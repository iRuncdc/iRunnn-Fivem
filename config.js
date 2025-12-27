
     // INTEGRASI LANYARD API
        // Ganti 'USER_ID_KAMU' dengan ID Discord asli kamu (contoh: 472782348328...)
        const DISCORD_ID = '579419762321522694'; 

        async function fetchDiscordStatus() {
            try {
                const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
                const data = await response.json();
                
                
                if (data.success) {
                    const user = data.data;
                    
                    // Update Nama & Avatar
                    document.getElementById('discord-name').innerText = user.discord_user.username;
                    document.getElementById('discord-icon').src = `https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}.png`;
                    
                    // Update Dot Status
                    const dot = document.getElementById('status-dot');
                    dot.className = `status-dot ${user.discord_status}`;

                    // Update Aktivitas
                    if (user.activities.length > 0) {
                        const activity = user.activities.find(a => a.type === 0) || user.activities[0];
                        document.getElementById('discord-activity').innerText = `Playing: ${activity.name}`;
                    } else {
                        document.getElementById('discord-activity').innerText = user.discord_status.toUpperCase();
                    }

                }
            } catch (error) {
                console.error("Gagal mengambil data Discord", error);
            }
        }

        async function updateSpotifyStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();

        if (data.success && data.data.listening_to_spotify) {
            const spotify = data.data.spotify;
            
            // Tampilkan card Spotify
            document.getElementById('spotify-card').style.display = 'block';
            
            // Update Info Lagu & Artis
            document.getElementById('spotify-song').innerText = spotify.song;
            document.getElementById('spotify-artist').innerText = `by ${spotify.artist}`;
            document.getElementById('spotify-album-art').src = spotify.album_art_url;

            // Hitung Progress Bar
            const start = spotify.timestamps.start;
            const end = spotify.timestamps.end;
            const now = Date.now();
            const progress = ((now - start) / (end - start)) * 100;
            
            document.getElementById('spotify-progress').style.width = `${Math.min(progress, 100)}%`;

        } else {
            // Sembunyikan jika tidak sedang mendengarkan
            document.getElementById('spotify-card').style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching Spotify data:", error);
    }
}
        setInterval(updateSpotifyStatus, 1000);
        fetchDiscordStatus();
        setInterval(fetchDiscordStatus, 30000); // Update tiap 30 detik   
 