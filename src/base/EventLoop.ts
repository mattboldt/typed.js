import raf from 'raf'
import { DEFAULTS, ELEMENT_TYPES, EVENTS } from '../common/constants'

export function EventLoop() {
  const delayRange = (speed = 1) => {
    const ms = speed * 100
    return [ms - 20, ms + 20]
  }

  const rand = (args: number[]) => {
    const [max, min] = args
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const { queue, eventLoopState, lastFrameTime, visibleElements } = this.state
  if (!lastFrameTime) {
    this.state.lastFrameTime = Date.now()
  }

  const now = Date.now()
  const delta = now - this.state.lastFrameTime

  if (!queue.length) {
    if (!this.options.loop) {
      return
    }

    // Reset event queue if we are looping
    this.state.queue = [...this.state.historyQueue]
    this.state.historyQueue = []
    // this.options = { ...this.state.options }
  }

  this.state.eventLoop = raf(this.runEventLoop)

  if (eventLoopState.paused) {
    return
  }

  if (eventLoopState.pauseUntil) {
    if (now < eventLoopState.pauseUntil) {
      return
    }

    // Reset pause time
    eventLoopState.pauseUntil = null
  }

  const queueCopy = [...queue]
  const currentEvent = queueCopy.shift()
  const { name, options } = currentEvent

  // Check if frame should run or be
  // skipped based on fps interval
  const cadence = options.speed
    ? delayRange(options.speed)
    : DEFAULTS.CADENCE[name]
  const delay = cadence ? rand(cadence) : 0

  if (delta <= delay) {
    return
  }

  switch (name) {
    case EVENTS.WRITE_CHARACTERS:
      const { characters, node } = options
      const textNode = document.createTextNode(characters.shift())

      if (node) {
        node.appendChild(textNode)
      } else {
        this.elements.wrapper.appendChild(textNode)
      }

      visibleElements.push({
        type: ELEMENT_TYPES.TEXT,
        node: textNode,
      })

      // If another char exists, add it back to the top of the queue
      if (characters.length) {
        queueCopy.unshift({
          name: EVENTS.WRITE_CHARACTERS,
          options: { ...options, characters },
        })
      }

      break
    case EVENTS.WAIT:
      const { milliseconds } = options
      eventLoopState.pauseUntil = now + milliseconds * 1000

      break
    case EVENTS.ERASE_CHARACTER:
      if (visibleElements.length) {
        const { type, node } = visibleElements.pop()
        node.parentNode.removeChild(node)

        // Remove extra node as current deleted one is just an empty wrapper node
        if (type === ELEMENT_TYPES.HTML) {
          queue.unshift({
            name: EVENTS.ERASE_LAST_CHARACTER,
            options: {},
          })
        }
      }
      break
    default:
      break
  }

  // Add que item to called queue if we are looping
  if (this.options.loop) {
    if (
      currentEvent.eventName !== EVENTS.REMOVE_LAST_VISIBLE_NODE &&
      !(currentEvent.options && currentEvent.options.temp)
    ) {
      this.state.historyQueue = [...this.state.historyQueue, currentEvent]
    }
  }

  this.state.queue = queueCopy
  this.state.lastFrameTime = now
}
