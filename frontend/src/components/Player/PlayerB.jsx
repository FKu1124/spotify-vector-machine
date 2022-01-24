import React from 'react'
import useSpotifyPlayer from '../../hooks/useSpotifyPlayer'


export default function PlayerB({ token }) {

	const { player, paused, currentTrack, startPlayback } = useSpotifyPlayer({ name: "SVM Player", token })

	return (
		<div className='flex md:flex-col w-11/12 mx-auto mb-3 bg-gray-200 border border-black rounded-lg'>
			<button onClick={() => startPlayback(["spotify:playlist:37i9dQZF1DX0gbcr80GO9l"])}> PLAY!! </button>
			<div className='flex flex-col w-2/5 md:w-full mx-auto py-3 md:py-5'>
				{/* Song Cover */}
				{currentTrack.image && 
					<img src={currentTrack.image} alt="" className='now-playing__cover w-9/12 md:w-3/4 mx-auto my-auto' />
				}
			</div>

			<div className='flex flex-col w-3/5 md:w-full mx-auto py-3 md:py-3 justify-center'>
				<div className='w-3/4 mx-auto relative'>
					{/* Progressbar */}
					<div className="w-full bg-black absolute mt-1 top-px" style={{ height: 2 }} />
					<div className='h-3 w-3 rounded-full bg-gray-200 border border-black absolute left-10' />

					{/* Current time and song length */}
					<div className='progress w-full mt-2 flex justify-between'>
						<span className='text-sm'>1:12</span>
						<span className='text-sm'>3:36</span>
					</div>
				</div>

				{/* Player  */}
				<div className="player flex w-1/2 mx-auto justify-around">
					{/* Prev */}
					<svg onClick={() => { player.previousTrack() }} xmlns="http://www.w3.org/2000/svg" className="btn-spotify h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
					</svg>
					<svg onClick={() => { player.togglePlay() }} xmlns="http://www.w3.org/2000/svg" className="btn-spotify h-12 w-12 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						{paused ? (
							<>
								<path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
								<path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</>
						) : (
							<path d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						)}
					</svg>

					{/* Skip */}
					<svg onClick={() => { player.nextTrack() }} xmlns="http://www.w3.org/2000/svg" className="btn-spotify h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>

				{/* Feedback */}
				<div className="flex w-1/2 mx-auto justify-around mt-2">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
					</svg>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
					</svg>
				</div>
			</div>
		</div>
	)
}
