import React from 'react'

import { Badge } from 'react-bootstrap';
import { Utils } from './Utils'
export default function Badges({ description }) {

    return (
        <Badge style={{ width: "60px" }} bg={Utils.getColor(description)}>{description}</Badge>
    )

}
