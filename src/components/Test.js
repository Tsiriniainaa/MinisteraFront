import React from 'react'
import { Col, Row } from 'react-bootstrap'
import './test.css'
export default function Test() {
  return (
    <div >
        <Row>
            <Col className='divDragable1' draggable>Column</Col>

            <Col className='divDragable2' draggable>aaaaaaaaaaaarrrr</Col>
        </Row>
    </div>
  )
}
