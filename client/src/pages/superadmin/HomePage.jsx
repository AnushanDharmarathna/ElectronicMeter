import React, {useContext} from 'react'
import MqttConnection from '../../components/mqtt/MqttConnection'


const HomePage = ({ setDisplayContent }) => {

  const goToTesting = () => {
    setDisplayContent('Testing'); // This changes content without touching sidebar
  };

  return (
    <div className='pt-[70px] w-full h-full'>
      <h1 className="text-3xl font-bold">Welcome to Home</h1>
      <button
        onClick={goToTesting}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Open Testing Page (Hidden Navigation)
      </button>
      <MqttConnection/>
    </div>
  )
}

export default HomePage