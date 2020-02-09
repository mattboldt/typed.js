import { initializer } from '../common/initializer.js'
import { htmlParser } from '../common/html-parser'
import { DEFAULTS, ELEMENT_TYPES, EVENTS } from '../common/constants'
import { EventLoop, stopEventLoop } from './EventLoop'

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
  runEventLoop = null

  state = {
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

  public start() {
    this.state.pause = false
    this.runEventLoop()

    return this
  }

  public pause() {
    this.state.pause = true

    return this
  }

  public stop = () => {
    stopEventLoop()

    return this
  }

  /**
   * @public
   */
  public write(string = '', options = {}) {
    if (this.shouldRenderHTML(string, options)) {
      this.writeHTML(string, options)
    } else {
      this.writeText(string, options)
    }
    return this
  }

  public writeAll() {
    this.globalOptions.strings.forEach((string, index, strings) => {
      this.write(string)

      if (index + 1 < strings.length) {
        this.wait(1)
        this.erase(string.length)
      }
    })

    return this
  }

  public wait(milliseconds = 500) {
    this.dispatch('WAIT', { milliseconds })
    return this
  }

  public erase(count = null, options = {}) {
    // If no count provided, fetch the length of the last string
    if (!count) {
      const previous = [...this.state.queue]
        .reverse()
        .find(e => e.name === EVENTS.WRITE_CHARACTERS)
      if (previous) {
        count = previous.options.nodeList.length
      }
    }

    for (let _i in Array(count || 0).fill(null)) {
      this.dispatch(EVENTS.ERASE_CHARACTER, options)
    }
    return this
  }

  private setupDOM($el) {
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

  private writeText(string, options) {
    this.dispatch(EVENTS.WRITE_CHARACTERS, {
      nodeList: string.split(''),
      ...options,
    })
  }

  private writeHTML(string, options) {
    const nodeList = this.parseHTML(string)

    for (let node of nodeList) {
      if (node && node.nodeName !== '#text') {
        // Attach empty node but save raw content
        const string = node.innerHTML
        node.innerHTML = ''

        this.dispatch(EVENTS.WRITE_HTML, { ...options, nodeList: node })
        this.write(string, { parentNode: node })
      } else if (node.textContent) {
        this.write(node.textContent, { options })
      }
    }
  }

  private shouldRenderHTML(string, options) {
    if (options.html && options.html === false) {
      return string
    }

    const simpleHTMLRegex = /<[a-z][\s\S]*>/i
    return simpleHTMLRegex.test(string)
  }

  private parseHTML(string): any[] {
    const el = document.createElement('div')
    el.innerHTML = string

    if (el.childElementCount > 0) {
      return Array.from(el.childNodes)
    } else {
      return []
    }
  }

  private dispatch(name, options) {
    this.state.queue.push({ name, options })
  }
}

export default Typed
