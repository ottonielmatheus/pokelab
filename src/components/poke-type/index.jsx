import React, { useEffect, useState } from 'react'
import Tippy from '@tippyjs/react'
import _ from 'lodash'

import 'tippy.js/dist/tippy.css'
import './index.scss'
import { formatType } from '../../core/pokemon.utils'


function PokeType ({ type }) {
  const [pokemonType, setPokemonType] = useState()

  useEffect(async () => {
    if ('icon' in type) {
      setPokemonType(type)
    } else {
      setPokemonType(await formatType(type))
    }
  }, [type])

  return (
    <Tippy
      className={`tippy-tooltip-type ${pokemonType?.name}-theme`}
      arrow={false}
      content={
        <div>
          <span>{_.capitalize(pokemonType?.name)}</span>
        </div>
      }
      >
      <img width={28} height={28} src={pokemonType?.icon} alt={pokemonType?.name} />
    </Tippy>
  )
}

export default PokeType
