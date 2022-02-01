import React from 'react'
import { useCoordinateSystemStore } from '../../store/coordinateSystemStore'


export default function Preview(props) {

    const { setStartProfile, setEndProfile, startProfile, endProfile } = useCoordinateSystemStore()

    function setProfile(profile) {
        if(props.pos === 'start') {
            setStartProfile(profile)
        }
        if(props.pos === 'end') {
            setEndProfile(profile)
        }
    }

    function getClassname(profile) {
        if (props.pos === 'start' && profile === startProfile) {
            return 'bg-green7'
        }
        if (props.pos === 'end' && profile == endProfile) {
            return 'bg-green7'
        }
        return ''
    }

    if (props.pos === 'start' ) {
        return (
            <div
                className='absolute w-1 h-1 flex items-center justify-center bg-green7'
                style={{ top: props.top, left: props.left }}
            >
                {Object.entries(props.data).map((entry, i) => (
                    <span
                        key={i}
                        // onClick={setStartProfile(entry[0])}
                        // className={getClassname(entry[0])}
                    >
                        {entry[0]}
                    </span>
                ))}      
            </div>
        )
    } else {
        return (
            <div
                className='absolute w-1 h-1 flex items-center justify-center bg-green7'
                style={{ top: props.top, left: props.left }}
            >
                {Object.entries(props.data).map((entry, i) => (
                    <span
                        key={i}
                        // onClick={setEndProfile(entry[0])}                    
                        // className={getClassname(entry[0])}
                    >
                        {entry[0]}
                    </span>
                ))}
            </div>
        )
    }
}
