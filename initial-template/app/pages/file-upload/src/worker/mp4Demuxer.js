// @ts-check
import { DataStream, createFile } from '../deps/mp4box.0.5.2.js'

/** @typedef {import('./types/mp4Demuxer.js').options} options */
/** @typedef {import('./types/mp4Demuxer.js').onReadyParam} onReadyParam */
/** @typedef {import('./types/mp4Demuxer.js').videoTracks} videoTracks */

export default class MP4Demuxer {

  /** @type {options['onConfig']} */
  #onConfig
  /** @type {options['onChunk']} */
  #onChunk
  #file


  /**
  * @param {ReadableStream} stream 
  * @param {options} options 
  * 
  * @returns {Promise<void>}
  */
  async run(stream, { onConfig, onChunk }) {
    this.#onChunk = onChunk
    this.#onConfig = onConfig

    this.#file = createFile()

    this.#file.onReady = this.#onReady.bind(this);
    this.#file.onSamples = this.#onSamples.bind(this);

    this.#file.onError = (error) =>
      console.error('it broke', error)

    return this.#init(stream)
  }

  /**
  * @param {ReadableStream} stream
  * @returns {Promise<void>}
  */
  #init(stream) {
    let _offset = 0;
    const consumeFile = new WritableStream({
      /** @param {Uint8Array} chunk */
      write: (chunk) => {
        /** @type {ArrayBufferLike & { fileStart: number }} */
        const copy = /** @type {ArrayBufferLike & { fileStart: number }} */ (chunk.buffer)
        copy.fileStart = _offset

        this.#file.appendBuffer(copy);

        _offset += chunk.length
      },
      close: () => {
        this.#file.flush();
      }
    })

    return stream.pipeTo(consumeFile)
  }

  /** 
   * @param {videoTracks} track
   * @returns {DataView | ArrayBuffer | Uint8Array}
   */
  #description({ id }) {

    const track = this.#file.getTrackById(id);
    for (const entry of track.mdia.minf.stbl.stsd.entries) {
      const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C
      if (box) {
        const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
        box.write(stream);
        return new Uint8Array(stream.buffer, 8);
      }
    }

    throw new Error("avcC, hvcC, vpcC, av1C box not found")
  }


  /** @param {onReadyParam} info */
  #onReady(info) {
    const [track] = info.videoTracks
    this.#onConfig({
      codec: track.codec,
      codedHeight: track.video.height,
      codedwidth: track.video.width,
      description: this.#description(track),
      duration: info.duration / info.timescale
    })

    this.#file.setExtractionOptions(track.id)
    this.#file.start()

    // debugger
  }

  /**
   * 
   * @param {number} trackId 
   * @param {unknown} reference 
   * @param {onReadyParam['videoTracks'][]} samples 
   */
  #onSamples(trackId, reference, samples) {
    debugger
  }
}