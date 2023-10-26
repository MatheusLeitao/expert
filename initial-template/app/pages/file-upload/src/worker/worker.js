import { VideoProcessor } from "./videoProcessor.js";
import { encoderConfigWebM } from "./constants.js"
import MP4Demuxer from "./mp4Demuxer.js";

const mp4Demuxer = new MP4Demuxer();
const videoProcessor = new VideoProcessor({
  mp4Demuxer
});

onmessage = async ({ data }) => {
  await videoProcessor.start({
    file: data.file,
    encoderConfig: encoderConfigWebM,
    sendMessage(message) {
      self.postMessage(message);
    }
  })

  setTimeout(() => {
    self.postMessage({ status: 'done' })
  }, 2000);
}