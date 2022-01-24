import { useState, useEffect } from 'react'
import { useUserStore } from '../store/userStore';

const track = {
	name: "",
	duration: 0,
	image: "",
	artists: []
}

const useSpotifyPlayer = ({ name, token }) => {

	const [player, setPlayer] = useState(undefined);
	const [loading, setLoading] = useState()
	const [paused, setPaused] = useState()
	const [position, setPosition] = useState()
	const [repeatMode, setRepeatMode] = useState()
	const [shuffle, setShuffle] = useState()
	const [currentTrack, setCurrentTrack] = useState(track)
	const [nextTracks, setNextTracks] = useState()
	const [prevTracks, setPrevTracks] = useState()
	const [active, setActive] = useState(false);
	const [localDeviceID, setLocalDeviceID] = useState()
	const [devices, setDevices] = useState([])
	const [refreshDevices, setRefreshDevices] = useState(false)
	const { deviceID, setDeviceID } = useUserStore();

	const startPlayback = (uris) => {
		let body;
		if(uris[0].includes("spotify:playlist:")) {
			body = JSON.stringify({ context_uri: uris[0] })
		} else {
			body = JSON.stringify({ uris })
		}

		fetch(`https://api.spotify.com/v1/me/player/play?device_id=${localDeviceID}`, {
			method: 'PUT',
			body,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		}).catch(e => console.log(e))
	}

	const seek = (duration) => {

	}

	const getDevices = () => {
		fetch("https://api.spotify.com/v1/me/player/devices", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		}).then(res => res.json())
		.then(data =>  setDevices(data.devices))
		.catch(e => console.log(e))
	}

	const switchDevices = (deviceID) => {
		fetch("https://api.spotify.com/v1/me/player", {
			method: 'PUT',
			body: JSON.stringify({ device_ids: [deviceID] }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		}).catch(e => console.log(e))
	}

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {

			const player = new window.Spotify.Player({
				name,
				getOAuthToken: cb => { cb(token); },
				volume: 0.5
			});

			setPlayer(player);

			player.addListener('ready', ({ device_id }) => {
				setLocalDeviceID(device_id)
				setDeviceID(device_id);
			});

			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			player.addListener('player_state_changed', (state => {
				if (!state) {
					return;
				}

				const { loading, paused, position, repeat_mode, shuffle, track_window } = state
				const { current_track, next_tracks, previous_tracks } = track_window
				const { name, duration_ms, album, artists } = current_track
				setLoading(loading)
				setPaused(paused)
				setPosition(position)
				setRepeatMode(repeat_mode)
				setShuffle(shuffle)
				setCurrentTrack({
					name,
					duration: duration_ms,
					image: album.images[0].url,
					artists
				})
				setNextTracks(next_tracks)
				setPrevTracks(previous_tracks)

				player.getCurrentState().then(state => {
					(!state) ? setActive(false) : setActive(true)
				});

			}));

			player.connect();
		};
	}, []);

	return { player, loading, paused, position, repeatMode, shuffle, currentTrack, nextTracks, prevTracks, active, localDeviceID, startPlayback }
}

export default useSpotifyPlayer;