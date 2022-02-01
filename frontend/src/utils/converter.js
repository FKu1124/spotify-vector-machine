const msToTime = (ms) => {
    if(!ms)
        return "00:00"
    let mins  = Math.floor(ms / 60000);
    let secs = ((ms % 60000) / 1000).toFixed(0);
    return mins + ":" + (secs < 10 ? '0' : '') + secs;
}

export { msToTime };