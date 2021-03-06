import React, { useEffect, useState } from 'react'
import ReactLoading from 'react-loading'

import { usePokemonContext } from '../../contexts/pokemon.context'

import './index.scss'
import PokeType from '../../components/poke-type'
import PokeStats from '../../components/poke-stats'
import PokeBadge from '../../components/poke-badge'

function PokeProfile ({ pokemon, diff, short = false, stats = false, weaknesses = false }) {
  const { loading } = usePokemonContext()
  const [poke, setPoke] = useState()

  useEffect(async () => {
    if (!pokemon) return
    setPoke(pokemon)
  }, [pokemon])

  return (
    loading ?
      <div className='poke-profile--skeleton'>
        <ReactLoading className='loading' type='bubbles' />
      </div>
      : <div className='poke-profile'>
          <div className='poke-profile__header'>
            <span className='poke-profile__header__name'>
              {poke?.formatedName}
              {!short && poke?.modifier && <PokeBadge type='text' badge={poke?.modifier} />}
              {!short && poke?.region && <PokeBadge type='text' badge={poke?.region} />}
            </span>
            <div className='poke-profile__header__types'>
              {
                poke?.modifier &&
                <PokeBadge type='image' badge={poke?.modifier} />
              }
              {
                poke?.region &&
                <PokeBadge type='image' badge={poke?.region} />
              }
              {poke?.types?.map((type, index) => (<PokeType key={index} type={type} />))}
            </div>
          </div>
          <div className='poke-profile__body'>
            <img alt={poke?.formatedName} src={poke?.avatar.any}/>
            <div className='poke-profile__body__measures'>
              <span>{(poke?.height * 0.32808).toFixed(1).replace('.0', '')}&quot;</span>
              <span>{Math.round(poke?.weight / 4.536)} lbs</span>
            </div>
            {stats && <PokeStats short={short} pokemonStats={poke?.stats} diffTo={diff?.stats} />}
          </div>
          {
            weaknesses &&
            <div className='poke-profile__footer'>
              <div className='poke-profile__footer__damage-table'>
                <span>weaknesses</span>
                <div className='poke-profile__footer__damage-table__elements'>
                  <div>
                    <small>x0</small>
                    <div className='elements'>
                      {poke?.effectiveness['0']?.map((element, index) => (
                        <img key={index} src={element.icon} alt={element.name} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <small>x0.25</small>
                    <div className='elements'>
                      {poke?.effectiveness['0.25']?.map((element, index) => (
                        <img key={index} src={element.icon} alt={element.name} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <small>x0.5</small>
                    <div className='elements'>
                      {poke?.effectiveness['0.5']?.map((element, index) => (
                        <img key={index} src={element.icon} alt={element.name} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <small>x2</small>
                    <div className='elements'>
                      {poke?.effectiveness['2']?.map((element, index) => (
                        <img key={index} src={element.icon} alt={element.name} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <small>x4</small>
                    <div className='elements'>
                      {poke?.effectiveness['4']?.map((element, index) => (
                        <img key={index} src={element.icon} alt={element.name} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
      </div>
  )
}

export default PokeProfile