import raf from 'raf'
import { initializer } from '../common/initializer.js'
import { htmlParser } from '../common/html-parser'
import { DEFAULTS, ELEMENT_TYPES, EVENTS } from '../common/constants'
import { EventLoop } from './EventLoop'

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

    this.runEventLoop = EventLoop.bind(this)
    return this
  }

  runEventLoop = null

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
    html: true,
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
}

export default Typed
