
/**
 * Humanize typing
 */

export default class Humanizer {
  /**
   * Initialize humnanizer with its related options
   * @param {object} options options of Typed initializer
   */
  constructor({ humanizeTyping, humanizeBacking, humanizerRandomizeFactor, humanizeronlySlower, typeSpeed, backSpeed }) {
    // speeds
    this.typeSpeed = typeSpeed;
    this.backSpeed = backSpeed;

    // options
    this.doHumanizeTyping = humanizeTyping;
    this.doHumanizeBacking = humanizeBacking;
    this.randomizeFactor = humanizerRandomizeFactor;
    this.onlySlower = humanizeronlySlower;
  }

  /**
   * Humanize typing
   */

  humanizeTyping() {
    console.log("==")
    console.log(this.doHumanizeTyping)
    console.log(this.typeSpeed)
    console.log(this.humanize(this.typeSpeed));
    console.log("==--==")
    if (!this.doHumanizeTyping) return this.typeSpeed;
    return this.humanize(this.typeSpeed);
  }

  /**
   * Humanize backing
   */

  humanizeBacking() {
    if (!this.doHumanizeBacking) return this.backSpeed;
    return this.humanize(this.backSpeed);
  }

  /**
   * humanize any speed in MS
   * @param {number} speed speed to humanize
   * @private
   */

  humanize(speed) {
    let modulation = Math.random() * speed
    modulation = modulation * this.randomizeFactor;
    if (!this.onlySlower) {
      // make it possible to be a negative value
      // I.e. from [0..30] to [-15..15]
      modulation = modulation - (speed / 2)
    }
    let result = speed + modulation;
    return Math.max(0, result);
  }
}
