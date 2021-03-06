import React from 'react'
import { BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs'

import './index.scss'

function PokeNavigationSkeleton () {
  return (
    <div className='navigation__box skeleton'>
      <div className='navigation' style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--primary-color)',
        padding: '0 16px'
      }}>
        <div style={{ display: 'flex', alignSelf: 'center', gap: '8px' }}>
          <BsCaretLeftFill size={22} />
          <span style={{ width: '50px', height: '22px' }}></span>
        </div>

        <div style={{ display: 'flex', alignSelf: 'center' }}>
          <span style={{ width: '100px', height: '22px' }}></span>
        </div>

        <div style={{ display: 'flex', alignSelf: 'center', gap: '8px' }}>
          <span style={{ width: '50px', height: '22px' }}></span>
          <BsCaretRightFill size={22} />
        </div>
      </div>

    </div>
  )
}

export default PokeNavigationSkeleton