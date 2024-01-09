import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import HeaderMain from '~/components/Board/HeaderMain'
import InfoMain from '~/components/Board/InfoMain'
import { getProjectDetail } from '~/services'
import { IIFE } from '~/utils'
import './index.css'
import {
  getPriority,
  getStatus,
  getTaskDetail,
  getTaskType,
  removeTask,
  removeUserFromTask,
  updateStatus,
  updateTask
} from '~/services/trelloAPI.service'
import ReactHtmlParser from 'html-react-parser'
import { Editor } from '@tinymce/tinymce-react'
import * as Y from 'yup'
import { useFormik } from 'formik'
import { deleteComment, insertComment } from '~/services/trelloComment.service'

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const validationSchema = Y.object({
  contentComment: Y.string()
})

function Board() {
  const formik = useFormik({
    initialValues: {
      contentComment: ''
    },

    validationSchema,

    onSubmit: (values) => {
      const payload = {
        contentComment: values.contentComment,
        taskId: taskDetailModal.taskId
      }
      // console.log(payload)
      insertComment(payload)
        .then((resp) => {
          // console.log(resp)
          IIFE(async () => {
            const resp = await getTaskDetail(taskID)
            setTaskDetailModal(resp)
          })
        })
        .catch((err) => {
          // console.log(err)
        })
    }
  })

  const handleDragEnd = (result) => {
    let { projectId, taskId } = JSON.parse(result.draggableId)

    // console.log({ projectId, taskId })
    let { source, destination } = result
    if (!result.destination) {
      return
    }
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    ) {
      return
    }
    // console.log(destination.droppableId)
    const payload = {
      taskId: taskId,
      statusId: destination.droppableId
    }
    updateStatus(payload)
      .then((resp) => {
        IIFE(async () => {
          const resp = await getProjectDetail(projectId)
          setProjectDetail(resp)
        })
      })
      .catch((err) => {})
  }

  const [open, setOpen] = useState(false)
  const [projectDetail, setProjectDetail] = useState({})
  // console.log(projectDetail)
  const params = useParams()
  const [taskID, setTaskID] = useState('')

  // const renderCardTaskList = () => {
  //   return projectDetail.lstTask?.map((taskListDetail, index) => {
  //     return (
  //       <div
  //         key={index}
  //         className="card pb-2"
  //         style={{ width: '17rem', height: 'auto' }}
  //       >
  //         <div className="card-header">{taskListDetail.statusName}</div>
  //         <ul className="list-group list-group-flush">
  //           {taskListDetail.lstTaskDeTail.map((task, index) => {
  //             return (
  //               <li
  //                 key={index}
  //                 className="list-group-item"
  //                 style={{ cursor: 'pointer' }}
  //                 data-bs-toggle="modal"
  //                 data-bs-target="#exampleModal"
  //                 onClick={() => {
  //                   // console.log(task.taskId)
  //                   // setOpen(true)
  //                   // console.log(task)
  //                   IIFE(async () => {
  //                     const resp = await getTaskDetail(task.taskId)
  //                     setTaskDetailModal(resp)
  //                   })
  //                   setTaskID(`${task.taskId}`)
  //                 }}
  //               >
  //                 <p className="font-weight-300">{task.taskName}</p>
  //                 <div className="block" style={{ display: 'flex' }}>
  //                   <div className="block-left">
  //                     <p className="text-danger">
  //                       {task.priorityTask.priority}
  //                     </p>
  //                   </div>
  //                   <div className="block-right">
  //                     <div className="avatar-group" style={{ display: 'flex' }}>
  //                       {task.assigness.map((mem, index) => {
  //                         return (
  //                           <div className="avatar" key={index}>
  //                             <img src={mem.avatar} alt={mem.avatar} />
  //                           </div>
  //                         )
  //                       })}
  //                     </div>
  //                   </div>
  //                 </div>
  //               </li>
  //             )
  //           })}
  //         </ul>
  //       </div>
  //     )
  //   })
  // }
  const renderCardTaskList = () => {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        {projectDetail.lstTask?.map((taskListDetail, index) => {
          return (
            <Droppable key={index} droppableId={taskListDetail.statusId}>
              {(provided) => {
                return (
                  <div
                    className="card pb-2"
                    style={{ width: '17rem', height: 'auto' }}
                  >
                    <div className="card-header">
                      {taskListDetail.statusName}
                    </div>
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      key={index}
                      className="list-group list-group-flush"
                      style={{ height: '100%' }}
                    >
                      {taskListDetail.lstTaskDeTail.map((task, index) => {
                        return (
                          <Draggable
                            key={task.taskId.toString()}
                            index={index}
                            draggableId={JSON.stringify({
                              projectId: task.projectId,
                              taskId: task.taskId
                            })}
                          >
                            {(provided) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  key={index}
                                  className="list-group-item"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                  onClick={() => {
                                    // console.log(task.taskId)
                                    // setOpen(true)
                                    // console.log(task)
                                    IIFE(async () => {
                                      const resp = await getTaskDetail(
                                        task.taskId
                                      )
                                      setTaskDetailModal(resp)
                                    })
                                    setTaskID(`${task.taskId}`)
                                  }}
                                >
                                  <p className="font-weight-300">
                                    {task.taskName}
                                  </p>
                                  <div
                                    className="block"
                                    style={{ display: 'flex' }}
                                  >
                                    <div className="block-left">
                                      <p className="text-danger">
                                        {task.priorityTask.priority}
                                      </p>
                                      {/* <i className="fa fa-bookmark" />
                                    <i className="fa fa-arrow-up" /> */}
                                    </div>
                                    <div className="block-right">
                                      <div
                                        className="avatar-group"
                                        style={{ display: 'flex' }}
                                      >
                                        {task.assigness.map((mem, index) => {
                                          return (
                                            <div className="avatar" key={index}>
                                              <img
                                                src={mem.avatar}
                                                alt={mem.avatar}
                                              />
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            }}
                          </Draggable>
                        )
                      })}

                      {provided.placeholder}
                    </div>
                  </div>
                )
              }}
            </Droppable>
          )
        })}
      </DragDropContext>
    )
  }
  // ------------------------------------- modal
  const [taskDetailModal, setTaskDetailModal] = useState({})

  const [arrStatus, setArrStatus] = useState([])
  const [arrPriority, setArrPriority] = useState([])
  const [arrTaskType, setArrTaskType] = useState([])

  const [visibleEditor, setVisibleEditor] = useState(false)
  const [visibleEditCommemt, setVisibleEditcomment] = useState(false)
  const [historyContent, setHistoryContent] = useState(
    taskDetailModal.description
  )
  const [historyComment, setHistoryComment] = useState(
    taskDetailModal.description
  )
  const [content, setContent] = useState(taskDetailModal.description)
  // console.log(taskDetailModal.lstComment)
  useEffect(() => {
    IIFE(async () => {
      const resp = await getStatus()
      setArrStatus(resp)
    })
    IIFE(async () => {
      const resp = await getPriority()
      setArrPriority(resp)
    })
    IIFE(async () => {
      if (params.idDetail) {
        const resp = await getProjectDetail(params.idDetail)
        setProjectDetail(resp)
      }
    })
    IIFE(async () => {
      const resp = await getTaskType()
      setArrTaskType(resp)
    })
  }, [])

  // console.log('taskDetailModal', taskDetailModal)
  // console.log(projectDetail.members)

  const renderDescription = () => {
    const jsxDescription = ReactHtmlParser(`${taskDetailModal.description}`)
    return (
      <div>
        {visibleEditor ? (
          <div>
            {' '}
            <Editor
              apiKey="m1t8ixpfa9cyy1q5qo75o5bp7m5vz7ddatuasvre9ji00bpa"
              name="description"
              initialValue={taskDetailModal.description}
              init={{
                selector: 'textarea#myTextArea',
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help'
              }}
              onEditorChange={(content) => {
                setContent(content)
                // console.log(content)
              }}
            />
            <button
              className="btn btn-primary m-2"
              onClick={() => {
                const taskUpdate = {
                  ...taskDetailModal,
                  description: content
                }
                updateTask(taskUpdate)
                  .then((resp) => {
                    IIFE(async () => {
                      const resp = await getTaskDetail(taskID)
                      setTaskDetailModal(resp)
                    })
                  })
                  .catch((err) => {})
                setVisibleEditor(false)
              }}
            >
              Save
            </button>
            <button
              className="btn btn-primary m-2"
              onClick={() => {
                const taskUpdate = {
                  ...taskDetailModal,
                  description: historyContent
                }
                updateTask(taskUpdate)
                  .then((resp) => {
                    IIFE(async () => {
                      const resp = await getTaskDetail(taskID)
                      setTaskDetailModal(resp)
                    })
                  })
                  .catch((err) => {
                    alert('Không phải dự án của bạn')
                  })

                setVisibleEditor(false)
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <div
            onClick={() => {
              setHistoryContent(taskDetailModal.description)
              setVisibleEditor(!visibleEditor)
            }}
          >
            {jsxDescription}
          </div>
        )}
      </div>
    )
  }

  const renderTimeTracking = () => {
    const { timeTrackingSpent, timeTrackingRemaining } = taskDetailModal

    const max = Number(timeTrackingSpent) + Number(timeTrackingRemaining)
    const percent = Math.round((Number(timeTrackingSpent) / max) * 100)

    return (
      <div>
        <div style={{ display: 'flex' }}>
          <i className="fa fa-clock" />
          <div style={{ width: '100%' }}>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percent}%` }}
                aria-valuenow={Number(timeTrackingSpent)}
                aria-valuemin={Number(timeTrackingRemaining)}
                aria-valuemax={max}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="logged">{Number(timeTrackingSpent)}h logged</p>
              <p className="estimate-time">
                {Number(timeTrackingRemaining)}h remaining
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <input
              className="form-control"
              name="timeTrackingSpent"
              onChange={handleChange}
            />
          </div>
          <div className="col-6">
            <input
              className="form-control"
              name="timeTrackingRemaining"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const taskUpdate = {
      ...taskDetailModal,
      [name]: value
    }
    // console.log(taskUpdate)
    updateTask(taskUpdate)
      .then((resp) => {
        IIFE(async () => {
          const resp = await getTaskDetail(taskID)
          setTaskDetailModal(resp)
        })
        IIFE(async () => {
          if (params.idDetail) {
            const resp = await getProjectDetail(params.idDetail)
            setProjectDetail(resp)
          }
        })
      })
      .catch((err) => {
        alert('Không phải dự án của bạn')
      })
  }
  // console.log(taskDetailModal)
  // console.log(taskDetailModal.assigness)
  return (
    <div>
      <HeaderMain projectDetail={projectDetail} />
      <InfoMain projectDetail={projectDetail} idProject={params?.idDetail} />

      <>
        <div className="content" style={{ display: 'flex' }}>
          {renderCardTaskList()}
        </div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <div className="task-title">
                  <i className="fa fa-bookmark mx-1" />
                  <select
                    name="typeId"
                    value={taskDetailModal.typeId}
                    onChange={handleChange}
                  >
                    {arrTaskType?.map((tp, index) => {
                      return (
                        <option value={tp.id} key={index}>
                          {tp.taskType}
                        </option>
                      )
                    })}
                  </select>
                  <span style={{ fontWeight: '500', fontSize: '15px' }}>
                    {taskDetailModal.taskName}
                  </span>
                </div>
                <div style={{ display: 'flex' }} className="task-click">
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      console.log(taskDetailModal.taskId)
                      removeTask(taskDetailModal?.taskId)
                        .then((resp) => {
                          IIFE(async () => {
                            const resp = await getTaskDetail(taskID)
                            setTaskDetailModal(resp)
                          })
                          IIFE(async () => {
                            if (params.idDetail) {
                              const resp = await getProjectDetail(
                                params.idDetail
                              )
                              setProjectDetail(resp)
                            }
                          })
                        })
                        .catch((err) => {
                          alert('Không phải comment của bạn')
                        })
                    }}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <i className="fa fa-trash-alt"></i>
                    <span style={{ paddingRight: 20 }}>Delete</span>
                  </div>
                </div>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-8">
                      <p className="issue">
                        This is an issue of type:{' '}
                        {taskDetailModal.taskTypeDetail?.taskType}
                      </p>
                      <div className="description">
                        <p>Description</p>
                        {renderDescription()}
                      </div>
                      <div className="comment">
                        <h6>Comment</h6>
                        <div
                          className="block-comment"
                          style={{ display: 'flex' }}
                        >
                          <div className="avatar">
                            {/* <img src={img} alt="xyz" /> */}
                            <i
                              className="fa fa-comment"
                              style={{ fontSize: '20px' }}
                            ></i>
                          </div>
                          <div className="input-comment">
                            <input
                              type="text"
                              placeholder="Add a comment ..."
                              {...formik.getFieldProps('contentComment')}
                            />
                            {formik.touched.contentComment &&
                              formik.errors.contentComment && (
                                <p className="text-danger">
                                  {formik.errors.contentComment}
                                </p>
                              )}
                            <p>
                              <button
                                className="btn btn-outline-light mt-2"
                                style={{ fontWeight: 500, color: 'gray' }}
                                onClick={formik.handleSubmit}
                              >
                                Comment
                              </button>
                            </p>
                          </div>
                        </div>
                        <div className="lastest-comment">
                          {taskDetailModal.lstComment?.map((cmt, index) => {
                            return (
                              <div className="comment-item" key={index}>
                                <div
                                  className="display-comment"
                                  style={{ display: 'flex' }}
                                >
                                  <div className="avatar">
                                    <img src={cmt.avatar} alt="xyz" />
                                  </div>
                                  <div className="mb-1">
                                    <p style={{ marginBottom: 5 }}>
                                      {cmt.name}
                                    </p>
                                    <p style={{ marginBottom: 5 }}>
                                      {cmt.commentContent}
                                    </p>
                                    <div className="d-flex">
                                      <div>
                                        {visibleEditCommemt ? (
                                          <div>
                                            <input type="text" />
                                            <button
                                              className="btn btn-outline-light m-2"
                                              style={{
                                                fontWeight: 500,
                                                color: 'gray'
                                              }}
                                              onClick={() => {
                                                setVisibleEditcomment(false)
                                              }}
                                            >
                                              Save
                                            </button>
                                            <button
                                              className="btn btn-outline-light m-2"
                                              style={{
                                                fontWeight: 500,
                                                color: 'gray'
                                              }}
                                              onClick={() => {
                                                setVisibleEditcomment(false)
                                              }}
                                            >
                                              Close
                                            </button>
                                          </div>
                                        ) : (
                                          <div
                                            onClick={() => {
                                              setHistoryContent(
                                                taskDetailModal.description
                                              )
                                              setVisibleEditcomment(
                                                !visibleEditCommemt
                                              )
                                            }}
                                            style={{ cursor: 'pointer' }}
                                          >
                                            <span style={{ color: '#929398' }}>
                                              Edit
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      {/* <span style={{ color: '#929398' }}>
                                        Edit
                                      </span> */}
                                      •
                                      <span
                                        style={{
                                          color: '#929398',
                                          cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                          deleteComment(cmt.id)
                                            .then((resp) => {
                                              IIFE(async () => {
                                                const resp =
                                                  await getTaskDetail(taskID)
                                                setTaskDetailModal(resp)
                                              })
                                            })
                                            .catch((err) => {
                                              alert(
                                                'Không phải comment của bạn'
                                              )
                                            })
                                        }}
                                      >
                                        Delete
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="status">
                        <h6>STATUS</h6>
                        <select
                          name="statusId"
                          className="custom-select"
                          value={taskDetailModal.statusId}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                        >
                          {arrStatus.map((status, index) => {
                            return (
                              <option value={status.statusId} key={index}>
                                {status.statusName}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                      <div className="assignees">
                        <h6>ASSIGNEES</h6>
                        <div className="row">
                          {taskDetailModal.assigness?.map((user, index) => {
                            return (
                              <div className="col-6  mt-2 mb-2" key={index}>
                                <div
                                  style={{ display: 'flex' }}
                                  className="item"
                                >
                                  <div className="avatar">
                                    <img src={user.avatar} alt={user.avatar} />
                                  </div>
                                  <p className="name mt-1 ml-1">
                                    {user.name}
                                    <i
                                      className="fa fa-times"
                                      style={{
                                        marginLeft: 5,
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => {
                                        const payload = {
                                          taskId: taskDetailModal.taskId,
                                          userId: user.id
                                        }
                                        // console.log(payload)
                                        removeUserFromTask(payload)
                                          .then((resp) => {
                                            IIFE(async () => {
                                              const resp = await getTaskDetail(
                                                taskDetailModal.taskId
                                              )
                                              setTaskDetailModal(resp)
                                            })
                                            IIFE(async () => {
                                              if (params.idDetail) {
                                                const resp =
                                                  await getProjectDetail(
                                                    params.idDetail
                                                  )
                                                setProjectDetail(resp)
                                              }
                                            })
                                          })
                                          .catch((err) => {})
                                      }}
                                    />
                                  </p>
                                </div>
                              </div>
                            )
                          })}

                          <div className="col-6  mt-2 mb-2">
                            <select
                              name=""
                              value={'+ Add user'}
                              onChange={(e) => {
                                if (e.target.value == '0') {
                                  return
                                }
                                let userSelected = projectDetail?.members.find(
                                  (mem) => mem.userId == e.target.value
                                )
                                // console.log(e.target.value)

                                userSelected = {
                                  // ...userSelected,
                                  id: userSelected.userId
                                }
                                // console.log(userSelected)
                                // let listUser = taskDetailModal.assigness
                                let arrUser = [
                                  ...taskDetailModal.assigness.map(
                                    (item, index) => item.id
                                  )
                                ]
                                // console.log(arrUser)
                                const payload = [...arrUser, userSelected.id]
                                const taskUpdate = {
                                  ...taskDetailModal,
                                  listUserAsign: payload
                                }
                                // console.log(payload)
                                // console.log(taskUpdate)
                                updateTask(taskUpdate)
                                  .then((resp) => {
                                    IIFE(async () => {
                                      const resp = await getTaskDetail(taskID)
                                      setTaskDetailModal(resp)
                                    })
                                    IIFE(async () => {
                                      if (params.idDetail) {
                                        const resp = await getProjectDetail(
                                          params.idDetail
                                        )
                                        setProjectDetail(resp)
                                      }
                                    })
                                  })
                                  .catch((err) => {
                                    console.log(err)
                                    alert('Chưa được update')
                                  })
                              }}
                            >
                              <option value="0">+ Add user</option>
                              {projectDetail.members
                                ?.filter((mem) => {
                                  let index =
                                    taskDetailModal.assigness?.findIndex(
                                      (us) => us.id === mem.userId
                                    )
                                  if (index !== -1) {
                                    return false
                                  }
                                  return true
                                })
                                .map((mem, index) => {
                                  return (
                                    <option key={index} value={mem.userId}>
                                      {mem.name}
                                    </option>
                                  )
                                })}
                            </select>
                            {/* <Select
                              options={projectDetail.members
                                ?.filter((mem) => {
                                  let index =
                                    taskDetailModal.assigness?.findIndex(
                                      (us) => us.id === mem.userId
                                    )
                                  if (index !== -1) {
                                    return false
                                  }
                                  return true
                                })
                                .map((mem, index) => {
                                  return { value: mem.userId, label: mem.name }
                                })}
                              optionFilterProp="label"
                              style={{ width: '100%' }}
                              name="lstUser"
                              value="+ Add more"
                              className="form-control"
                              onSelect={(value) => {
                                if (value == '0') {
                                  return
                                }
                                let userSelected = projectDetail.members.find(
                                  (mem) => mem.userId == value
                                )
                                userSelected = {
                                  ...userSelected,
                                  id: userSelected.userId
                                }

                                let listUser = taskDetailModal.assigness
                                const payload = [...listUser, userSelected]
                                const taskUpdate = {
                                  ...taskDetailModal,
                                  listUserAsign: payload
                                }
                                // console.log(taskDetailModal.assigness)
                                updateTask(taskUpdate)
                                  .then((resp) => {
                                    IIFE(async () => {
                                      const resp = await getTaskDetail(taskID)
                                      setTaskDetailModal(resp)
                                    })
                                  })
                                  .catch((err) => {
                                    alert('Không phải dự án của bạn')
                                  })
                              }}
                            ></Select> */}
                          </div>
                        </div>
                      </div>

                      <div className="priority" style={{ marginBottom: 20 }}>
                        <h6>PRIORITY</h6>
                        <select
                          name="priorityId"
                          className="form-control"
                          value={taskDetailModal.priorityId}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                        >
                          {arrPriority.map((item, index) => {
                            return (
                              <option key={index} value={item.priorityId}>
                                {item.priority}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                      <div className="estimate">
                        <h6>ORIGINAL ESTIMATE (HOURS)</h6>
                        <input
                          name="originalEstimate"
                          type="text"
                          className="estimate-hours"
                          value={taskDetailModal.originalEstimate}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                        />
                      </div>
                      <div className="time-tracking">
                        <h6>TIME TRACKING</h6>
                        {renderTimeTracking()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <Modal
          title="Edit Task"
          centered
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={1000}
        >
          <div className="modal-content">
            <div className="modal-header">
              <div className="task-title">
                <i className="fa fa-bookmark mx-1" />
                <select
                  name="typeId"
                  value={taskDetailModal.typeId}
                  onChange={handleChange}
                >
                  {arrTaskType?.map((tp, index) => {
                    return (
                      <option value={tp.id} key={index}>
                        {tp.taskType}
                      </option>
                    )
                  })}
                </select>
                8<span>{taskDetailModal.taskName}</span>
              </div>
              <div style={{ display: 'flex' }} className="task-click">
                <div>
                  <i className="fab fa-telegram-plane" />
                  <span style={{ paddingRight: 20 }}>Give feedback</span>
                </div>
                <div>
                  <i className="fa fa-link" />
                  <span style={{ paddingRight: 20 }}>Copy link</span>
                </div>
                <i
                  className="fa fa-trash-alt='xyz'"
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-8">
                    <p className="issue">
                      This is an issue of type:{' '}
                      {taskDetailModal.taskTypeDetail?.taskType}
                    </p>
                    <div className="description">
                      <p>Description</p>
                      {renderDescription()}
                    </div>
                    <div className="comment">
                      <h6>Comment</h6>
                      <div
                        className="block-comment"
                        style={{ display: 'flex' }}
                      >
                        <div className="avatar">
                          <img src={img} alt="xyz" />
                        </div>
                        <div className="input-comment">
                          <input
                            type="text"
                            placeholder="Add a comment ..."
                            {...formik.getFieldProps('contentComment')}
                          />
                          {formik.touched.contentComment &&
                            formik.errors.contentComment && (
                              <p className="text-danger">
                                {formik.errors.contentComment}
                              </p>
                            )}
                          <p>
                            <button
                              className="btn btn-outline-light mt-2"
                              style={{ fontWeight: 500, color: 'gray' }}
                              onClick={formik.handleSubmit}
                            >
                              Comment
                            </button>
                          </p>
                        </div>
                      </div>
                      <div className="lastest-comment">
                        {taskDetailModal.lstComment?.map((cmt, index) => {
                          return (
                            <div className="comment-item" key={index}>
                              <div
                                className="display-comment"
                                style={{ display: 'flex' }}
                              >
                                <div className="avatar">
                                  <img src={cmt.avatar} alt="xyz" />
                                </div>
                                <div className="mb-1">
                                  <p style={{ marginBottom: 5 }}>{cmt.name}</p>
                                  <p style={{ marginBottom: 5 }}>
                                    {cmt.commentContent}
                                  </p>
                                  <div>
                                    <span style={{ color: '#929398' }}>
                                      Edit
                                    </span>
                                    •
                                    <span
                                      style={{
                                        color: '#929398',
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => {
                                        deleteComment(cmt.id)
                                          .then((resp) => {
                                            alert('Đã xóa comment')
                                          })
                                          .catch((err) => {
                                            alert('Không phải comment của bạn')
                                          })
                                      }}
                                    >
                                      Delete
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="status">
                      <h6>STATUS</h6>
                      <select
                        name="statusId"
                        className="custom-select"
                        value={taskDetailModal.statusId}
                        onChange={(e) => {
                          handleChange(e)
                        }}
                      >
                        {arrStatus.map((status, index) => {
                          return (
                            <option value={status.statusId} key={index}>
                              {status.statusName}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="assignees">
                      <h6>ASSIGNEES</h6>
                      <div className="row">
                        {taskDetailModal.assigness?.map((user, index) => {
                          return (
                            <div className="col-6  mt-2 mb-2" key={index}>
                              <div style={{ display: 'flex' }} className="item">
                                <div className="avatar">
                                  <img src={user.avatar} alt={user.avatar} />
                                </div>
                                <p className="name mt-1 ml-1">
                                  {user.name}
                                  <i
                                    className="fa fa-times"
                                    style={{ marginLeft: 5, cursor: 'pointer' }}
                                    onClick={() => {
                                      // dispatch({
                                      //   type: HANDLE_CHANGE_POST_API_SAGA,
                                      //   actionType: REMOVE_USER_ASSIGN,
                                      //   userId: user.id
                                      // })
                                      // dispatch({
                                      //     type:REMOVE_USER_ASSIGN,
                                      //     userId:user.id
                                      // })
                                    }}
                                  />
                                </p>
                              </div>
                            </div>
                          )
                        })}

                        <div className="col-6  mt-2 mb-2">
                          <Select
                            options={projectDetail.members
                              ?.filter((mem) => {
                                let index =
                                  taskDetailModal.assigness?.findIndex(
                                    (us) => us.id === mem.userId
                                  )
                                if (index !== -1) {
                                  return false
                                }
                                return true
                              })
                              .map((mem, index) => {
                                return { value: mem.userId, label: mem.name }
                              })}
                            optionFilterProp="label"
                            style={{ width: '100%' }}
                            name="lstUser"
                            value="+ Add more"
                            className="form-control"
                            onSelect={(value) => {
                              if (value == '0') {
                                return
                              }
                              let userSelected = projectDetail.members.find(
                                (mem) => mem.userId == value
                              )
                              userSelected = {
                                ...userSelected,
                                id: userSelected.userId
                              }

                              let listUser = taskDetailModal.assigness
                              const payload = [...listUser, userSelected]
                              const taskUpdate = {
                                ...taskDetailModal,
                                listUserAsign: payload
                              }
                              console.log(taskDetailModal)
                              updateTask(taskUpdate)
                                .then((resp) => {
                                  IIFE(async () => {
                                    const resp = await getTaskDetail(taskID)
                                    setTaskDetailModal(resp)
                                  })
                                })
                                .catch((err) => {
                                  alert('Không phải dự án của bạn')
                                })
                            }}
                          ></Select>
                        </div>
                      </div>
                    </div>

                    <div className="priority" style={{ marginBottom: 20 }}>
                      <h6>PRIORITY</h6>
                      <select
                        name="priorityId"
                        className="form-control"
                        value={taskDetailModal.priorityId}
                        onChange={(e) => {
                          handleChange(e)
                        }}
                      >
                        {arrPriority.map((item, index) => {
                          return (
                            <option key={index} value={item.priorityId}>
                              {item.priority}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="estimate">
                      <h6>ORIGINAL ESTIMATE (HOURS)</h6>
                      <input
                        name="originalEstimate"
                        type="text"
                        className="estimate-hours"
                        value={taskDetailModal.originalEstimate}
                        onChange={(e) => {
                          handleChange(e)
                        }}
                      />
                    </div>
                    <div className="time-tracking">
                      <h6>TIME TRACKING</h6>
                      {renderTimeTracking()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal> */}
      </>
    </div>
  )
}

export default Board
