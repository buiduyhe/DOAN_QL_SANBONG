import React from 'react'
import Navbar from '../../component/Navbar/Navbar'
import Stepper from './Stepper/Stepper'
import StepSelector from './StepSelector/StepSelector'
import SoDoSan from './SoDoSan/SoDoSan'
import Footer from '../../component/Footer/Footer'

const DatSan = () => {
  return (
    <div>
        <Navbar/>
        <Stepper/>
        <StepSelector/>
        <SoDoSan/>

        <Footer/>
    </div>
  )
}

export default DatSan