import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ContentMain from '~/components/Board/ContentMain'
import HeaderMain from '~/components/Board/HeaderMain'
import InfoMain from '~/components/Board/InfoMain'
import { getProjectDetail } from '~/services'
import { IIFE } from '~/utils'
import './index.css'

function Board() {
  const [projectDetail, setProjectDetail] = useState({})
  // console.log(projectDetail.lstTask)

  const params = useParams()

  useEffect(() => {
    IIFE(async () => {
      if (params.idDetail) {
        const resp = await getProjectDetail(params.idDetail)
        setProjectDetail(resp)
      }
    })
  }, [params.idDetail])
  // console.log(projectDetail)
  return (
    <div>
      <HeaderMain projectDetail={projectDetail} />
      <InfoMain projectDetail={projectDetail} />

      <ContentMain projectDetail={projectDetail} />
    </div>
  )
}

export default Board
