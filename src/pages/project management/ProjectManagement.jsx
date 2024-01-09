import { DeleteOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import {
  Button,
  Input,
  Space,
  Table,
  Modal,
  Row,
  Col,
  Select,
  Form,
  Popover,
  AutoComplete
} from 'antd'
import { Tag } from 'antd'

import { Avatar } from 'antd'
import { IIFE } from '~/utils'
import { getAllProject, getProjectDetail } from '~/services'
import {
  assignUserProject,
  deleteProject,
  getProjectCategory,
  getUser,
  removeUserFromProject,
  updateProject
} from '~/services/trelloAPI.service'
import { Editor } from '@tinymce/tinymce-react'

import * as Y from 'yup'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'

const validationSchema = Y.object({
  // id: Y.string().required(),
  projectName: Y.string().required(),
  // description: Y.string().required(),
  categoryId: Y.string().required()
})

function ProjectManagement() {
  const { handleSubmit, getFieldProps, touched, errors } = useFormik({
    initialValues: {
      // id: '',
      projectName: '',
      // description: '',
      categoryId: ''
    },

    validationSchema,

    onSubmit: (values) => {
      const payload = {
        id: projectDetail?.id,
        projectName: values.projectName,
        description: editorRef.current.getContent(),
        categoryId: values.categoryId
      }
      // console.log(payload)
      updateProject(payload, payload.id)
        .then((resp) => {
          alert('Cập nhật project thành công')
          IIFE(async () => {
            const resp = await getAllProject()
            setAllProject(resp)
          })
          setOpen(false)
        })
        .catch((err) => {
          alert('Cập nhật project thất bại')
        })
    }
  })
  const [allProject, setAllProject] = useState([])

  const [userSearch, setUserSearch] = useState([])

  const [category, setCategory] = useState([])

  const [value, setValue] = useState('')

  const [projectDetail, setProjectDetail] = useState({})
  const { Option } = Select

  const [open, setOpen] = useState(false)

  const editorRef = useRef(null)

  useEffect(() => {
    IIFE(async () => {
      const resp = await getAllProject()
      setAllProject(resp)
    })
  }, [])

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef(null)

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }
  const handleReset = (clearFilters) => {
    clearFilters()
    setSearchText('')
  }
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
    }) => (
      <div
        style={{
          padding: 8
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block'
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false
              })
              setSearchText(selectedKeys[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  const columnsAPI = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      ...getColumnSearchProps('id'),
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'projectName',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text, record, index) => {
        return <Link to={`/projectdetail/${record.id}`}> {text}</Link>
      },
      // ...getColumnSearchProps('projectName'),
      sorter: (item2, item1) => {
        let projectName1 = item1.projectName?.trim().toLowerCase()
        let projectName2 = item2.projectName?.trim().toLowerCase()
        if (projectName2 < projectName1) {
          return -1
        }
        return 1
      }
    },
    {
      title: 'categoryName',
      dataIndex: 'categoryName',
      key: 'categoryName',
      ...getColumnSearchProps('categoryName')
    },
    {
      title: 'creator',
      key: 'creator',
      render: (text, record) => {
        return <Tag color="magenta">{record.creator.name}</Tag>
      },
      sorter: (item2, item1) => {
        let creator1 = item1.creator?.name.trim().toLowerCase()
        let creator2 = item2.creator?.name.trim().toLowerCase()
        if (creator2 < creator1) {
          return -1
        }
        return 1
      }
    },
    {
      title: 'members',
      key: 'members',
      render: (text, record) => {
        return (
          <div>
            {record.members?.slice(0, 3).map((member, index) => {
              return (
                <Popover
                  key={index}
                  placement="top"
                  title="members"
                  content={() => {
                    return (
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Id</th>
                            <th>avatar</th>
                            <th>name</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {record.members?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.userId}</td>
                                <td>
                                  <img
                                    src={item.avatar}
                                    width="30"
                                    height="30"
                                    style={{ borderRadius: '15px' }}
                                  />
                                </td>
                                <td>{item.name}</td>
                                <td>
                                  <button
                                    onClick={() => {
                                      const userDele = {
                                        projectId: record.id,
                                        userId: item.userId
                                      }
                                      removeUserFromProject(userDele)
                                        .then((resp) => {
                                          alert('Xóa user thành công')
                                          IIFE(async () => {
                                            const resp = await getAllProject()
                                            setAllProject(resp)
                                          })
                                        })
                                        .catch((err) => {
                                          alert(
                                            'Bạn không phải người tạo dự án'
                                          )
                                        })
                                    }}
                                    className="btn btn-danger"
                                    style={{ borderRadius: '50%' }}
                                  >
                                    X
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )
                  }}
                >
                  <Avatar key={index} src={member.avatar} />
                </Popover>
              )
            })}
            {record.members?.length > 3 ? <Avatar>...</Avatar> : ''}
            <Popover
              placement="rightTop"
              title={'Add user'}
              content={() => {
                return (
                  <AutoComplete
                    options={userSearch?.map((user, index) => {
                      return { label: user.name, value: user.userId.toString() }
                    })}
                    value={value}
                    onChange={(text) => {
                      setValue(text)
                    }}
                    onSelect={(valueSelect, option) => {
                      //set giá trị của hộp thọa = option.label
                      setValue(option.label)
                      // console.log(option.label)
                      //Gọi api gửi về backend
                      // console.log(valueSelect)
                      const userProject = {
                        projectId: record.id,
                        userId: valueSelect
                      }

                      assignUserProject(userProject)
                        .then((resp) => {
                          alert('Thêm user thành công')
                          IIFE(async () => {
                            const resp = await getAllProject()
                            setAllProject(resp)
                          })
                        })
                        .catch((err) => {
                          alert('Không phải dự án của bạn')
                        })
                    }}
                    style={{ width: '100%' }}
                    onSearch={(value) => {
                      IIFE(async () => {
                        const resp = await getUser(value)
                        setUserSearch(resp)
                      })
                    }}
                  />
                )
              }}
              trigger="click"
            >
              <Button style={{ borderRadius: '50%' }}>+</Button>
            </Popover>
          </div>
        )
        // return record.members?.slice(0, 3).map((member, index) => {
        //   return (
        //     <Avatar.Group key={index}>
        //       <Avatar src={member.avatar} key={index} />
        //     </Avatar.Group>
        //   )
        // })
      }
    },
    {
      title: 'action',
      dataIndex: '',
      key: 'x',
      render: (text) => {
        return (
          <div>
            <Button
              type="primary"
              icon={<FormOutlined />}
              className="mx-2"
              onClick={() => {
                setOpen(true)
                IIFE(async () => {
                  const resp = await getProjectDetail(text.id)
                  setProjectDetail(resp)
                })
                IIFE(async () => {
                  const resp = await getProjectCategory(text.id)
                  setCategory(resp)
                })
              }}
            />
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              danger
              onClick={() => {
                deleteProject(text.id)
                  .then((resp) => {
                    alert('Xóa project thành công')
                    IIFE(async () => {
                      const resp = await getAllProject()
                      setAllProject(resp)
                    })
                  })
                  .catch((err) => {
                    alert('Không phải dự án của bạn')
                  })
                IIFE(async () => {
                  const resp = await getAllProject()
                  setAllProject(resp)
                })
              }}
            />
          </div>
        )
      }
    }
  ]
  return (
    <div
      style={{
        overflowX: 'scroll',
        scrollbarWidth: 'thin'
      }}
    >
      <Table columns={columnsAPI} dataSource={allProject} />
      <Modal
        title="Edit Project"
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
      >
        <form onSubmit={handleSubmit}>
          <Row gutter={16}>
            <Col span={8}>
              <p>Project ID</p>
              <input
                className="form-control"
                placeholder={projectDetail.id}
                disabled
              />
            </Col>
            <Col span={8}>
              <p>Project Name</p>
              <input
                className="form-control"
                placeholder={projectDetail.projectName}
                {...getFieldProps('projectName')}
              />
              {touched.projectName && errors.projectName && (
                <p className="text-danger">{errors.projectName}</p>
              )}
            </Col>
            <Col span={8}>
              <p>Category</p>
              <select
                className="form-control"
                placeholder={projectDetail.projectCategory?.name}
                {...getFieldProps('categoryId')}
              >
                <option value="">Chọn loại dự án</option>
                {category?.map((item, index) => {
                  return (
                    <option value={item.id} key={index}>
                      {item.projectCategoryName}
                    </option>
                  )
                })}
              </select>
              {touched.categoryId && errors.categoryId && (
                <p className="text-danger">{errors.categoryId}</p>
              )}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <p>Des</p>
              <Editor
                apiKey="m1t8ixpfa9cyy1q5qo75o5bp7m5vz7ddatuasvre9ji00bpa"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue="<p>Nhập nội dung của bạn</p>"
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
                // onEditorChange={log}
              />
            </Col>
          </Row>
          <button type="submit" className="btn btn-primary mt-3">
            Edit project
          </button>
        </form>
      </Modal>
    </div>
  )
}

export default ProjectManagement
