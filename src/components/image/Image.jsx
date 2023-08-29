import React from "react";

const Image = ({width, height, address, title, onClick}) => {
    return (
        <img
            src={address}
            width={width}
            height={height}
            alt={title}
            loading='lazy'
            onClick={onClick}
            style={{
                margin: 'auto',
                display: 'block',
                maxWidth: '100%',
                maxHeight: '100%',
            }}
        />
    )
}

export default Image;