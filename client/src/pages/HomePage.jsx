import React from 'react'
import MqttConnection from '../components/mqtt/MqttConnection'

const HomePage = () => {
  return (
    <div className='pt-[70px] w-full h-full'>
        <MqttConnection/>
    </div>
  )
}

export default HomePage