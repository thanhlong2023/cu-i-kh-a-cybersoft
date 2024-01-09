import { Editor } from '@tinymce/tinymce-react'
import { Select, Slider } from 'antd'
import { useFormik } from 'formik'
import { useEffect, useRef, useState } from 'react'

import {
  createTask,
  getPriority,
  getProjectByName,
  getStatus,
  getTaskType,
  getUserByProjectId
} from '~/services/trelloAPI.service'
import { IIFE } from '~/utils'
import * as Y from 'yup'
import { Option } from 'antd/es/mentions'

const validationSchema = Y.object({
  // listUserAsign: Y.string().required(),
  taskName: Y.string().required(),
  description: Y.string().required(),
  statusId: Y.string().required(),
  // originalEstimate: Y.string().required(),
  // timeTrackingSpent: Y.string().required(),
  // timeTrackingRemaining: Y.string().required(),
  projectId: Y.string().required(),
  typeId: Y.string().required(),
  priorityId: Y.string().required()
})

const children = []

for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
}

const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

function Task() {
  const editorRef = useRef(null)
  const [projectSearch, setProjectSearch] = useState([])
  // const [valueProjectId, setValueProjectId] = useState('')
  const [status, setStatus] = useState([])
  const [arrPriority, setArrPriority] = useState([])
  const [arrTaskType, setArrTaskType] = useState([])
  const [assignees, setAssignees] = useState([])
  const [value, setValue] = useState('')
  // const [valueStatus, setValueStatus] = useState('')

  const [timeTracking, setTimetracking] = useState({
    timeTrackingSpent: 0,
    timeTrackingRemaining: 0
  })

  const onChange = (e) => {
    setFieldValue('projectId', e.target.value)
  }
  const onSearch = (value) => {
    IIFE(async () => {
      const resp = await getProjectByName(value)
      setProjectSearch(resp)
    })
  }

  const {
    handleSubmit,
    getFieldProps,
    setFieldValue,
    handleChange,
    touched,
    errors
  } = useFormik({
    initialValues: {
      listUserAsign: [],
      taskName: '',
      description: '',
      statusId: '',
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      projectId: 0,
      typeId: 0,
      priorityId: 0
    },

    validationSchema,

    onSubmit: (values) => {
      const payload = {
        taskName: values.taskName,
        description: values.description,
        statusId: values.statusId,
        originalEstimate: values.originalEstimate,
        timeTrackingSpent: values.timeTrackingSpent,
        timeTrackingRemaining: values.timeTrackingRemaining,
        projectId: values.projectId,
        typeId: values.typeId,
        priorityId: values.priorityId,
        listUserAsign: values.listUserAsign
      }
      console.log(payload)
      createTask(payload, payload.projectId)
        .then((resp) => {
          alert('Tạo task thành công')
        })
        .catch((err) => {
          alert('Tạo task thất bại')
        })
    }
  })

  useEffect(() => {
    IIFE(async () => {
      const resp = await getStatus()
      setStatus(resp)
    })
    IIFE(async () => {
      const resp = await getPriority()
      setArrPriority(resp)
    })
    IIFE(async () => {
      const resp = await getTaskType()
      setArrTaskType(resp)
    })
    IIFE(async () => {
      const resp = await getProjectByName()
      setProjectSearch(resp)
    })
  }, [])
  const children = []
  return (
    <form className="container" onSubmit={handleSubmit}>
      <div className="form-group">
        <p>Project</p>
        <select
          name="projectId"
          className="form-control"
          // {...getFieldProps('projectId')}
          onChange={(e) => {
            const project = e.target.value
            // console.log(project)
            // setValueProjectId(project)
            IIFE(async () => {
              const resp = await getUserByProjectId(project)
              setAssignees(resp)
            })
            setFieldValue('projectId', e.target.value)
          }}
        >
          {projectSearch.map((project, index) => {
            return (
              <option key={index} value={project.id}>
                {project.projectName}
              </option>
            )
          })}
        </select>
        {/* <AutoComplete
          options={projectSearch?.map((user, index) => {
            return { label: user.projectName, value: user.projectId }
          })}
          value={value}
          onChange={(text) => {
            setValue(text)
          }}
          onSelect={(valueSelect, option) => {
            console.log(valueSelect)
            //set giá trị của hộp thọa = option.label
            setValue(option.label)

            IIFE(async () => {
              const resp = await getUserByProjectId(option.value)
              setAssignees(resp)
            })
          }}
          style={{ width: '100%' }}
          onSearch={(value) => {
            IIFE(async () => {
              const resp = await getProjectByName(value)
              setProjectSearch(resp)
            })
          }}
        /> */}
      </div>
      <div className="form-group">
        <p>Task name</p>
        <input
          name="taskName"
          className="form-control"
          {...getFieldProps('taskName')}
        />
        {touched.taskName && errors.taskName && (
          <p className="text-danger">{errors.taskName}</p>
        )}
      </div>
      <div className="form-group">
        <p>Status</p>
        <select
          name="statusId"
          className="form-control"
          // {...getFieldProps('statusId')}
          onChange={handleChange}
        >
          <option value="">Vui lòng chọn Status</option>
          {status.map((statusItem, index) => {
            return (
              <option key={index} value={statusItem.statusId}>
                {statusItem.statusName}
              </option>
            )
          })}
        </select>
        {touched.statusId && errors.statusId && (
          <p className="text-danger">{errors.statusId}</p>
        )}
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-6">
            <p>Priority</p>
            <select
              name="priorityId"
              className="form-control"
              // {...getFieldProps('priorityId')}
              onChange={handleChange}
            >
              <option value="">Vui lòng chọn Priority</option>
              {arrPriority.map((priority, index) => {
                return (
                  <option key={index} value={priority.priorityId}>
                    {priority.priority}
                  </option>
                )
              })}
            </select>
            {touched.priorityId && errors.priorityId && (
              <p className="text-danger">{errors.priorityId}</p>
            )}
          </div>
          <div className="col-6">
            <p>Task type</p>
            <select
              className="form-control"
              name="typeId"
              // {...getFieldProps('typeId')}
              onChange={handleChange}
            >
              <option value="">Vui lòng chọn Task type</option>
              {arrTaskType.map((taskType, index) => {
                return (
                  <option key={index} value={taskType.id}>
                    {taskType.taskType}
                  </option>
                )
              })}
            </select>
            {touched.typeId && errors.typeId && (
              <p className="text-danger">{errors.typeId}</p>
            )}
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-6">
            <p>Assignees</p>
            <Select
              mode="multiple"
              // size={size}
              options={assignees?.map((user, index) => {
                return { label: user.name, value: user.userId.toString() }
              })}
              placeholder="Please select"
              optionFilterProp="label"
              onSelect={(value) => {
                // arrUser.push(value)
              }}
              onChange={(values) => {
                //set lại giá trị cho lstUserAsign
                setFieldValue('listUserAsign', values)
              }}
              style={{ width: '100%' }}
            >
              {children}
            </Select>
            <div className="row mt-3">
              <div className="col-12">
                <p>Original Estimate</p>
                <input
                  type="number"
                  min="0"
                  name="originalEstimate"
                  defaultValue="0"
                  className="form-control"
                  height="30"
                  {...getFieldProps('originalEstimate')}
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            <p>Time tracking</p>

            <Slider
              defaultValue={30}
              value={timeTracking.timeTrackingSpent}
              max={
                Number(timeTracking.timeTrackingSpent) +
                Number(timeTracking.timeTrackingRemaining)
              }
            />
            <div className="row">
              <div className="col-6 text-left font-weight-bold">
                {timeTracking.timeTrackingSpent}h logged
              </div>
              <div className="col-6 text-right font-weight-bold">
                {timeTracking.timeTrackingRemaining}h remaining
              </div>
            </div>
            <div className="row" style={{ marginTop: 5 }}>
              <div className="col-6">
                <p>Time spent</p>
                <input
                  type="number"
                  defaultValue="0"
                  min="0"
                  className="form-control"
                  name="timeTrackingSpent"
                  onChange={(e) => {
                    setTimetracking({
                      ...timeTracking,
                      timeTrackingSpent: e.target.value
                    })

                    setFieldValue('timeTrackingSpent', e.target.value)
                  }}
                  // {...getFieldProps('timeTrackingSpent')}
                />
              </div>

              <div className="col-6">
                <p>Time remaining</p>
                <input
                  type="number"
                  defaultValue="0"
                  min="0"
                  className="form-control"
                  name="timeTrackingRemaining"
                  onChange={(e) => {
                    setTimetracking({
                      ...timeTracking,
                      timeTrackingRemaining: e.target.value
                    })

                    setFieldValue('timeTrackingRemaining', e.target.value)
                  }}
                  // {...getFieldProps('timeTrackingRemaining')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <p>Description</p>
        <Editor
          apiKey="m1t8ixpfa9cyy1q5qo75o5bp7m5vz7ddatuasvre9ji00bpa"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue="<p>Hãy nhập gì đó rồi nhấn Submit nhé</p>"
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'a11ychecker',
              'advlist',
              'advcode',
              'advtable',
              'autolink',
              'checklist',
              'export',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'powerpaste',
              'fullscreen',
              'formatpainter',
              'insertdatetime',
              'media',
              'table',
              'help',
              'wordcount'
            ],
            toolbar:
              'undo redo | casechange blocks | bold italic backcolor | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
          onEditorChange={(content, editor) => {
            setFieldValue('description', content)
          }}
        />
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        submit
      </button>
    </form>
  )
}

export default Task
