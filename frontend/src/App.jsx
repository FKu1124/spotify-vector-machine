import './App.css'
import CoordinateSystem from './components/CoordinateSystem/CoordinateSystem'
import Navbar from './components/Navbar'
import Player from './components/Player/Player'
import Playlist from './components/Playlist/Playlist'
import PlaylistVector from './components/Playlist/PlaylistVector'
import CoordinateSystemHeader from './components/CoordinateSystem/CoordinateSystemHeader'

function App() {
  return (
    // <div className='App h-screen w-screen bg-white'>
    <div className='App w-screen bg-white'>
      <Navbar />
      <div className="content w-3/4 bg-gray-100 mx-auto my-4 p-4">
        <CoordinateSystemHeader />
        <CoordinateSystem squareWidth='800' />
      </div>
      <div className="content w-3/4 bg-gray-100 mx-auto flex flex-wrap">
        <div className="w-full flex-none">
          <PlaylistVector />
        </div>
        <div className="flex-auto w-full md:w-1/2">
          <Player />
        </div>
        <div className="flex-auto w-full md:w-1/2 border-l-2">
          <Playlist />
        </div>
      </div>
    </div>
  )
}

export default App;
