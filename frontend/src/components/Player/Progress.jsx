import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { msToTime, useInterval } from '../../utils';
import { Range } from 'react-range'

export default function Progress() {
	const { duration, position, paused } = usePlayerStore()
	const [currentPosition, setCurrentPosition] = useState(0)
	const [rangeValue, setRangeValue] = useState(0)
	const [values, setValues] = React.useState([0])

	useEffect(() => {
		if (typeof position == 'number')
			setCurrentPosition(position)
	}, [position])

	useInterval(() => {
		if (!paused) {
			console.log(msToTime(currentPosition))
			setCurrentPosition(currentPosition + 1000)
		}
	}, 1000)

	return (
		<div className='w-3/4 mx-auto relative'>
			{/* Progressbar */}
			{/* <div className="w-full bg-black absolute mt-1 top-px" style={{ height: 2 }} />
			<div className='h-3 w-3 rounded-full bg-gray-200 border border-black absolute left-10' /> */}
			<Range
					step={1}
					min={0}
					max={duration}
					values={[currentPosition]}
					onChange={(values) => {
						// TODO:
						// Seek Spotify Playback
						console.log(values)
						// setValues(values)
					}}
					renderTrack={({ props, children }) => (
						<div
							{...props}
							className="w-full h-3 pr-2 my-4 bg-gray-200 rounded-md"
						>
							{children}
						</div>
					)}
					renderThumb={({ props }) => (
						<div
							{...props}
							className="w-5 h-5 transform translate-x-10 bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						/>
					)}
				/>

			{/* Current time and song length */}
			<div className='progress w-full mt-2 flex justify-between'>
				<span className='text-sm'>{msToTime(currentPosition)}</span>
				{/* <span className='text-sm'>{ position }</span> */}
				<span className='text-sm'>{msToTime(duration)}</span>
			</div>
		</div>)
}
