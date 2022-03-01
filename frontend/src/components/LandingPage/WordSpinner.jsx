import { Flex, Center, Icon } from '@chakra-ui/react'
import { FaPlay } from 'react-icons/fa'

const WORDS1 = [
	"Tired",
	"Angry",
	"Sad",
	"Bored",
	"Worried"
]
const WORDS2 = [
	"Happy",
	"Relaxed",
	"Excited",
	"Delighted",
	"Worriless"
]

export default function WordSpinner({ scrollToContent }) {
	return (
		<>
			<div className='w-screen flex flex-row justify-center'>
				<div className='text-6xl text-white'>
					Let Us Take You From
				</div>
				<div className='text-6xl text-white w-48 mx-3'>
					<div className='absolute'>
						{WORDS1.map((word, i) => (
							<span key={i} id={`word1${i}`} className='hiddenStack'>{word}</span>
						))}
					</div>
				</div>
				<p className='text-6xl text-white'>
					to
				</p>
				<div className='text-6xl text-white w-48 mx-3'>
					<div className='absolute'>
						{WORDS2.map((word, i) => (
							<span key={i} id={`word2${i}`} className='hiddenStack'>{word}</span>
						))}
					</div>
				</div>
			</div>
			<div className='h-10' />
			<Flex direction='column' align='center'>
				<Center className='animate-pulse cursor-pointer'>
					<Icon w={20} h={20} color='tomato' as={FaPlay} onClick={() => scrollToContent()} />
					{/* <Icon w={20} h={20} color='#d8f3dc' as={FaPlay} onClick={() => scrollToContent()} /> */}
				</Center>
			</Flex>
		</>
	)
}
