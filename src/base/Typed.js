import raf from 'raf'
import { initializer } from '../common/initializer.js'
import { htmlParser } from '../common/html-parser'
import { DEFAULTS, ELEMENT_TYPES, EVENTS } from '../common/constants'

/**
 * Welcome to Typed.js!
 * @param {string} elementId HTML element ID _OR_ HTML element
 * @param {object} options options object
 * @returns {object} a new Typed object
 */
class Typed {
  constructor(ref, options = {}) {
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
    this.state.eventLoopPaused = true

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
    this.state.queue.push({ eventName: name, eventArgs: options })
  }

  /**
   * @public
   */
  write = (string = '', options = {}) => {
    this.addToQueue(EVENTS.WRITE_CHARACTERS, { characters: string.split('') })
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

  erase = (count = null) => {
    // If no count provided, fetch the length of the last string
    if (!count) {
      count = this.state.queue.find(
        e => e.eventName === EVENTS.WRITE_CHARACTERS
      ).eventArgs.characters.length
    }

    for (let i in Array(count).fill(null)) {
      this.addToQueue(EVENTS.ERASE_CHARACTER)
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
      this.options = { ...this.state.options }
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

    let delay = 0

    // Check if frame should run or be
    // skipped based on fps interval
    if (
      currentEvent.eventName === EVENTS.ERASE_LAST_CHARACTER ||
      currentEvent.eventName === EVENTS.ERASE_CHARACTER
    ) {
      delay = this.rand(...DEFAULTS.CADENCE.ERASE)
    } else {
      delay = this.rand(...DEFAULTS.CADENCE.AFTER_WRITE)
    }

    if (delta <= delay) {
      return
    }

    const { eventName, eventArgs } = currentEvent

    switch (eventName) {
      case EVENTS.WRITE_CHARACTERS:
        const { characters, node } = eventArgs
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
            eventName: EVENTS.WRITE_CHARACTERS,
            eventArgs: { characters, node },
          })
        }

        break
      case EVENTS.WAIT:
        const { milliseconds } = eventArgs
        eventLoopState.pauseUntil = now + milliseconds * 1000

        break
      case EVENTS.ERASE_CHARACTER:
        if (visibleElements.length) {
          const { type, node } = visibleElements.pop()
          node.parentNode.removeChild(node)

          // Remove extra node as current deleted one is just an empty wrapper node
          if (type === ELEMENT_TYPES.HTML) {
            queue.unshift({
              eventName: EVENT_NAMES.ERASE_LAST_CHARACTER,
              eventArgs: {},
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
        currentEvent.eventName !== EVENT_NAMES.REMOVE_LAST_VISIBLE_NODE &&
        !(currentEvent.eventArgs && currentEvent.eventArgs.temp)
      ) {
        this.state.historyQueue = [...this.state.historyQueue, currentEvent]
      }
    }

    this.state.queue = queueCopy
    this.state.lastFrameTime = now
  }

  rand(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

export default Typed
