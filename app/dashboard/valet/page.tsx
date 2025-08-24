import React from 'react'
import RightPanel from './components/pages/Rightpanel'
import Valet_Parking from './components/pages/Valetparking'
import ValetThemeReset from './components/ValetThemeReset'

const page = () => {
  return (
    <ValetThemeReset>
      <div className="flex sm:flex-col md:flex-row p-5">
        <Valet_Parking />
        <RightPanel />
      </div>
    </ValetThemeReset>
  )
}

export default page
