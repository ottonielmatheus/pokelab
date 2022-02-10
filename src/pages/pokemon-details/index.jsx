import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import ReactLoading from 'react-loading'
import _ from 'lodash'

import './index.scss'
import PokeMoves from './../../components/poke-moves'
import PokeMovesSkeleton from './../../components/poke-moves/skeleton'
import PokeAbilities from '../../components/poke-abilities'
import PokeEvolutions from '../../components/poke-evolutions'
import PokeEvolutionsSkeleton from '../../components/poke-evolutions/skeleton'
import PokeType from '../../components/poke-type'
import PercentageBar from '../../components/shared/percentage-bar'

import pokemonApi from '../../core/apis/pokemon.api'
import pokemonUtils from '../../core/pokemon.utils'

function PokemonDetails () {
  const navigate = useNavigate()
  const { pokemonName } = useParams()

  const [loading, setLoading] = useState(true)
  const [pokemon, setPokemon] = useState()
  const [nextPokemon, setNextPokemon] = useState()
  const [previousPokemon, setPreviousPokemon] = useState()

  useEffect(async () => {
    await currentPokemon(pokemonName)
  }, [pokemonName])

  const currentPokemon = async (pokeName) => {
    setLoading(true)

    const poke = await pokemonApi.pokemons.getByName(pokeName)
    if (!poke) {
      goNotFound()
    }

    const nextPoke = await pokemonApi.pokemons.getById(poke.id + 1)
    const previousPoke = await pokemonApi.pokemons.getById(poke.id - 1)

    setNextPokemon(nextPoke)
    setPreviousPokemon(previousPoke)

    const { formatedName, genre, modifier, region } = pokemonUtils.formatName(poke.name)
    poke.formatedName = formatedName
    poke.genre = genre
    poke.modifier = modifier
    poke.region = region

    poke.types = await pokemonUtils.formatTypes(poke.types)

    const { weakness, resistance, immune } = await pokemonUtils.getWeaknessAndResistance(poke.types)
    poke.weakness = weakness
    poke.resistance = resistance
    poke.immune = immune

    poke.moves = _.sortBy(poke.moves, [item => item.move.name])
    poke.abilities = _.sortBy(poke.abilities, [item => item.ability.name])

    poke.effectiveness = pokemonUtils.getEffectiveness(poke.weakness, poke.resistance, poke.immune)

    poke.species = await pokemonApi.species.getByName(poke.species.name)
    poke.evolutions = await pokemonApi.evolution.getByUrl(poke.species.evolution_chain.url)
    poke.evolutions = await pokemonUtils.formatEvolutions(poke.evolutions.chain)

    poke.stats = {
      hp: pokemonUtils.getStatsValue(poke.stats, 'hp'),
      attack: pokemonUtils.getStatsValue(poke.stats, 'attack'),
      specialAttack: pokemonUtils.getStatsValue(poke.stats, 'special-attack'),
      defense: pokemonUtils.getStatsValue(poke.stats, 'defense'),
      specialDefense: pokemonUtils.getStatsValue(poke.stats, 'special-defense'),
      speed: pokemonUtils.getStatsValue(poke.stats, 'speed')
    }

    setPokemon(poke)
    setLoading(false)
  }

  const goNextPokemon = async () => {
    navigate(`/pokemons/${nextPokemon.name}`)
    await currentPokemon(nextPokemon.name)
  }

  const goPreviousPokemon = async () => {
    navigate(`/pokemons/${previousPokemon.name}`)
    await currentPokemon(previousPokemon.name)
  }

  const goNotFound = async () => {
    navigate(`/not-found`)
  }

  return (
    <section id="pokemon-details">
      <div className='navigation'>
        {
          previousPokemon &&
          <div className='navigation__previous' onClick={async() => await goPreviousPokemon()}>
            <BsArrowLeft size={22} />
              <span className='pokemon-name'>{_.capitalize(previousPokemon?.name)}</span>
              <span>#{previousPokemon?.id}</span>
          </div>
        }
        <div className='navigation__current'>
          <span className='pokemon-name'>{_.capitalize(pokemonName)}</span>
          <span>#{pokemon?.id}</span>
        </div>
        {
          nextPokemon &&
          <div className='navigation__next' onClick={async() => await goNextPokemon()}>
            <span className='pokemon-name'>{_.capitalize(nextPokemon?.name)}</span>
            <span>#{nextPokemon?.id}</span>
            <BsArrowRight size={22} />
          </div>
        }
      </div>
      <div className='pokemon'>
        {
          loading ?
          <div className='pokemon__profile--skeleton'>
            <ReactLoading type='bubbles' color='#2e2e2e' />
          </div> :
          <div className='pokemon__profile'>
            <div className='pokemon__profile__header'>
              {pokemon.formatedName}
              <div className='pokemon__profile__header__types'>
                {pokemon?.types?.map((type, index) => (<PokeType key={index} type={type} />))}
              </div>
            </div>
            <div className='pokemon__profile__body'>
              <div className='pokemon__profile__body__variations'>
                {pokemon?.modifier &&
                  <div className='pokemon__profile__body__variations__modifier'
                    style={{
                      backgroundImage: {
                        gmax: 'linear-gradient(315deg, #d99058 0%, #f8de7e 74%)',
                        mega: 'linear-gradient(315deg, #b3cdd1 0%, #9fa4c4 74%)',
                        'mega-x': 'linear-gradient(315deg, #b3cdd1 0%, #9fa4c4 74%)',
                        'mega-y': 'linear-gradient(315deg, #b3cdd1 0%, #9fa4c4 74%)',
                        'eternamax': 'linear-gradient(315deg, #0cbaba 0%, #380036 74%)'
                      }[pokemon.modifier]
                    }}>
                    {pokemon.modifier?.toUpperCase()}
                  </div>
                }
                {pokemon?.region &&
                  <div className='pokemon__profile__body__variations__region'
                    style={{
                      backgroundImage: {
                        alola: 'linear-gradient(90deg, rgba(108,9,121,1) 0%, rgba(255,222,0,1) 100%)',
                        galar: 'linear-gradient(90deg, rgba(20,9,121,1) 0%, rgba(255,0,44,1) 100%)'
                      }[pokemon.region]
                    }}>
                    {pokemon.region?.toUpperCase()}
                  </div>
                }
              </div>
              <img src={pokemon?.sprites?.other['official-artwork']?.front_default} alt={pokemon.formatedName} />
              <div className='pokemon__profile__body__measures'>
                  <span>{pokemon.height}&quot;</span>
                  <span>{pokemon.weight} lbs</span>
              </div>
              <div className='pokemon__profile__body__stats'>
                <div className='hp'>
                  <span>HP</span>
                  <PercentageBar className='pokemon__profile__body__stats__bar' color='#5f9747' value={pokemon?.stats.hp.basePercentage} />
                  <span>{pokemon?.stats.hp.baseValue}</span>
                </div>
                <div className='attack'>
                  <span>Attack</span>
                  <PercentageBar className='pokemon__profile__body__stats__bar' color='#f44336' value={pokemon?.stats.attack.basePercentage} />
                  <span>{pokemon?.stats.attack.baseValue}</span>
                </div>
                <div className='special-attack'>
                  <span>Spc attack</span>
                  <PercentageBar className='pokemon__profile__body__stats__bar' color='#aa2e25' value={pokemon?.stats.specialAttack.basePercentage} />
                  <span>{pokemon?.stats.specialAttack.baseValue}</span>
                </div>
                <div className='defense'>
                  <span>Defense</span>
                  <PercentageBar className='pokemon__profile__body__stats__bar' color='skyblue' value={pokemon?.stats.defense.basePercentage} />
                  <span>{pokemon?.stats.defense.baseValue}</span>
                </div>
                <div className='special-defense'>
                  <span>Spc defense</span>
                  <PercentageBar className='pokemon__profile__body__stats__bar' color='#436775' value={pokemon?.stats.specialDefense.basePercentage} />
                  <span>{pokemon?.stats.specialDefense.baseValue}</span>
                </div>
                <div className='speed'>
                  <span>Speed</span>
                  <PercentageBar className='pokemon__profile__body__stats__bar' color='#e69138' value={pokemon?.stats.speed.basePercentage} />
                  <span>{pokemon?.stats.speed.baseValue}</span>
                </div>
              </div>
            </div>
            <div className='pokemon__profile__footer'>
              <div className='pokemon__profile__footer__damage-table'>
                <span>damage received</span>
                <div className='pokemon__profile__footer__damage-table__elements'>
                  <div>
                    <small>x0</small>
                    <div className='elements'>
                      {pokemon?.effectiveness['0']?.map((element, index) => (
                        <img key={index} src={element.icon} alt={element.name} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <small>x0.25</small>
                    <div className='elements'>
                      {pokemon?.effectiveness['0.25']?.map((element, index) => (
                        <img key={index} src={element.icon} alt={element.name} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <small>x0.5</small>
                    <div className='elements'>
                      {pokemon?.effectiveness['0.5']?.map((element, index) => (
                        <img key={index} src={element.icon} alt={element.name} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <small>x2</small>
                    <div className='elements'>
                      {pokemon?.effectiveness['2']?.map((element, index) => (
                        <img key={index} src={element.icon} alt={element.name} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <small>x4</small>
                    <div className='elements'>
                      {pokemon?.effectiveness['4']?.map((element, index) => (
                        <img key={index} src={element.icon} alt={element.name} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        <div className='pokemon__info'>
          {
            pokemon?.evolutions &&
            (loading ? <PokeEvolutionsSkeleton />
              : <PokeEvolutions pokemon={pokemon} pokemonEvolutions={pokemon?.evolutions} />)
          }
          {
            (pokemon?.abilities?.length > 0) &&
            (loading ? <PokeMovesSkeleton /> : <PokeAbilities pokemonAbilities={pokemon?.abilities} />)
          }
          {
            (pokemon?.moves?.length > 0) &&
            (loading ? <PokeMovesSkeleton /> : <PokeMoves pokemonMoves={pokemon?.moves} />)
          }
        </div>
      </div>
    </section>
  )
}

export default PokemonDetails