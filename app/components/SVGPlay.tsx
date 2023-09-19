const SVGPlay = ({ className }: { className?: string }) => {
    const svgTest = `
    <svg width="64" height="64" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fill="#ffffff" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM7 6l8 4l-8 4V6z"/>
    </svg>
    `

    const base64String = btoa(svgTest)

    const imgSrc = `data:image/svg+xml;base64,${base64String}`
    return <img src={imgSrc} className={className || ''} />
}

export default SVGPlay
