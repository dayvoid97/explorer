'use client'

export const AdSenseAd = () => {
  return (
    <div className="bg-red py-100 my-8 flex justify-center">
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8441965953327461"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
        }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-8441965953327461"
        data-ad-slot="6533303772"
      ></ins>
      <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
    </div>
  )
}
