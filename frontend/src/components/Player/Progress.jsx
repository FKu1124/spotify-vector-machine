import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { msToTime, useInterval } from '../../utils';
import { seekPlayback } from '../../utils/spotify';
import {
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
} from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

import { MdGraphicEq } from 'react-icons/md'


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
			<Slider aria-label='slider-ex-4' value={currentPosition} min={MIN} max={MAX} step={STEP} onChange={(value) => seekPlayback(token, value)}>
				<SliderTrack bg='red.100'>
					<SliderFilledTrack bg='tomato' />
				</SliderTrack>
				<SliderThumb boxSize={6}>
					<Box color='tomato' as={MdGraphicEq} />
				</SliderThumb>
			</Slider>
			
			{/* Current time and song length */}
			<div className='progress w-full mt-2 flex justify-between'>
				<span className='text-sm text-white'>{msToTime(currentPosition)}</span>
				{/* <span className='text-sm'>{ position }</span> */}
				<span className='text-sm text-white'>{msToTime(duration)}</span>
			</div>
		</div>)
}
