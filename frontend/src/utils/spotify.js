export const startPlayback = (token, uris, deviceID) => {

    let body;
    if(uris[0].includes("spotify:playlist:")) {
        body = JSON.stringify({ context_uri: uris[0] })
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

export const seek = (duration) => {

}

export const refreshDevices = async (token) => {
    const res = await(fetch("https://api.spotify.com/v1/me/player/devices", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }))
    return await res.json()
}

export const switchDevices = (token, deviceID) => {
    fetch("https://api.spotify.com/v1/me/player", {
        method: 'PUT',
        body: JSON.stringify({ device_ids: [deviceID] }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).catch(e => console.log(e))
}