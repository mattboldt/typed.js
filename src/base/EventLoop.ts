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

  if (!this.state.lastFrameAt) {
    this.state.lastFrameAt = Date.now()
  }

  const now = Date.now()
  const delta = now - this.state.lastFrameAt

  if (this.state.queue.length === 0) {
    if (!this.globalOptions.loop) {
      return
    }

    // Reset event queue if we are looping
    this.state.queue = [...this.state.historyQueue]
    this.state.historyQueue = []
    this.globalOptions = { ...this.initialGlobalOptions }
  }

  this.state.eventLoop = raf(this.runEventLoop)

  if (this.state.pause) {
    return
  }

  if (this.state.pauseUntil) {
    if (now < this.state.pauseUntil) {
      return
    }
    // Reset pause time
    this.state.pauseUntil = null
  }

  const queueCopy = [...this.state.queue]
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
      const { nodes, parentNode } = options
      const textNode = document.createTextNode(nodes.shift())

      if (parentNode) {
        parentNode.appendChild(textNode)
      } else {
        this.elements.wrapper.appendChild(textNode)
      }

      this.state.visibleElements.push({
        type: ELEMENT_TYPES.TEXT,
        node: textNode,
      })

      // If another char exists, add it back to the top of the queue
      if (nodes.length > 0) {
        queueCopy.unshift({
          name: EVENTS.WRITE_CHARACTERS,
          options: { ...options, nodes },
        })
      }
      break

    case EVENTS.WRITE_HTML:
      const { fragment } = options
      const htmlNodes = fragment.childNodes.values()

      for (let node of htmlNodes) {
        if (node && node.nodeName !== '#text') {
          // Attach empty node but save raw content
          const string = node.innerHTML
          node.innerHTML = ''
          this.elements.wrapper.appendChild(node)

          this.write(string, { node })
        } else if (node.textContent) {
          this.write(node.textContent)
        }
      }
      break

    case EVENTS.WAIT:
      const { milliseconds } = options
      this.state.pauseUntil = now + milliseconds * 1000

      break

    case EVENTS.ERASE_CHARACTER:
      if (this.state.visibleElements.length) {
        const { type, node } = this.state.visibleElements.pop()
        node.parentNode.removeChild(node)

        // Remove extra node as current deleted one is just an empty wrapper node
        if (type === ELEMENT_TYPES.HTML) {
          queueCopy.unshift({
            name: EVENTS.ERASE_CHARACTER,
            ...options,
          })
        }
      }

      break
  }

  // Add que item to called queue if we are looping
  if (this.globalOptions.loop) {
    if (
      currentEvent.eventName !== EVENTS.ERASE_CHARACTER &&
      !(currentEvent.options && currentEvent.options.temp)
    ) {
      this.state.historyQueue = [...this.state.historyQueue, currentEvent]
    }
  }

  this.state.queue = queueCopy
  this.state.lastFrameAt = now
}
