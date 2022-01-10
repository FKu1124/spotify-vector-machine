import React from 'react'

export default function CoordinateSystem() {

	const handleMouse = (e) => {
    console.log(`X: ${e.nativeEvent.offsetX} Y: ${e.nativeEvent.offsetY}`)
  }

  return (   
    <div onMouseDown={e => handleMouse(e)} className='align-middle relative' style={{ width: "400px", height: "400px", backgroundColor:"red" }}>
			<div style={{position:'absolute', top:'200px', left:'0px', height:'2px', width:'400px', backgroundColor:'grey' }} />
			<div style={{position:'absolute', top:'0px', left:'200px', height:'400px', width:'2px', backgroundColor:'grey' }} />
			{/* Sample Datapoint */}
			<div style={{position:'absolute', top: '5px', left: '5px', height: '5px', width: '5px', backgroundColor: 'blue'}} />
    </div>
  )
}
