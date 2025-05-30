// components/youtube-embed.tsx
'use client'
import React from 'react'

type Props = {
  url: string
}

const YoutubeEmbed = ({ url }: Props) => {
  return (
    <div className="w-full aspect-video">
      <iframe
        className="w-full h-full"
        src={url}
        title="YouTube Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}

export default YoutubeEmbed
