import raf from 'raf'
import { initializer } from '../common/initializer.js'
import { htmlParser } from '../common/html-parser'
import { DEFAULTS, ELEMENT_TYPES, EVENTS } from '../common/constants'

interface TypedOptions {
  autoload?: boolean
}

/**
 * Welcome to Typed.js!
 * @param {string} elementId HTML element ID _OR_ HTML element
 * @param {object} options options object
 * @returns {object} a new Typed object
 */
class Typed {
  constructor(ref, options: TypedOptions = {}) {
    // Initialize it up
    // initializer.load(this, options, ref)
    if (typeof ref === 'string') {
      this.elements.container = document.querySelector(ref)
    } else {
      this.elements.container = ref
    }

    this.elements.container.appendChild(this.elements.wrapper)

    this.options = { ...this.options, ...options }

    if (options.autoload) {
      this.writeAll().start()
    }

    return this
  }

  state = {
    queue: [],
    historyQueue: [],
    eventLoop: null,
    eventLoopState: {
      paused: false,
      pauseUntil: null,
    },
    lastFrameTime: null,
    visibleElements: [],
  }

  options = {
    loop: false,
    strings: [],
    cadence: 'human',
  }

  elements = {
    container: null,
    wrapper: document.createElement('span'),
    cursor: document.createElement('span'),
  }

  start = () => {
    this.state.eventLoopState.paused = false
    this.runEventLoop()

    return this
  }

  pause = () => {
    this.state.eventLoopState.paused = true

    return this
  }

  stop = () => {
    if (this.state.eventLoop) {
      raf.cancel(this.state.eventLoop)
      this.state.eventLoop = null
    }

    return this
  }

  addToQueue = (name, options) => {
    this.state.queue.push({ name, options })
  }

  /**
   * @public
   */
  write = (string = '', options = {}) => {
    this.addToQueue(EVENTS.WRITE_CHARACTERS, {
      characters: string.split(''),
      ...options,
    })
    return this
  }

  writeAll = () => {
    for (let string of this.options.strings) {
      this.addToQueue(EVENTS.WRITE_CHARACTERS, { characters: string.split('') })
    }
    return this
  }

  wait = (milliseconds = 500) => {
    this.addToQueue('WAIT', { milliseconds })
    return this
  }

  erase = (count = null, options = {}) => {
    // If no count provided, fetch the length of the last string
    if (!count) {
      count = this.state.queue.find(e => e.name === EVENTS.WRITE_CHARACTERS)
        .options.characters.length
    }

    for (let i in Array(count).fill(null)) {
      this.addToQueue(EVENTS.ERASE_CHARACTER, options)
    }
    return this
  }

  runEventLoop = () => {
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
      ? this.delayRange(options.speed)
      : DEFAULTS.CADENCE[currentEvent.name]
    const delay = cadence ? this.rand(cadence) : 0

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

  delayRange(speed = 1) {
    const ms = speed * 100
    return [ms - 20, ms + 20]
  }

  rand(args: number[]) {
    const [max, min] = args
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

export default Typed
