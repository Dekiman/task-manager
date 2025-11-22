import React from 'react'
import MyTasks from '../components/MyTasks.jsx'


function Home() {

  return (
    <div className='max-h-full grid grid-rows-2 p-2'>
      <div className=''>
        <MyTasks />
      </div>
    </div>
  )
}

export default Home