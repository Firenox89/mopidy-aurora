interface IAlbum {
  images: string[]
  name: string
}

interface IArtist {
  name: string
}

export interface ITrack {
  album: IAlbum
  artists: IArtist[]
  comment: string
  length: number
  name: string
  uri: string
}

export interface ITlTrack {
  tlid: number
  track: ITrack
}

