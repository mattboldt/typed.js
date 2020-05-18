import { initializer } from '../common/initializer.js'
import { htmlParser } from '../common/html-parser'
import { DEFAULTS, ELEMENT_TYPES, EVENTS, TASKS } from '../common/constants'
import { EventLoop, stopEventLoop } from './EventLoop'

interface TypedOptions {
  autoload?: boolean
  cursor?: string
  cursorClassName?: string
  wrapperClassName?: string
  loop?: boolean
  strings?: string[]
  cadence?: string
  html?: boolean
}

/**
 * Welcome to Typed.js!
 * @param {string} elementId HTML element ID _OR_ HTML element
 * @param {object} options options object
 * @returns {object} a new Typed object
 */
class Typed {
  runEventLoop = null

  state = {
    taskOffset: 0,
    tasks: [],
    _tasks: [],
    queue: [],
    historyQueue: [],
    eventLoop: null,
    pause: false,
    pauseUntil: null,
    lastFrameAt: null,
    visibleElements: [],
  }

  globalOptions = {
    cursor: '|',
    cursorClassName: 'TypedJS_cursor',
    wrapperClassName: 'TypedJS_wrapper',
    loop: false,
    strings: [],
    cadence: 'human',
    html: true,
    autoload: false,
  }

  elements = {
    container: null,
    wrapper: document.createElement('span'),
    cursor: document.createElement('span'),
  }

  initialGlobalOptions = null

  constructor($el, options: TypedOptions = {}) {
    this.globalOptions = { ...this.globalOptions, ...options }
    this.initialGlobalOptions = { ...this.globalOptions }
    this.runEventLoop = EventLoop.bind(this)
    this.setupDOM($el)

    if (this.globalOptions.autoload) {
      this.writeAll().start()
    }

    return this
  }

  public start = () => {
    this.state.pause = false
    this.runEventLoop()

    window.state = this.state

    return this
  }

  public pause = () => {
    this.state.pause = true

    return this
  }

  public stop = () => {
    stopEventLoop()

    return this
  }

  public writeAll = () => {
    this.globalOptions.strings.forEach((string, index, strings) => {
      this.write(string)

      if (index + 1 < strings.length) {
        this.wait(1)
        this.erase(string.length)
      }
    })

    return this
  }

  /**
   * @public
   */
  public write = (node = '', options = {}) => {
    this.writeDispatcher(node, options)
    return this
  }

  public wait = (milliseconds = DEFAULTS.WAIT) => {
    this.dispatch(TASKS.PAUSE, { milliseconds })
    return this
  }

  public erase = (count = null) => {
    this.dispatch(TASKS.ERASE_CHARACTER, { count })
    return this
  }

  private writeDispatcher = (node, options = {}) => {
    if (this.shouldRenderHTML(node, options)) {
      this.dispatch(TASKS.WRITE_HTML_NODE, { ...options, node })
    } else {
      const chars = node.split('')

      chars.forEach(char => {
        this.dispatch(TASKS.WRITE_CHARACTER, { ...options, node: char })
      })
    }
  }

  private dispatch = (name, options: any = {}) => {
    switch (name) {
      case TASKS.WRITE_CHARACTER:
        this.state.tasks.push({ name, options })
        break
      case TASKS.ERASE_CHARACTER:
        if (options.count) {
          for (let _i in Array(options.count || 0).fill(null)) {
            this.state.tasks.push({ name })
          }
        } else {
          this.state.tasks.push({ name: TASKS.ERASE_CHARACTERS })
        }
        break
      case TASKS.PAUSE:
        this.state.tasks.push({ name, options })
        break
      case TASKS.WRITE_HTML_NODE:
        const nodeList = this.parseHTML(options.node)

        nodeList.forEach(node => {
          if (node && node.nodeName !== '#text') {
            // Attach empty node but save raw content
            const string = node.innerHTML
            node.innerHTML = ''

            // Add HTML node task to queue
            this.state.tasks.push({ name, options: { ...options, node } })

            // Enqueue the rest of the string regularly
            this.writeDispatcher(string, { parentNode: node })
          } else if (node.textContent) {
            this.writeDispatcher(node.textContent)
          }
        })
        break
    }
  }

  private shouldRenderHTML = (node, options) => {
    if (options.html && options.html === false) {
      return node
    }

    const simpleHTMLRegex = /<[a-z][\s\S]*>/i
    return simpleHTMLRegex.test(node)
  }

  private parseHTML = (string): any[] => {
    const el = document.createElement('div')
    el.innerHTML = string

    if (el.childElementCount > 0) {
      return Array.from(el.childNodes)
    } else {
      return []
    }
  }

  private setupDOM = $el => {
    if (typeof $el === 'string') {
      this.elements.container = document.querySelector($el)
    } else {
      this.elements.container = $el
    }

    this.elements.wrapper.className = this.globalOptions.wrapperClassName
    this.elements.cursor.className = this.globalOptions.cursorClassName

    this.elements.cursor.innerHTML = this.globalOptions.cursor
    this.elements.container.innerHTML = ''

    this.elements.container.appendChild(this.elements.wrapper)
    this.elements.container.appendChild(this.elements.cursor)
  }
}

export default Typed
