const API_URL = 'https://pokeapi.co/api/v2/'
import {
  formatAbility,
  formatEvolution,
  formatItem,
  formatMove,
  formatPokemon,
  formatSpecies
} from './../pokemon.utils'

const querify = (limit, skip) => {
  const queries = []

  if (skip) queries.push('skip=' + skip)
  if (limit) queries.push('limit=' + limit)

  return '?' + queries.join('&')
}

const request = async uri => {
  if (!uri) return null
  const res = await fetch(uri)
  return await res.json()
}

const formatWith = (formatterFunction, requestFunctions) => {
  const requests = {}
  for (const requestKey of Object.keys(requestFunctions)) {
    requests[requestKey] = async (...args) => {
      const resource = await requestFunctions[requestKey](...args)
      return await formatterFunction(resource)
    }
  }
  return requests
}

const getAll = async ({ skip, limit, next }) => {
  const uri = next || API_URL + 'pokemon' + querify(limit, skip)
  return await request(uri)
}

const getById = async (id) => {
  return await request(API_URL + `pokemon/${id}`)
}

const getPokemonByName = async (name) => {
  if (!name) return null
  return await request(API_URL + `pokemon/${name}`)
}

const getAbilityByName = async (name) => {
  return await request(API_URL + `ability/${name}`)
}

const getMoveByName = async (name) => {
  return await request(API_URL + `move/${name}`)
}

export default {
  pokemons: {
    getAll,
    getPokemonsPage: request,
    ...formatWith(formatPokemon, {
      getById,
      getByName: getPokemonByName,
      getByUrl: request
    })
  },
  abilities: formatWith(formatAbility, {
    getByName: getAbilityByName
  }),
  moves: formatWith(formatMove, {
    getByName: getMoveByName
  }),
  species: formatWith(formatSpecies, {
    getByUrl: request
  }),
  evolution: formatWith(formatEvolution, {
    getByUrl: request
  }),
  items: formatWith(formatItem, {
    getByUrl: request
  })
}