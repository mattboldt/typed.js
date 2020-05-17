import * as raf from 'raf'
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

  const iterateChildNode = length => {
    if (this.state.childOffset === length - 1) {
      this.state.childOffset = 0
      this.state.parentOffset += 1
    } else {
      this.state.childOffset += 1
    }
  }

  if (!this.state.lastFrameAt) {
    this.state.lastFrameAt = Date.now()
  }

  const now = Date.now()
  const delta = now - this.state.lastFrameAt

  if (this.state.parentOffset === this.state.queue.length) {
    if (!this.globalOptions.loop) {
      return
    }

    // Reset event queue if we are looping
    this.state.parentOffset = 0
    this.state.childOffset = 0
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

  const currentJob = this.state.queue[this.state.parentOffset]
  const { name, options = {} } = currentJob
  const { nodeList, parentNode } = options
  let currentNode

  // Check if frame should run or be
  // skipped based on fps interval
  const cadence = options.speed ? delayRange(options.speed) : DEFAULTS.CADENCE[name]
  const delay = cadence ? rand(cadence) : 0

  if (delta <= delay) {
    return
  }

  switch (name) {
    case EVENTS.WRITE_CHARACTERS:
      currentNode = nodeList[this.state.childOffset]
      const textNode = document.createTextNode(currentNode)

      if (parentNode) {
        parentNode.appendChild(textNode)
      } else {
        this.elements.wrapper.appendChild(textNode)
      }

      this.state.visibleElements.push({
        type: ELEMENT_TYPES.TEXT,
        node: textNode,
      })
      iterateChildNode(nodeList.length)
      break

    case EVENTS.WRITE_HTML:
      currentNode = nodeList[this.state.childOffset]
      if (parentNode) {
        parentNode.appendChild(currentNode)
      } else {
        this.elements.wrapper.appendChild(currentNode)
      }

      this.state.visibleElements.push({
        type: ELEMENT_TYPES.HTML,
        node: currentNode,
        parentNode: parentNode,
      })
      iterateChildNode(nodeList.length)
      break

    case EVENTS.WAIT:
      const { milliseconds } = options
      this.state.pauseUntil = now + milliseconds * 1000
      this.state.parentOffset += 1

      break

    case EVENTS.ERASE_CHARACTERS:
      if (this.state.visibleElements.length) {
        const { type, node, parentNode } = this.state.visibleElements.pop()

        // if (parentNode) {
        //   debugger
        //   parentNode.parentNode.removeChild(parentNode)
        // }
        node.parentNode.removeChild(node)
        // Remove extra node as current deleted one is just an empty wrapper node
        // if (type === ELEMENT_TYPES.HTML) {
        //   this.state.queue.unshift({
        //     name: EVENTS.ERASE_CHARACTER,
        //     ...options,
        //     parentNode,
        //   })
        // }
        console.log(options.count)
        iterateChildNode(options.count)
      }

      break
  }

  // Add queue item to called queue if we are looping
  if (this.globalOptions.loop) {
    if (
      currentJob.eventName !== EVENTS.ERASE_CHARACTER &&
      !(currentJob.options && currentJob.options.temp)
    ) {
      this.state.historyQueue.push(currentJob)
    }
  }

  this.state.lastFrameAt = now
}

export function stopEventLoop() {
  if (this.state.eventLoop) {
    raf.cancel(this.state.eventLoop)
    this.state.eventLoop = null
  }
}
