import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { msToTime, useInterval } from '../../utils';
import { Range, Direction, getTrackBackground } from 'react-range'
import { seekPlayback } from '../../utils/spotify';

export default function Progress() {
	const { duration, position, paused, token } = usePlayerStore()
	const [currentPosition, setCurrentPosition] = useState(0)

	useEffect(() => {
		if (typeof position == 'number')
			setCurrentPosition(position)
	}, [position])

	useInterval(() => {
		if (!paused) {
			setCurrentPosition(currentPosition + 1000)
		}
	}, 1000)

	const arrow = {
		border: "solid black",
		borderWidth: "0 3px 3px 0",
		display: "inline-block",
		padding: "3px",
		transform: "rotate(-45deg)",
		WebkitTransform: "rotate(-45deg)",
	}

	const MIN = 0
	const MAX = duration <= 0 ? 1 : duration
	const STEP = 1

	return (
		<div className='w-3/4 mx-auto relative'>
			{/* Progressbar */}

			<Range
				values={[currentPosition]}
				step={STEP}
				min={MIN}
				max={MAX}
				onChange={(values) => {
					// TODO:
					// Seek Spotify Playback
					console.log(values[0])
					seekPlayback(token, values[0])
					// setValues(values)
				}}
				renderTrack={({ props, children }) => (
					<div
						onMouseDown={props.onMouseDown}
						onTouchStart={props.onTouchStart}
						style={{
							...props.style,
							height: '36px',
							display: 'flex',
							width: '100%'
						}}
					>
						<div
							ref={props.ref}
							style={{
								height: '5px',
								width: '100%',
								borderRadius: '4px',
								background: getTrackBackground({
									values: [currentPosition],
									colors: ['#548BF4', '#ccc'],
									min: MIN,
									max: MAX,
								}),
								alignSelf: 'center'
							}}
						>
							{children}
						</div>
					</div>
				)}
				renderThumb={({ props, isDragged }) => (
					<div
						{...props}
						style={{
							...props.style,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<i style={arrow}></i>
					</div>
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
