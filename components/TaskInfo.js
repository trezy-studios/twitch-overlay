/* eslint-env node */

// Module imports
import React, {
  useEffect,
  useState,
} from 'react'





// Local imports
import getTrelloService from '../services/trello'





// Local constants
const trelloAPI = getTrelloService()





export const TaskInfo = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    (async () => {
      // Get all of the cards that are currently in progress
      const cardsResponse = await trelloAPI.get(`/lists/${process.env.TRELLO_LIST_ID}/cards`)
      const cards = cardsResponse.data.reduce((accumulator, card) => ({
        ...accumulator,
        [card.id]: {
          ...card,
          checklists: [],
          completion: 0,
        },
      }), {})

      // Get checklists for cards that have them
      const checklistResponses = await Promise.all(Object.values(cards).map(card => {
        if (card.idChecklists.length) {
          return card.idChecklists.map(checklistID => trelloAPI.get(`/checklists/${checklistID}`))
        }

        return null
      }).flat())

      // Attach checklist items to their respective cards
      checklistResponses.forEach(({ data: checklist }) => {
        const card = cards[checklist.idCard]

        card.checklists.push(checklist.checkItems)
      })

      Object.keys(cards).forEach(cardID => {
        const card = cards[cardID]

        if (card.checklists.length) {
          const allItems = card.checklists.flat()
          const completedItems = allItems.filter(({ state }) => (state === 'complete'))

          card.completion = (completedItems.length / allItems.length)
        }
      })

      setTasks(Object.values(cards))
      setIsLoading(false)
    })()
  }, [])

  return (
    <div className="task-info">
      {isLoading && 'Loading...'}

      {!isLoading && (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              {`${task.name} — ${Math.floor(task.completion * 100)}%`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
