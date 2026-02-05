import React from 'react'

function dateFormater(date) {
  return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
}

export default dateFormater