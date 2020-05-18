import * as raf from 'raf'
import { DEFAULTS, ELEMENT_TYPES, TASKS, SUBTASKS } from '../common/constants'

export function EventLoop() {
  const delayRange = (speed = 1) => {
    const ms = speed * 100
    return [ms - 20, ms + 20]
  }

  const rand = (args: number[]) => {
    const [max, min] = args
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  if (this.state._tasks.length === 0) {
    this.state._tasks = [...this.state.tasks]
  }

  if (!this.state.lastFrameAt) {
    this.state.lastFrameAt = Date.now()
  }

  const now = Date.now()
  const delta = now - this.state.lastFrameAt

  if (this.state.taskOffset === this.state.tasks.length) {
    if (!this.globalOptions.loop) {
      return
    }

    this.state.taskOffset = 0
    // Reset task queue if we are looping
    this.state.tasks = [...this.state._tasks]
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

  const currentTask = this.state.tasks[this.state.taskOffset]
  const { name, options = {} } = currentTask
  const { node, parentNode } = options

  // Check if frame should run or be
  // skipped based on fps interval
  const cadence = options.speed ? delayRange(options.speed) : DEFAULTS.CADENCE[name]
  const delay = cadence ? rand(cadence) : 0

  if (delta <= delay) {
    return
  }

  switch (name) {
    case TASKS.WRITE_CHARACTER:
      const textNode = document.createTextNode(node)

      if (parentNode) {
        parentNode.appendChild(textNode)
      } else {
        this.elements.wrapper.appendChild(textNode)
      }

      this.state.visibleElements.push({
        type: ELEMENT_TYPES.TEXT,
        node: textNode,
        parentNode: parentNode,
      })

      break

    case TASKS.WRITE_HTML_NODE:
      if (parentNode) {
        parentNode.appendChild(node)
      } else {
        this.elements.wrapper.appendChild(node)
      }

      this.state.visibleElements.push({
        type: ELEMENT_TYPES.HTML,
        node: node,
        parentNode: parentNode,
      })

      break
    case TASKS.ERASE_CHARACTER:
      if (this.state.visibleElements.length) {
        const { type, node, parentNode } = this.state.visibleElements.pop()

        if (parentNode) {
          parentNode.removeChild(node)
        } else {
          node.parentNode.removeChild(node)
        }

        // Remove extra node as current deleted one is just an empty wrapper node
        // if (type === ELEMENT_TYPES.HTML) {
        //   this.state.queue.splice(this.state.taskOffset + 1, 0, {
        //     name: TASKS.ERASE_CHARACTER,
        //     ...options,
        //     parentNode,
        //   })
        // }
      }

      break
    case TASKS.ERASE_CHARACTERS:
      const count = this.state.visibleElements.length

      for (let _i in Array(count || 0).fill(null)) {
        this.state.tasks.splice(this.state.taskOffset + 1, 0, {
          name: TASKS.ERASE_CHARACTER,
        })
      }
      break
    case TASKS.PAUSE:
      const { milliseconds } = options
      this.state.pauseUntil = now + milliseconds * 1000

      break
  }

  this.state.taskOffset += 1
  this.state.lastFrameAt = now
}

export function stopEventLoop() {
  if (this.state.eventLoop) {
    raf.cancel(this.state.eventLoop)
    this.state.eventLoop = null
  }
}
