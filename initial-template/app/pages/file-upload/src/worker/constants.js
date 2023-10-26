export const qvgaConstraints = {
  with: 320,
  height: 240,
}


export const vgaConstraints = {
  with: 640,
  height: 480,
}

export const hdConstraints = {
  with: 1280,
  height: 720,
}

export const encoderConfigWebM = {
  ...qvgaConstraints,
  birate: 10e6,
  codec: 'vp09.00.10.08',
  pt: 4,
  hardwareAcceleration: 'prefer-software',
}

// const encoderConfigMp4 = {
//   codec: 'avc1.42002A',
//   pt: 1,
//   hardwareAcceleration: 'prefer-software',
//   avc: { format: 'annexb' }
// }
