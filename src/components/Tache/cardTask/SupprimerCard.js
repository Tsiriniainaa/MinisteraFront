import React, { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import DatePicker from 'react-date-picker'
import Swal from 'sweetalert2';
import useSound from 'use-sound';
import deleteSound from '../../sound/delete.mp3'
export default function SupprimerCard({ tache, handleDelete }) {

  const [play] = useSound(deleteSound);
  const handleDeleteL = () => {
    Swal.fire({
      toast: true,
      timer: 4000,
      timerProgressBar: true,
      title: 'Confirm?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Supprimer!'
    }).then((result) => {
      if (result.isConfirmed) {
        play();
        Swal.fire({
          toast: true,
          title: 'Supprimer?',
          icon: 'success',
          // timer: 2000,
          // timerProgressBar: true,
        }
          // 'Supprimer',
          // 'Tache supprimer',
          // 'success'
        ).then(() => {
          handleDelete(tache);
        })
      }
    })
  }
  return (
    <div>
      <OverlayTrigger
        key='top'
        placement='top'
        overlay={
          <Tooltip id={`tooltip-top`}>
            <strong>Delete</strong>.
          </Tooltip>
        }
      >
        <img onClick={handleDeleteL} className='logos' src='../delete.png' />
      </OverlayTrigger>

    </div>
  )
}
