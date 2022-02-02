export const getPlaybackState = async (token) => {
    try {
        const res = await fetch(`https://api.spotify.com/v1/me/player`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).catch(e => console.log(e))
        return res.json()
    } catch (e) {
        console.log(e)
    }
}

export const transferPlayback = (token, deviceID) => {
    fetch("https://api.spotify.com/v1/me/player", {
        method: 'PUT',
        body: JSON.stringify({ device_ids: [deviceID] }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).catch(e => console.log(e))
}

export const getAvailableDevices = async (token) => {
    try {
        const res = await (fetch("https://api.spotify.com/v1/me/player/devices", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }))
        return await res.json()
    } catch (e) {
        console.log(e)
    }
}

// Still the "App playing" problem
export const togglePlayBack = (token, play) => {
    fetch(`https://api.spotify.com/v1/me/player/${play ? 'play' : 'pause'}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).catch(e => console.log(e))
}

export const startPlayback = (token, uris, deviceID, trackIndex) => {
    const position = trackIndex ? trackIndex : 0
    let body;
    if (uris[0].includes("spotify:playlist:")) {
        body = JSON.stringify({ context_uri: uris[0], offset: { position } })
    } else {
        body = JSON.stringify({ uris })
    }

    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
        method: 'PUT',
        body,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).catch(e => console.log(e))
}

export const skipToPrevNext = (token, prev) => {
    fetch(`https://api.spotify.com/v1/me/player/${prev ? 'previous' : 'next'}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).catch(e => console.log(e))
}

export const seekPlayback = (token, position_ms) => {
    fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).catch(e => console.log(e))
}

export const togglePlaybackShuffle = (token, shuffle) => {
    fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${String(shuffle)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).catch(e => console.log(e))
}

// uri ONLY accepts spotify:track: uris
export const addItemToQueue = (token, uri) => {
    fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).catch(e => console.log(e))
}

export const getActiveDevice = async (token) => {
    // Check if there is an active player and save it as activeDevice
    const { devices } = await getAvailableDevices(token)
    let activeDevice = devices.find(device => device.is_active === true)
    // If no player is currently active, select our player as activeDevice
    if(!activeDevice)
        activeDevice = devices.find(device => device.name === 'SVM Player')
    return new Promise((resolve, reject) => {
        if(activeDevice)
            resolve(activeDevice)
        else
            reject()
    })
}