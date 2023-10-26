// @ts-check

export class VideoProcessor {

  #mp4Demuxer

  /**
 * @param {object} Options
 * @param {import('./mp4Demuxer.js').default} Options.mp4Demuxer
 */
  constructor({ mp4Demuxer }) {
    this.#mp4Demuxer = mp4Demuxer
  }

  async mp4Decoder(encoderConfig, stream) {

    // @ts-ignore
    const decoder = new VideoDecoder({
      output(frame) {
        debugger
      },
      error(e) {
        console.error('errpr at mp4Decoder', e)
      }
    })


    this.#mp4Demuxer.run(stream, {
      /** @param {import('./types/videoProcessor.js').onConfigParam} config */
      onConfig(config) {
        decoder.configure()
      },
      onChunk(chunk) {
        debugger
      }
    })
  }

  async start({ file, encoderConfig, sendMessage }) {
    const stream = file.stream()
    const fileName = file.name.split('/').pop().replace('.mp4', '')

    await this.mp4Decoder(encoderConfig, stream);
  }
} 