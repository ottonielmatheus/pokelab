import React from 'react'

function PokeEvolutionsSkeleton() {
  return (
    <div className='skeleton' style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ width: '84px', height: '20px', backgroundColor: '#2c2c2c' }}></div>
      <div style={{ display: 'flex', gap: '64px', padding: '8px 24px' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#2c2c2c' }}></div>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#2c2c2c' }}></div>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#2c2c2c' }}></div>
      </div>
    </div>
  )
}

export default PokeEvolutionsSkeleton
