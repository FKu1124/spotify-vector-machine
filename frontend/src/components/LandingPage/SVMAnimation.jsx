import React, { useEffect, useState } from 'react';
import Vivus from 'vivus'
import KUTE from 'kute.js'

import SongCover from './SongCover'
import { Center, Icon, Flex } from '@chakra-ui/react'
import { FaPlay } from 'react-icons/fa'
import WordSpinner from './WordSpinner';

export default function SVMAnimation({ scrollToContent }) {
	const [animationState, setAnimationState] = useState('init')
	const [covers, setCovers] = useState([])
	const cover_images = [
		'https://i.scdn.co/image/ab67616d00004851482869c6f9416161dab79d39',
		'https://i.scdn.co/image/ab67616d00004851aca059cebc1841277db22d1c',
		'https://i.scdn.co/image/ab67616d000048517e42a53ea7f2ad4f36ab23a5',
		'https://i.scdn.co/image/ab67616d000048510c5127071182a8dd9afcdcf8',
		'https://i.scdn.co/image/ab67616d00004851db89b08034de626ebee6823d',
		'https://i.scdn.co/image/ab67616d000048514509204d0860cc0cc67e83dc',
		'https://i.scdn.co/image/ab67616d00004851a461aa96bd9a8fcd0a492aee',
		'https://i.scdn.co/image/ab67616d00004851b7bea3d01f04e6d0408d2afe',
		'https://i.scdn.co/image/ab67616d000048519a81658775e67d37b9e13be1',
		'https://i.scdn.co/image/ab67616d00004851e2213d84fabb15100c425198',
		'https://i.scdn.co/image/ab67616d00004851cbdeb4ed581e56ac25609357',
		'https://i.scdn.co/image/ab67616d00004851522088789d49e216d9818292',
		'https://i.scdn.co/image/ab67616d000048518399047ff71200928f5b6508',
		'https://i.scdn.co/image/ab67616d000048511dfb1645591b74f5d59c66be',
		'https://i.scdn.co/image/ab67616d000048515b96a8c5d61be8878452f8f1',
		'https://i.scdn.co/image/ab67616d00004851a7865e686c36a4adda6c9978',
		'https://i.scdn.co/image/ab67616d00004851707d13d3f87652e737e94d45',
		'https://i.scdn.co/image/ab67616d00004851a20464e6697dc1149d3a5cdc',
		'https://i.scdn.co/image/ab67616d000048515695a657aef0e81bde0c6001',
		'https://i.scdn.co/image/ab67616d0000485156a6d6e493a8f338be63fc49',
		'https://i.scdn.co/image/ab67616d0000485168384dd85fd5e95831252f60',
		'https://i.scdn.co/image/ab67616d0000485113f2466b83507515291acce4',
		'https://i.scdn.co/image/ab67616d00004851e175a19e530c898d167d39bf',
		'https://i.scdn.co/image/ab67616d00004851198b72cd638a4ddea81b0b03',
		'https://i.scdn.co/image/ab67616d00004851c12b6aa3d50150032e455286',
		'https://i.scdn.co/image/ab67616d00004851d400d27cba05bb0545533864',
		'https://i.scdn.co/image/ab67616d0000485111c2cc2ef9cada4f6bd84690',
		'https://i.scdn.co/image/ab67616d000048518d1570a03b9354518f0b618b',
		'https://i.scdn.co/image/ab67616d000048515e66bc0df2bd18e746dbb823',
		'https://i.scdn.co/image/ab67616d00004851a5ce236c22035a02cf87d4de',
	]

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

	const playlist_covers = [1, 2, 6, 7, 8, 11, 12, 13, 18, 22, 23, 27, 28]

	let x_rand, y_rand, count = 0
	let img = null
	let playlist = false

	if (covers.length === 0) {
		for (let x = 0; x < window.innerWidth * 0.8; x += window.innerWidth / 7) {
			for (let y = 0; y < window.innerHeight; y += window.innerHeight / 5) {
				x_rand = window.innerWidth * 0.1 + (x - window.innerWidth * 0.04) + Math.random() * window.innerWidth * 0.08
				y_rand = window.innerHeight * 0.1 + (y - window.innerHeight * 0.04) + Math.random() * window.innerHeight * 0.08

				playlist_covers.includes(count) ? playlist = true : playlist = false
				img = cover_images[count]
				count++
				if (Math.random() > 0.2) {
					covers.push({ img: img, top: y_rand, left: x_rand, playlist: playlist })
				}
			}
		}
	}

	useEffect(() => {
		console.log('START RENDER');

		const tween = KUTE.fromTo(
			'#mainVec1',
			{ path: '#mainVec1' },
			{ path: '#mainVec2' },
			{ morphPrecision: 10 }
		)
		const tween2 = KUTE.fromTo(
			'#dotted11',
			{ path: '#dotted11' },
			{ path: '#dotted12' },
			{ morphPrecision: 10 }
		)
		const tween3 = KUTE.fromTo(
			'#dotted21',
			{ path: '#dotted21' },
			{ path: '#dotted22' },
			{ morphPrecision: 10 }
		)

		function startAnimation() {
			setAnimationState('animate')

			setTimeout(() => {
				let vector = document.getElementById('vector')
				vector.style.visibility = 'visible'
				new Vivus('vector', { type: 'scenario', duration: 150 }, () => { setTimeout(transformSVM, 1000) })
			}, 1000)
		}

		function transformSVM() {
			let invisibleCovers = document.getElementsByClassName('invisibleCover')
			let playlistCovers = document.getElementsByClassName('playlistCover')

			for (let el of invisibleCovers) {
				el.hidden = true
			}

			let newValue, relTop = 0
			let newTop = window.innerHeight * 0.6
			let newBottom = window.innerHeight * 0.95

			for (let cover of playlistCovers) {
				relTop = cover.offsetTop / window.innerHeight
				newValue = Math.ceil(newTop + (newBottom - newTop) * relTop)
				cover.style.transition = 'top 1s';
				cover.style.top = `${newValue}px`
			}

			tween.start()
			tween2.start()
			tween3.start()

			setAnimationState('finish')
		}
		setTimeout(() => { startAnimation() }, 1200)
	}, []
	)

	return (
		<>
			<div className={`z-20 svm-animation w-full flex items-center h-screen absolute ${animationState !== 'init' ? 'opacity-0' : 'opacity-100'} ${animationState !== 'finish' ? 'opacity-0' : 'opacity-100'}`}>
				<div className='w-full flex-col justify-center text-white text-6xl pb-64'>
					{animationState !== 'finish' ? 'Welcome to the Spotify Vector Machine' : <WordSpinner scrollToContent={scrollToContent} />}
				</div>
			</div>

			<div className={`svm-animation w-full h-screen absolute overflow-hidden ${animationState === 'init' ? 'opacity-0' : 'opacity-100'}`}>
				<div className='covers'>
					{covers.map((cover, id) => (
						<SongCover albumCover={cover.img} top={cover.top} left={cover.left} key={id} playlist={cover.playlist} />
					))}
				</div>

				<svg id="vector" className='w-full h-full invisible' viewBox={`0 0 1440 1024`} fill="none" preserveAspectRatio="none">
					<g>
						<path data-start="0" id="mainVec1" d="M-1 549.5L260.5 376C590.9 170.8 535.833 314.167 467.5 437.5C186.3 949.5 552.333 790.5 704 651C1212.5 157.5 1248.5 309 970.5 712.5C748.1 1035.3 1199.5 822.167 1444.5 680" stroke="#D8F3DC" strokeWidth="5" />
						<path data-start="20" id="dotted11" d="M-4.5 419.5L267.5 241C663.5 14.6001 662.167 214.5 610.5 359.5C299 932.5 580.015 639.525 690.5 549.5C1095.5 219.5 1143.5 259.5 1190.5 286C1237.5 312.5 1199 480.5 1119 587.5C790.458 1026.93 1300 671 1447 578" stroke="#D8F3DC" />
						<path data-start="20" id="dotted21" d="M-6.5 686.5L254 509.5C427.5 369.5 418.215 395.264 372.5 484.5C122.5 972.5 480.127 936.808 617.5 812.5C1159 322.5 1010.96 527.5 909 679.5C610.5 1124.5 1086 943 1445.5 807" stroke="#D8F3DC" />
						<path id="arrowHead" d="M1441.17 716.76L1399.9 708.651L1431.89 675.735L1441.17 716.76Z" fill="none" />
					</g>
					<g className='hidden'>
						<path id="mainVec2" d="M-0.5 830.5H1439" stroke="#D8F3DC" strokeWidth="3" />
						<path id="dotted12" d="M0 742H1439.5" stroke="#D8F3DC" strokeDasharray={"10,10"} />
						<path id="dotted22" d="M0 920H1439.5" stroke="#D8F3DC" />
					</g>

					{/* <g className='hidden'>
						<path id="mainVec2" d="M-1009 789.019L-426.436 690.6C309.622 574.199 81.7315 620.639 -70.5 690.6C-696.951 981.035 -583.5 1103 561.583 846.596C1374.5 664.569 1452 681.5 1452 681.5C1452 681.5 1653.19 945.393 2199 864.748" stroke="#D8F3DC" strokeWidth="5" />
						<path id="dotted12" d="M-1016.54 714.644L-410.56 613.116C471.681 484.342 90.1073 661.526 -25 744C-718.986 1069.91 285.688 839.791 531.834 788.586C841.5 724.168 1347.5 628 1442.5 628C1537.5 628 1664.71 749.34 1486.48 810.2C754.529 1060.14 1883.05 858.452 2204.97 799.109" stroke="#D8F3DC" strokeDasharray={"10,10"} />
						<path id="dotted22" d="M-1021 866.51L-440.637 765.835C-54.0988 686.205 -74.7841 700.859 -176.632 751.615C-733.603 1029.18 -339.5 1101.9 369.199 938.177C1327.5 716.788 2207.87 631.972 1615 807.5C932.713 1009.5 1401.82 1014.3 2215 938.177" stroke="#D8F3DC" />
					</g> */}
				</svg>
			</div>
		</>
	);
}